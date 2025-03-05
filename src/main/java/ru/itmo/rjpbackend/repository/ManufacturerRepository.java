package ru.itmo.rjpbackend.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import ru.itmo.rjpbackend.entity.ManufacturerEntity;

@Repository
public interface ManufacturerRepository extends ReactiveCrudRepository<ManufacturerEntity, Integer> {
}
