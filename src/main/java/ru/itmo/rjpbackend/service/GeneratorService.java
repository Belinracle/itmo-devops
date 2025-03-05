package ru.itmo.rjpbackend.service;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.datafaker.Faker;
import org.springframework.stereotype.Service;
import reactor.core.Disposable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;
import ru.itmo.rjpbackend.entity.ReviewEntity;
import ru.itmo.rjpbackend.handler.ProductWebSocketHandler;

import java.time.Duration;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.concurrent.atomic.AtomicBoolean;

@Slf4j
@Service
@RequiredArgsConstructor
public class GeneratorService {
    private final Faker faker = new Faker();
    private final ReviewService reviewService;
    private final ProductService productService;
    private final ProductWebSocketHandler productWebSocketHandler;

    @Getter
    private final AtomicBoolean isRunning = new AtomicBoolean(false);
    private Disposable task;

    @Getter
    private Integer reviewsNum;

    @Getter
    private Long intervalInMillis;

    public void start(Integer reviewsNum, Long intervalInMillis) {
        if (isRunning.get()) {
            stop();
        }

        isRunning.set(true);
        this.reviewsNum = reviewsNum;
        this.intervalInMillis = intervalInMillis;
        log.info("Starting review generation (will generate {} reviews each {}ms)", reviewsNum, intervalInMillis);
        task = Flux.interval(Duration.ofMillis(intervalInMillis))
                .onBackpressureBuffer()
                .doOnNext(tick -> log.info("Executing review generation"))
                .doOnTerminate(() -> {
                    isRunning.set(false);
                    this.reviewsNum = null;
                    this.intervalInMillis = null;
                })
                .flatMap(tick -> generateReviews(reviewsNum))
                .subscribe();
    }

    public void stop() {
        if (isRunning.get() && task != null && !task.isDisposed()) {
            isRunning.set(false);
            this.reviewsNum = null;
            this.intervalInMillis = null;
            log.info("Review generation stopped");
            task.dispose();
        }
    }

    public Mono<Void> generateReviews(Integer reviewsNum) {
        return productService.findNRandom(reviewsNum)
                .parallel()
                .runOn(Schedulers.boundedElastic())
                .flatMap(productEntity -> {
                    ReviewEntity reviewEntity = new ReviewEntity(
                            null,
                            ZonedDateTime.now(ZoneId.systemDefault()),
                            faker.internet().username(),
                            faker.number().numberBetween(1, 5),
                            productEntity.getId()
                    );
                    Double oldAvgRating = productEntity.getAvgRating();
                    productEntity.setAvgRating((productEntity.getAvgRating() * productEntity.getReviewCount()
                            + reviewEntity.getRating()) / (productEntity.getReviewCount() + 1));
                    productEntity.setReviewCount(productEntity.getReviewCount() + 1);
                    return Mono.zip(
                            reviewService.save(reviewEntity).then(productService.save(productEntity)),
                            Mono.just(productEntity.getAvgRating() - oldAvgRating)
                    );
                })
                .flatMap(tuple -> productWebSocketHandler.sendProduct(tuple.getT1(), tuple.getT2()))
                .then();
    }
}
