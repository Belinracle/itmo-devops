package ru.itmo.rjpbackend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.util.Pair;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import ru.itmo.rjpbackend.dto.FilterDTO;
import ru.itmo.rjpbackend.dto.ProductDTO;
import ru.itmo.rjpbackend.service.ProductService;

@RestController
@CrossOrigin("*")
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping(produces = MediaType.APPLICATION_NDJSON_VALUE)
    Flux<ProductDTO> getAllProducts(@ModelAttribute @Valid FilterDTO filter) {
        Mono<Pair<Double, Integer>> pairMono = productService.countAllMatching(filter);
        return pairMono.flatMapMany(pair -> productService.findAllMatching(filter)
                .map(productEntity -> new ProductDTO(
                        productEntity.getId(),
                        productEntity.getPrice(),
                        productEntity.getAvgRating(),
                        productEntity.getReviewCount(),
                        productEntity.getName(),
                        null,
                        null,
                        null,
                        null,
                        pair.getFirst(),
                        pair.getSecond()
                ))
        );
    }
}
