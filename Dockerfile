ARG NODE_VERSION=20

#####################################
#BACKEND#
#####################################
FROM golang:1.21-alpine AS build-backend
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
FROM node:${NODE_VERSION}-alpine AS pnpm-base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM pnpm-base AS pnpm-build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm run ci:prod
RUN pnpm run build

RUN pnpm deploy --filter=frontend --prod /prod/frontend
# RUN pnpm deploy with filter for each new app here...

# Use the structure bellow, for each new app container (Don't forget to reference them in docker-compose.yml)
FROM node:${NODE_VERSION}-alpine AS frontend
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY --from=pnpm-build /prod/frontend ./
ENV HOST=0.0.0.0
EXPOSE ${FRONTEND_PORT}
ENTRYPOINT [ "pnpm", "run", "start" ]

# Add new app container here...
