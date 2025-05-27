package ru.itmo.devops;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import ru.itmo.devops.dto.MessageDTO;
import ru.itmo.devops.entity.ProductEntity;
import ru.itmo.devops.repository.ProductRepository;
import ru.itmo.devops.service.ProductService;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProductServiceTest {
    private static final Long PRODUCT_ID = 123L;
    private static final String BOT_TOKEN = "test";
    private static final String CHAT_ID = "test";
    private static final String URL = "https://api.telegram.org/bottest/sendMessage";
    private static final String ADD_MSG = "Добавлен новый продукт c id 123";
    private static final String UPD_MSG = "Продукт с id 123 изменен";

    @Mock
    private ProductRepository productRepository;

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private ProductService productService;

    @BeforeEach
    void setup() {
        ReflectionTestUtils.setField(productService, "botToken", BOT_TOKEN);
        ReflectionTestUtils.setField(productService, "chatId", CHAT_ID);
    }

    @Test
    void shouldSendAddMsg() {
        ProductEntity productEntity = new ProductEntity();
        ProductEntity result = new ProductEntity();
        productEntity.setId(null);
        result.setId(PRODUCT_ID);

        when(productRepository.save(productEntity)).thenReturn(result);
        productService.save(productEntity);

        verify(restTemplate).postForEntity(
                eq(URL),
                argThat(msg -> ((MessageDTO) msg).chat_id().equals(CHAT_ID) &&
                        ((MessageDTO) msg).text().contains(ADD_MSG)),
                eq(String.class)
        );
    }

    @Test
    void shouldSendUpdMsg() {
        ProductEntity productEntity = new ProductEntity();
        productEntity.setId(PRODUCT_ID);

        when(productRepository.save(productEntity)).thenReturn(productEntity);
        productService.save(productEntity);

        verify(restTemplate).postForEntity(
                eq(URL),
                argThat(msg -> ((MessageDTO) msg).chat_id().equals(CHAT_ID) &&
                        ((MessageDTO) msg).text().contains(UPD_MSG)),
                eq(String.class)
        );
    }

    @Test
    void shouldHandleHttpClientErrorException() {
        ProductEntity entity = new ProductEntity();

        when(productRepository.save(entity)).thenReturn(entity);
        when(restTemplate.postForEntity(anyString(), any(), eq(String.class))).thenThrow(new HttpClientErrorException(HttpStatus.NOT_FOUND));
        productService.save(entity);

        verify(restTemplate).postForEntity(anyString(), any(), eq(String.class));
    }
}