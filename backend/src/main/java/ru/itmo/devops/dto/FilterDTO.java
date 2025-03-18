package ru.itmo.devops.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDate;

public record FilterDTO(
        @Min(1) @Max(1000000) Double fromPrice,
        @Min(1) @Max(1000000) Double toPrice,
        @Min(1) @Max(5) Double fromRating,
        @Min(1) @Max(5) Double toRating,
        @PositiveOrZero Integer manufacturerId,
        @PositiveOrZero Integer countryId,
        //List<Integer> manufacturers,
        //List<Integer> countries,
        LocalDate fromDate,
        LocalDate toDate,
        @Min(0) Integer pageNumber,
        @Min(1) Integer pageSize
) {
}