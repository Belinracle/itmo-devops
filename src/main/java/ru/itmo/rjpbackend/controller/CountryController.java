package ru.itmo.rjpbackend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import ru.itmo.rjpbackend.dto.CountryDTO;
import ru.itmo.rjpbackend.service.CountryService;

@RestController
@CrossOrigin("*")
@RequestMapping("/countries")
@RequiredArgsConstructor
public class CountryController {
    private final CountryService countryService;

    @GetMapping
    Flux<CountryDTO> getAllCountries() {
        return countryService.findAll().map(e -> new CountryDTO(e.getId(), e.getName()));
    }
}
