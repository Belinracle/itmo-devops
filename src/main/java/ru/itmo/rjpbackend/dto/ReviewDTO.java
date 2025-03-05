package ru.itmo.rjpbackend.dto;

import java.time.ZonedDateTime;

public record ReviewDTO(Integer id, ZonedDateTime dateTime, String userName, Integer rating, Integer productId) {
}
