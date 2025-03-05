package ru.itmo.rjpbackend.dto;

import java.time.LocalDate;

public record ManufacturerDTO(Integer id, String name, LocalDate foundationDate) {
}