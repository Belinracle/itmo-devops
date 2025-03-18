package ru.itmo.devops.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDate;

public record ProductDTO(
        @PositiveOrZero Long id,
        @Min(1) @Max(1000000) Double price,
        @Min(1) @Max(5) Double avgRating,
        @PositiveOrZero Integer reviewCount,
        @NotBlank String name,
        LocalDate releaseDate,
        @PositiveOrZero Integer countryId,
        @PositiveOrZero Integer manufacturerId
) {
}
