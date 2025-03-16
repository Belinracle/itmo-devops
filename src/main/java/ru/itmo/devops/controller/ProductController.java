package ru.itmo.devops.controller;

import lombok.RequiredArgsConstructor;
import lombok.val;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.itmo.devops.entity.ProductEntity;
import ru.itmo.devops.exceptions.ResourceNotFoundException;
import ru.itmo.devops.repository.ProductRepository;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductRepository productRepository;

    @GetMapping
    List<ProductEntity> getAllProducts() {
        return productRepository.findAll();
    }

    @GetMapping("{id}")
    ProductEntity getProductById(@PathVariable Long id) {
        return productRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Product with id " + id + " not found"));
    }

    @PostMapping
    ResponseEntity<Long> addProduct(@RequestBody ProductEntity product) {
        val insertedProduct = productRepository.saveAndFlush(product);
        return new ResponseEntity(insertedProduct.getId(), HttpStatus.CREATED);
    }

    @DeleteMapping("{id}")
    ResponseEntity deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
