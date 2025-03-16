FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder

WORKDIR /app
COPY pom.xml pom.xml
COPY ./src ./src

RUN mvn package -Dmaven.test.skip

FROM eclipse-temurin:21-jre-jammy

WORKDIR /app
COPY --from=builder /app/target/devops-0.0.1-SNAPSHOT.jar ./

ENTRYPOINT ["java","-jar","devops-0.0.1-SNAPSHOT.jar"]