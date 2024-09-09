FROM node:18-alpine
WORKDIR /app
RUN apk update && \
    apk add --no-cache g++ openjdk21 go python3 py3-pip
COPY package*.json ./
RUN npm i
COPY . . 
EXPOSE 5000
CMD ["node","index.js"]
