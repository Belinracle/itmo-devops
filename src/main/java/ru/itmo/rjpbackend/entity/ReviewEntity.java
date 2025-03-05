package ru.itmo.rjpbackend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.ZonedDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("Review")
public class ReviewEntity {
    @Id
    private Integer id;

    private ZonedDateTime dateTime;

    private String userName;

    private Integer rating;

    private Integer productId;
}
