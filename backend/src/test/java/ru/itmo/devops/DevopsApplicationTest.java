package ru.itmo.devops;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.SpringApplication;

import java.util.ArrayList;
import java.util.List;

public class DevopsApplicationTest {
    private static final List<String> BASE_ARGS = List.of(
            "--server.port=0",
            "--spring.jpa.hibernate.ddl-auto=none",
            "--spring.jpa.properties.hibernate.temp.use_jdbc_metadata_defaults=false",
            "--spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect"
    );

    @Test
    void shouldFailWhenBotTokenNotSet() {
        String[] args = new ArrayList<>(BASE_ARGS) {{
            add("--tg.botToken=");
            add("--tg.chatId=test");
        }}.toArray(new String[0]);

        Assertions.assertThrows(RuntimeException.class, () -> SpringApplication.run(DevopsApplication.class, args));
    }

    @Test
    void shouldFailWhenChatIdNotSet() {
        String[] args = new ArrayList<>(BASE_ARGS) {{
            add("--tg.botToken=test");
            add("--tg.chatId=");
        }}.toArray(new String[0]);

        Assertions.assertThrows(RuntimeException.class, () -> SpringApplication.run(DevopsApplication.class, args));
    }

    @Test
    void shouldFailWhenEnvNotSet() {
        String[] args = new ArrayList<>(BASE_ARGS) {{
            add("--tg.botToken=");
            add("--tg.chatId=");
        }}.toArray(new String[0]);

        Assertions.assertThrows(RuntimeException.class, () -> SpringApplication.run(DevopsApplication.class, args));
    }

    @Test
    void shouldRunWhenEnvSet() {
        String[] args = new ArrayList<>(BASE_ARGS) {{
            add("--tg.botToken=test");
            add("--tg.chatId=test");
        }}.toArray(new String[0]);

        Assertions.assertDoesNotThrow(() -> SpringApplication.run(DevopsApplication.class, args));
    }
}