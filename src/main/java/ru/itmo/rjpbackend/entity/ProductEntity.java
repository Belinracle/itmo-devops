package ru.itmo.rjpbackend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("Product")
public class ProductEntity {
    @Id
    private Integer id;

    private Double price;

    private Double avgRating;

    private Integer reviewCount;

    private String name;

    private LocalDate releaseDate;

    private Integer countryId;

    private Integer manufacturerId;
}
