package ru.itmo.rjpbackend.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import ru.itmo.rjpbackend.entity.CountryEntity;

@Repository
public interface CountryRepository extends ReactiveCrudRepository<CountryEntity, Integer> {
}
