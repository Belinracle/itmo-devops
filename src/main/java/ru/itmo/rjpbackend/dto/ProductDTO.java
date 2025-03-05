package ru.itmo.rjpbackend.dto;

import java.time.LocalDate;
import java.util.List;

public record ProductDTO(
        Integer id,
        Double price,
        Double avgRating,
        Integer reviewCount,
        String name,
        LocalDate releaseDate,
        CountryDTO country,
        ManufacturerDTO manufacturer,
        List<ReviewDTO> reviews,
        Double totalAvgRating,
        Integer productCount
) {
}
