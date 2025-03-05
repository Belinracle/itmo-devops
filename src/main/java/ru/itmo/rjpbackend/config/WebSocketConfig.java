package ru.itmo.rjpbackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.HandlerMapping;
import org.springframework.web.reactive.handler.SimpleUrlHandlerMapping;
import ru.itmo.rjpbackend.handler.ProductWebSocketHandler;

import java.util.Map;

@Configuration
public class WebSocketConfig {
    @Bean
    public HandlerMapping webSocketMapping(ProductWebSocketHandler webSocketHandler) {
        return new SimpleUrlHandlerMapping(Map.of("/ws/products", webSocketHandler), -1);
    }
}