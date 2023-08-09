FROM node:lts-alpine as build-frontend
WORKDIR /app
COPY ./frontend/package*.json ./
RUN yarn
COPY ./frontend/ .
RUN yarn build

FROM golang:1.19 AS build-backend

RUN mkdir /app
ADD ./backend /app
COPY --from=build-frontend /app/dist /app/pb_public
WORKDIR /app

RUN CGO_ENABLED=0 GOOS=linux go build -o main .

FROM alpine:latest AS production
COPY --from=build-backend /app .
EXPOSE ${PORT}
CMD ["./main", "serve", "--http=0.0.0.0:8090"]