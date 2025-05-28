package ru.itmo.devops;

import io.restassured.RestAssured;
import io.restassured.common.mapper.TypeRef;
import io.restassured.http.ContentType;
import lombok.val;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import ru.itmo.devops.entity.ProductEntity;
import ru.itmo.devops.repository.ProductRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.junit.jupiter.api.Assertions.assertEquals;


@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ProductControllerTest {

    @LocalServerPort
    private Integer port;

    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>(
            "postgres:16-alpine"
    );

    @BeforeAll
    static void beforeAll() {
        postgres.start();
    }

    @AfterAll
    static void afterAll() {
        postgres.stop();
    }

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("junit.jupiter.execution.parallel.enabled", () -> false);
    }

    @Autowired
    ProductRepository productRepository;

    @BeforeEach
    void setUp() {
        RestAssured.baseURI = "http://localhost:" + port;
    }

    @Test
    @Order(1)
    void shouldGetAllProducts() {
        List<ProductEntity> products = List.of(
                new ProductEntity(null, 1D, 1D, 1, "1", LocalDate.now(), 1, 1),
                new ProductEntity(null, 2D, 2D, 2, "2", LocalDate.now(), 2, 2),
                new ProductEntity(null, 3D, 3D, 3, "3", LocalDate.now(), 3, 3),
                new ProductEntity(null, 4D, 4D, 4, "4", LocalDate.now(), 4, 4)
        );
        productRepository.saveAll(products);
        Map<String, Object> productsResponse = given()
                .contentType(ContentType.JSON)
                .when()
                .get("api/products").as(new TypeRef<>() {
                });
        val productList = (List<String>) productsResponse.get("content");
        assertEquals(4, productList.size());
    }

//    @Test
//    @Order(2)
//    void shouldGetFilteredProducts() {
//        String requestParams = String.join("&",
//                "fromPrice=1.0",
//                "toPrice=2.0",
//                "fromRating=1.0",
//                "toRating=5.0",
//                "manufacturerId=1",
//                "countryId=1",
//                "fromDate=2024-01-01",
//                "toDate=2048-01-01",
//                "pageNumber=0",
//                "pageSize=20"
//        );
//
//        Map<String, Object> productsResponse = given()
//                .contentType(ContentType.JSON)
//                .when()
//                .get("api/products?" + requestParams).as(new TypeRef<>() {
//                });
//        val productList = (List<String>) productsResponse.get("content");
//        assertEquals(1, productList.size());
//    }

    @Test
    @Order(3)
    void shouldGetById() {
        given()
                .contentType(ContentType.JSON)
                .when()
                .get("api/products/2")
                .then()
                .statusCode(200)
                .body("reviewCount", equalTo(2));
    }

    @Test
    @Order(4)
    void shouldGetByIdFail() {
        given()
                .contentType(ContentType.JSON)
                .when()
                .get("api/products/5")
                .then()
                .statusCode(404);
    }

    @Test
    @Order(5)
    void shouldDelete() {
        given()
                .contentType(ContentType.JSON)
                .when()
                .delete("api/products/2")
                .then()
                .statusCode(200);

        assertEquals(3, productRepository.count());
    }

    @Test
    @Order(6)
    void shouldInsert() {
        val productRequest = new ProductEntity(null, 5D, 5D, 5, "5", LocalDate.now(), 5, 5);
        given()
                .contentType(ContentType.JSON)
                .body(productRequest)
                .when()
                .post("api/products")
                .then()
                .statusCode(201);

        ProductEntity product = productRepository.findByName("5");
        assertEquals(5, product.getPrice());
    }

    @Test
    @Order(7)
    void shouldUpdate() {
        val productRequest = new ProductEntity(1L, 55D, 1D, 1, "1", LocalDate.now(), 1, 1);
        given()
                .contentType(ContentType.JSON)
                .body(productRequest)
                .when()
                .put("api/products/1")
                .then()
                .statusCode(200);

        long productCount = productRepository.count();
        assertEquals(4, productCount);
        val product = productRepository.findByName("1");
        assertEquals(55D, product.getPrice());
    }
}