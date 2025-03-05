package ru.itmo.rjpbackend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

import java.time.LocalDate;
import java.util.List;

public record FilterDTO(
        @Min(1) @Max(100000) Double fromPrice,
        @Min(1) @Max(100000) Double toPrice,
        @Min(1) @Max(5) Double fromRating,
        @Min(1) @Max(5) Double toRating,
        List<Integer> manufacturers,
        List<Integer> countries,
        LocalDate fromDate,
        LocalDate toDate,
        @Min(0) Integer pageNumber,
        @Min(1) Integer pageSize
) {
}