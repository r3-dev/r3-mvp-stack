FROM node:18-alpine as base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS build-frontend
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm run ci
RUN pnpm run -r build

FROM base AS frontend
COPY --from=build-frontend /app/apps/frontend/dist /app/apps/frontend/dist

FROM golang:1.21.1-alpine AS build-backend
RUN mkdir /app
ADD ./apps/backend /app
COPY --from=frontend /app/apps/frontend/dist /app/pb_public
WORKDIR /app
RUN CGO_ENABLED=0 GOOS=linux go build -o dist/main.bin .

FROM alpine:latest AS production
COPY --from=build-backend /app .
EXPOSE ${PORT}
CMD ["sh", "-c", "./dist/main.bin serve --http=0.0.0.0:$PORT"]
