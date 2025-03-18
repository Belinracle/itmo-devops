package ru.itmo.devops.util;

import org.mapstruct.Mapper;
import ru.itmo.devops.dto.ProductDTO;
import ru.itmo.devops.entity.ProductEntity;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    ProductEntity toEntity(ProductDTO productDTO);

    ProductDTO toDTO(ProductEntity productEntity);
}
