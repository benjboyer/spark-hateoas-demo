FROM groovy

WORKDIR /app

COPY main.groovy ./main.groovy
COPY src ./src
COPY public ./public

CMD ["groovy", "-cp", "src", "main.groovy"]