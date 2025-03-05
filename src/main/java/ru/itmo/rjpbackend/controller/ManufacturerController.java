package ru.itmo.rjpbackend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import ru.itmo.rjpbackend.dto.ManufacturerDTO;
import ru.itmo.rjpbackend.service.ManufacturerService;

@RestController
@CrossOrigin("*")
@RequestMapping("/manufacturers")
@RequiredArgsConstructor
public class ManufacturerController {
    private final ManufacturerService manufacturerService;

    @GetMapping
    Flux<ManufacturerDTO> getAllManufacturers() {
        return manufacturerService.findAll().map(e -> new ManufacturerDTO(e.getId(), e.getName(), e.getFoundationDate()));
    }
}
