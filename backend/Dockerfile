# ---- Build stage: compile the app into a runnable JAR ----
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY . .
RUN chmod +x mvnw && ./mvnw clean package -DskipTests

# ---- Run stage: a small image that just runs the JAR ----
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
# The app reads $PORT (set by the hosting platform) via application.properties.
# MaxRAMPercentage keeps it within small free-tier memory limits.
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
