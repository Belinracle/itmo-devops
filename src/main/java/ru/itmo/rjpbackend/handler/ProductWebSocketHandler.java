package ru.itmo.rjpbackend.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;
import reactor.core.scheduler.Schedulers;
import ru.itmo.rjpbackend.dto.FilterDTO;
import ru.itmo.rjpbackend.dto.ProductDTO;
import ru.itmo.rjpbackend.entity.ProductEntity;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
@RequiredArgsConstructor
public class ProductWebSocketHandler implements WebSocketHandler {
    private final ObjectMapper objectMapper;
    private final Map<String, FilterDTO> filtersOfClients = new ConcurrentHashMap<>();
    private final Map<String, Sinks.Many<ProductDTO>> sinksOfClients = new ConcurrentHashMap<>();

    @NonNull
    @Override
    public Mono<Void> handle(@NonNull WebSocketSession session) {
        log.info("WS client {} connected", session.getId());
        sinksOfClients.put(session.getId(), Sinks.many().unicast().onBackpressureBuffer());

        Mono<Void> input = session.receive()
                .map(WebSocketMessage::getPayloadAsText)
                .map(this::textToFilterDTO)
                .doOnNext(filter -> filtersOfClients.put(session.getId(), filter))
                .then();

        Mono<Void> output = session.send(sinksOfClients.get(session.getId())
                .asFlux()
                .map(this::productDTOtoText)
                .map(session::textMessage));

        Mono<Void> cleanup = Mono.fromRunnable(() -> {
            sinksOfClients.remove(session.getId());
            filtersOfClients.remove(session.getId());
            log.info("WS client {} disconnected", session.getId());
        });

        return Mono.zip(input, output).then(cleanup);
    }

    public Mono<Void> sendProduct(ProductEntity productEntity, Double totalAvgRating) {
        return Flux.fromIterable(filtersOfClients.entrySet())
                .parallel()
                .runOn(Schedulers.parallel())
                .filter(entry -> productMatchesFilter(productEntity, entry.getValue()))
                .doOnNext(entry -> sinksOfClients.get(entry.getKey()).tryEmitNext(new ProductDTO(
                        productEntity.getId(),
                        productEntity.getPrice(),
                        productEntity.getAvgRating(),
                        productEntity.getReviewCount(),
                        productEntity.getName(),
                        null,
                        null,
                        null,
                        null,
                        totalAvgRating,
                        null
                )))
                .then();
    }

    private boolean productMatchesFilter(ProductEntity product, FilterDTO filter) {
        return (filter.fromPrice() == null || product.getPrice() >= filter.fromPrice()) &&
                (filter.toPrice() == null || product.getPrice() <= filter.toPrice()) &&
                (filter.fromRating() == null || product.getAvgRating() >= filter.fromRating()) &&
                (filter.toRating() == null || product.getAvgRating() <= filter.toRating()) &&
                (filter.manufacturers() == null || filter.manufacturers().contains(product.getManufacturerId())) &&
                (filter.countries() == null || filter.countries().contains(product.getCountryId())) &&
                (filter.fromDate() == null || product.getReleaseDate().isAfter(filter.fromDate().minusDays(1))) &&
                (filter.toDate() == null || product.getReleaseDate().isBefore(filter.toDate().plusDays(1)));
    }

    @SneakyThrows
    private FilterDTO textToFilterDTO(String text) {
        return objectMapper.readValue(text, FilterDTO.class);
    }

    @SneakyThrows
    private String productDTOtoText(ProductDTO product) {
        return objectMapper.writeValueAsString(product);
    }
}
