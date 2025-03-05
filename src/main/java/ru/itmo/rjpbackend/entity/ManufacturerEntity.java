package ru.itmo.rjpbackend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("Manufacturer")
public class ManufacturerEntity {
    @Id
    private Integer id;

    private String name;

    private LocalDate foundationDate;
}
