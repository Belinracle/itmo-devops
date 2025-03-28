package ru.itmo.devops.service;

import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import ru.itmo.devops.dto.FilterDTO;
import ru.itmo.devops.entity.ProductEntity;
import ru.itmo.devops.repository.ProductRepository;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;

    public ProductEntity save(ProductEntity productEntity) {
        return productRepository.save(productEntity);
    }

    public Page<ProductEntity> findAllMatching(FilterDTO filter) {
        int pageSize = filter.pageSize() != null ? filter.pageSize() : 10;
        int pageNumber = filter.pageNumber() != null ? filter.pageNumber() : 0;
        var pageable = PageRequest.of(pageNumber, pageSize);
        var specification = buildSpecification(filter);
        return productRepository.findAll(specification, pageable);
    }

    public ProductEntity findById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Product with id " + id + " not found"));
    }

    public void updateById(Long id, ProductEntity productEntity) {
        findById(id);
        productEntity.setId(id);
        save(productEntity);
    }

    public void deleteById(Long id) {
        productRepository.delete(findById(id));
    }

    private Specification<ProductEntity> buildSpecification(FilterDTO filter) {
        return (root, query, builder) -> {
            Predicate predicate = builder.conjunction();
            if (filter.fromPrice() != null) {
                predicate = builder.and(predicate, builder.greaterThanOrEqualTo(root.get("price"), filter.fromPrice()));
            }
            if (filter.toPrice() != null) {
                predicate = builder.and(predicate, builder.lessThanOrEqualTo(root.get("price"), filter.toPrice()));
            }
            if (filter.fromRating() != null) {
                predicate = builder.and(predicate, builder.greaterThanOrEqualTo(root.get("avgRating"), filter.fromRating()));
            }
            if (filter.toRating() != null) {
                predicate = builder.and(predicate, builder.lessThanOrEqualTo(root.get("avgRating"), filter.toRating()));
            }
            if (filter.manufacturerId() != null) {
                predicate = builder.and(predicate, builder.equal(root.get("manufacturerId"), filter.manufacturerId()));
            }
            if (filter.countryId() != null) {
                predicate = builder.and(predicate, builder.equal(root.get("countryId"), filter.countryId()));
            }
            if (filter.fromDate() != null) {
                predicate = builder.and(predicate, builder.greaterThanOrEqualTo(root.get("releaseDate"), filter.fromDate()));
            }
            if (filter.toDate() != null) {
                predicate = builder.and(predicate, builder.lessThanOrEqualTo(root.get("releaseDate"), filter.toDate()));
            }
            return predicate;
        };
    }
}
