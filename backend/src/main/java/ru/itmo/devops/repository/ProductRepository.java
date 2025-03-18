package ru.itmo.devops.repository;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ru.itmo.devops.entity.ProductEntity;

@Repository
public interface ProductRepository extends CrudRepository<ProductEntity, Long>, JpaSpecificationExecutor<ProductEntity> {
    ProductEntity findByName(String name);
}
