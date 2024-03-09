ARG NODE_VERSION=20.11.1
ARG GOLANG_VERSION=1.21.5
ARG ALPINE_VERSION=3.19.1

# Node base image
FROM node:${NODE_VERSION}-alpine AS node-base
RUN apk update
RUN apk add --no-cache libc6-compat git

# Golang base image
FROM golang:${GOLANG_VERSION}-alpine AS golang-base

# Setup pnpm and turbo
FROM node-base as turbo-base
RUN npm install pnpm turbo --global
RUN pnpm config set store-dir ~/.pnpm-store

# Setup Golang
FROM turbo-base AS r3mvp-base
COPY --from=golang-base /usr/local/go/ /usr/local/go/
ENV PATH="$PATH:/usr/local/go/bin"
ENV PATH="$PATH:/root/go/bin"

# Setup pruner
FROM r3mvp-base as pruner
WORKDIR /project
COPY ./ ./
RUN turbo prune backend frontend --docker
# TODO: Add golang pruner script

# Build the project
FROM r3mvp-base AS builder
WORKDIR /project
# Install node dependencies
COPY --from=pruner /project/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /project/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /project/out/json .
RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store pnpm install --frozen-lockfile
# Install golang dependencies
COPY --from=pruner /project/go.work ./go.work
COPY --from=pruner /project/go.work.sum ./go.work.sum
COPY --from=pruner /project/apps/backend/go.mod ./apps/backend/go.mod
RUN --mount=type=cache,id=go,target=~/.cache/go-build go mod download
# Copy project files
COPY --from=pruner /project/out/full/ .
# Build the project
RUN --mount=type=cache,id=turbo,target=.turbo turbo build --cache-dir=.turbo

# Fullstack image = backend + frontend static
FROM alpine:${ALPINE_VERSION} AS fullstack
WORKDIR /app
# Copy backend
COPY --from=builder /project/apps/backend/dist/main.bin ./
# Copy frontend static
COPY --from=builder /project/apps/frontend/dist ./public

# TODO: Add support for js hooks and migrations
# # Copy the local migrations dir into the image
# COPY --from=builder /project/app/backend/migration ./migrations
# # uncomment to copy the local pb_hooks dir into the image
# COPY --from=builder ./pb_hooks /pb/pb_hooks

##############
# Templates
##############

FROM node_base as node_prod_base
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh
RUN npm i -g pnpm@8
ENTRYPOINT ["/app/docker-entrypoint.sh"]

##############

FROM golang-base as go_prod_base
WORKDIR /app
COPY docker-entrypoint.sh /app/
RUN chmod +x /app/docker-entrypoint.sh
ENTRYPOINT ["/app/docker-entrypoint.sh"]