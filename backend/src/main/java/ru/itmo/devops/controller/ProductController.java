package ru.itmo.devops.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.itmo.devops.dto.FilterDTO;
import ru.itmo.devops.dto.ProductDTO;
import ru.itmo.devops.service.ProductService;
import ru.itmo.devops.util.ProductMapper;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductMapper productMapper;
    private final ProductService productService;

    @GetMapping
    ResponseEntity<Page<ProductDTO>> getAllProducts(@ModelAttribute @Valid FilterDTO filter) {
        return ResponseEntity.ok(productService.findAllMatching(filter).map(productMapper::toDTO));
    }

    @GetMapping("/{id}")
    ResponseEntity<ProductDTO> getProductById(@PathVariable @PositiveOrZero Long id) {
        return ResponseEntity.ok(productMapper.toDTO(productService.findById(id)));
    }

    @PostMapping
    ResponseEntity<Long> addProduct(@RequestBody @Valid ProductDTO product) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.save(productMapper.toEntity(product)).getId());
    }

    @DeleteMapping("/{id}")
    ResponseEntity<Void> deleteProduct(@PathVariable @PositiveOrZero Long id) {
        productService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
