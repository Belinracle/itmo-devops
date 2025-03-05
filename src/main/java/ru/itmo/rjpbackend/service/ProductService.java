package ru.itmo.rjpbackend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import ru.itmo.rjpbackend.dto.FilterDTO;
import ru.itmo.rjpbackend.entity.ProductEntity;
import ru.itmo.rjpbackend.repository.ProductRepository;

import static org.springframework.data.relational.core.query.Query.query;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final R2dbcEntityTemplate template;
    private final ProductRepository productRepository;

    public Mono<ProductEntity> save(ProductEntity productEntity) {
        return productRepository.save(productEntity);
    }

    public Flux<ProductEntity> findNRandom(Integer n) {
        return productRepository.findRandomLimit(n);
    }

    public Mono<Pair<Double, Integer>> countAllMatching(FilterDTO filter) {
        return template.select(ProductEntity.class)
                .matching(query(buildCriteria(filter)))
                .all()
                .reduce(new Double[]{0.0, 0.0}, (acc, productEntity) -> {
                    acc[0] += productEntity.getAvgRating();
                    acc[1]++;
                    return acc;
                })
                .map(acc -> Pair.of(acc[1] > 0 ? acc[0] / acc[1] : 0.0, acc[1].intValue()));
    }

    public Flux<ProductEntity> findAllMatching(FilterDTO filter) {
        int pageSize = filter.pageSize() != null ? filter.pageSize() : 10;
        int pageNumber = filter.pageNumber() != null ? filter.pageNumber() : 0;
        return template.select(ProductEntity.class)
                .matching(query(buildCriteria(filter))
                        .sort(Sort.by("id"))
                        .limit(pageSize)
                        .offset((long) pageSize * pageNumber))
                .all();
    }

    private Criteria buildCriteria(FilterDTO filter) {
        Criteria criteria = Criteria.empty();
        if (filter.fromPrice() != null) {
            criteria = criteria.and("price").greaterThanOrEquals(filter.fromPrice());
        }
        if (filter.toPrice() != null) {
            criteria = criteria.and("price").lessThanOrEquals(filter.toPrice());
        }
        if (filter.fromRating() != null) {
            criteria = criteria.and("avg_rating").greaterThanOrEquals(filter.fromRating());
        }
        if (filter.toRating() != null) {
            criteria = criteria.and("avg_rating").lessThanOrEquals(filter.toRating());
        }
        if (filter.manufacturers() != null && !filter.manufacturers().isEmpty()) {
            criteria = criteria.and("manufacturer_id").in(filter.manufacturers());
        }
        if (filter.countries() != null && !filter.countries().isEmpty()) {
            criteria = criteria.and("country_id").in(filter.countries());
        }
        if (filter.fromDate() != null) {
            criteria = criteria.and("release_date").greaterThanOrEquals(filter.fromDate());
        }
        if (filter.toDate() != null) {
            criteria = criteria.and("release_date").lessThanOrEquals(filter.toDate());
        }
        return criteria;
    }
}
