package ru.itmo.devops.service;

import jakarta.annotation.PostConstruct;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import ru.itmo.devops.dto.FilterDTO;
import ru.itmo.devops.dto.MessageDTO;
import ru.itmo.devops.entity.ProductEntity;
import ru.itmo.devops.repository.ProductRepository;

import java.util.NoSuchElementException;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService {
    private static final String URL_FORMAT = "https://api.telegram.org/bot%s/sendMessage";
    private static final String ADD_MSG_FORMAT = "Добавлен новый продукт c id %d:\n\n%s";
    private static final String UPD_MSG_FORMAT = "Продукт с id %d изменен:\n\n%s";

    private final ProductRepository productRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${tg.botToken}")
    private String botToken;

    @Value("${tg.chatId}")
    private String chatId;

    @PostConstruct
    private void checkEnv() {
        if (StringUtils.isAnyBlank(botToken, chatId)) {
            throw new RuntimeException("Environment variable TG_BOT_TOKEN and/or TG_CHAT_ID was not set!");
        }
    }

    public ProductEntity save(ProductEntity productEntity) {
        var msgFormat = productEntity.getId() == null ? ADD_MSG_FORMAT : UPD_MSG_FORMAT;
        var result = productRepository.save(productEntity);

        var msg = new MessageDTO(chatId, String.format(msgFormat, result.getId(), result));
        if(!Objects.equals(botToken, "test")) {
            try {
                restTemplate.postForEntity(String.format(URL_FORMAT, botToken), msg, String.class);
            } catch (HttpClientErrorException e) {
                log.error(e.getMessage(), e);
            }
        }
        return result;
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
