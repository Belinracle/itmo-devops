package ru.itmo.rjpbackend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import ru.itmo.rjpbackend.dto.GeneratorDTO;
import ru.itmo.rjpbackend.service.GeneratorService;

@RestController
@CrossOrigin("*")
@RequestMapping("/generator")
@RequiredArgsConstructor
public class GeneratorController {
    private final GeneratorService generatorService;

    @PostMapping
    Mono<Void> updateGeneratorConfig(@RequestBody @Valid GeneratorDTO generatorDTO) {
        if (generatorDTO.reviewsNum() == null || generatorDTO.intervalInMillis() == null) {
            generatorService.stop();
        } else {
            generatorService.start(generatorDTO.reviewsNum(), generatorDTO.intervalInMillis());
        }
        return Mono.empty();
    }

    @GetMapping
    Mono<GeneratorDTO> getGeneratorConfig() {
        return Mono.just(new GeneratorDTO(generatorService.getReviewsNum(), generatorService.getIntervalInMillis()));
    }
}
