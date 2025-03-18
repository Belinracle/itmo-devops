package ru.itmo.devops.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record ProductDTO(
        @Positive Long id,
        @Min(1) @Max(1000000) Double price,
        @Min(1) @Max(5) Double avgRating,
        @PositiveOrZero Integer reviewCount,
        @NotBlank String name,
        LocalDate releaseDate,
        @Positive Integer countryId,
        @Positive Integer manufacturerId
) {
}
