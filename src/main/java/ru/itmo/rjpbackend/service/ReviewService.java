package ru.itmo.rjpbackend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import ru.itmo.rjpbackend.entity.ReviewEntity;
import ru.itmo.rjpbackend.repository.ReviewRepository;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;

    public Mono<ReviewEntity> save(ReviewEntity reviewEntity) {
        return reviewRepository.save(reviewEntity);
    }
}
