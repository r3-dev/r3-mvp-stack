#####################################
#REVERSE PROXY#
#####################################
FROM golang:1.21.1-alpine AS build-reverse-proxy
WORKDIR /app
COPY ./apps/reverse-proxy/go.mod ./apps/reverse-proxy/go.sum ./
RUN go mod download
COPY ./apps/reverse-proxy ./

RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o dist/main.bin .

FROM alpine:latest AS reverse-proxy
WORKDIR /app
COPY --from=build-reverse-proxy /app/dist/main.bin /app/config.prod.json ./
EXPOSE ${PROXY_PORT}
ENTRYPOINT ./main.bin -port ${PROXY_PORT}

#####################################
#BACKEND#
#####################################
FROM golang:1.21.1-alpine AS build-backend
WORKDIR /app
COPY ./apps/backend/go.mod ./apps/backend/go.sum ./
RUN go mod download
COPY ./apps/backend ./

RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o dist/main.bin .

FROM alpine:latest AS backend
WORKDIR /app
COPY --from=build-backend /app/dist/main.bin ./
EXPOSE ${BACKEND_PORT}
ENTRYPOINT ./main.bin serve --http=0.0.0.0:${BACKEND_PORT}

#####################################
#OTHER PNPM APPS#
#####################################
FROM node:20-alpine AS pnpm-base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM pnpm-base AS pnpm-build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

RUN pnpm deploy --filter=frontend --prod /prod/frontend
# RUN pnpm deploy with filter for each new app here...

# Use the structure bellow, for each new app container (Don't forget to reference them in docker-compose.yml)
FROM node:20-alpine AS frontend
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY --from=pnpm-build /prod/frontend ./
ENV HOST=0.0.0.0
EXPOSE ${FRONTEND_PORT}
ENTRYPOINT [ "pnpm", "run", "start" ]

# Add new app container here...