package ru.itmo.rjpbackend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import ru.itmo.rjpbackend.entity.ManufacturerEntity;
import ru.itmo.rjpbackend.repository.ManufacturerRepository;

@Service
@RequiredArgsConstructor
public class ManufacturerService {
    private final ManufacturerRepository manufacturerRepository;

    public Flux<ManufacturerEntity> findAll() {
        return manufacturerRepository.findAll();
    }
}
