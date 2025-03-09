package ru.itmo.rjpbackend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.itmo.rjpbackend.entity.ProductEntity;
import ru.itmo.rjpbackend.repository.ProductRepository;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductRepository productRepository;

//    @GetMapping(produces = MediaType.APPLICATION_NDJSON_VALUE)
//    ProductDTO getAllProducts(@ModelAttribute @Valid FilterDTO filter) {
//        Mono<Pair<Double, Integer>> pairMono = productService.countAllMatching(filter);
//        return pairMono.flatMapMany(pair -> productService.findAllMatching(filter)
//                .map(productEntity -> new ProductDTO(
//                        productEntity.getId(),
//                        productEntity.getPrice(),
//                        productEntity.getAvgRating(),
//                        productEntity.getReviewCount(),
//                        productEntity.getName(),
//                        null,
//                        null,
//                        null,
//                        null,
//                        pair.getFirst(),
//                        pair.getSecond()
//                ))
//        );
//    }

    @GetMapping
    List<ProductEntity> getAllProducts() {
        return productRepository.findAll();
    }
}
