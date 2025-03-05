package ru.itmo.rjpbackend.dto;

import jakarta.validation.constraints.Min;

public record GeneratorDTO(@Min(1) Integer reviewsNum, @Min(1) Long intervalInMillis) {
}
