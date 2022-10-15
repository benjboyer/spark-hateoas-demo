FROM groovy

WORKDIR /app

COPY src ./src

CMD ["groovy", "src/main/groovy/main.groovy"]