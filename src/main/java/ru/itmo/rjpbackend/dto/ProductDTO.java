package ru.itmo.rjpbackend.dto;

import java.time.LocalDate;

public record ProductDTO(
        Integer id,
        Double price,
        Double avgRating,
        Integer reviewCount,
        String name,
        LocalDate releaseDate,
        Double totalAvgRating,
        Integer productCount
) {
}
