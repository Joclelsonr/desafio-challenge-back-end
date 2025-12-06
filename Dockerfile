FROM node:24.0.0-slim

RUN apt update && \
    apt install openssl procps -y

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "tail", "-f", "/dev/null" ]