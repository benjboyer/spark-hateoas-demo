FROM groovy

WORKDIR /app

COPY main.groovy .
COPY assets ./assets
COPY public ./public

CMD ["groovy", "main.groovy"]