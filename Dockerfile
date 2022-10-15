FROM groovy

WORKDIR /app

COPY main.groovy .
COPY public ./public

CMD ["groovy", "main.groovy"]