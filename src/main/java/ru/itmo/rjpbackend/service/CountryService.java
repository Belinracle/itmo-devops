package ru.itmo.rjpbackend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import ru.itmo.rjpbackend.entity.CountryEntity;
import ru.itmo.rjpbackend.repository.CountryRepository;

@Service
@RequiredArgsConstructor
public class CountryService {
    private final CountryRepository countryRepository;

    public Flux<CountryEntity> findAll() {
        return countryRepository.findAll();
    }
}
