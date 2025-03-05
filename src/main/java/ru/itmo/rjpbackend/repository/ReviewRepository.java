package ru.itmo.rjpbackend.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import ru.itmo.rjpbackend.entity.ReviewEntity;

@Repository
public interface ReviewRepository extends ReactiveCrudRepository<ReviewEntity, Integer> {
}
