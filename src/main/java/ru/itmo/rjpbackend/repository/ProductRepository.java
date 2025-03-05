package ru.itmo.rjpbackend.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import ru.itmo.rjpbackend.entity.ProductEntity;

@Repository
public interface ProductRepository extends ReactiveCrudRepository<ProductEntity, Integer> {
    @Query("SELECT * FROM Product ORDER BY RANDOM() LIMIT $1")
    Flux<ProductEntity> findRandomLimit(Integer limit);
}
