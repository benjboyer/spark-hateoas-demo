FROM groovy

WORKDIR /app

COPY src ./src
COPY public ./public

CMD ["groovy", "-cp", "src", "main.groovy"]