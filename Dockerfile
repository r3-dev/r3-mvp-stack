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
RUN go env -w GOCACHE=/go-cache
RUN go env -w GOMODCACHE=/gomod-cache

# Setup pruner
FROM r3mvp-base as pruner
ARG PROJECT
WORKDIR /project
COPY ./ ./
RUN ./pruner-linux -p ${PROJECT}
RUN turbo prune ${PROJECT} --docker

# Install node dependencies and copy project files
FROM r3mvp-base AS node-installer
WORKDIR /project
# Install node dependencies
COPY --from=pruner /project/out/json .
RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store pnpm install --frozen-lockfile

# Install golang dependencies
FROM node-installer AS go-installer
RUN --mount=type=cache,target=/gomod-cache go mod download


# Build the project as a go app
FROM go-installer AS go-builder
ARG PROJECT
# Copy project files
COPY --from=pruner /project/out/full/ .
RUN --mount=type=cache,id=turbo,target=.turbo --mount=type=cache,target=/gomod-cache --mount=type=cache,target=/go-cache turbo build --cache-dir=.turbo --filter=${PROJECT}

# Build the project as a node app
FROM node-installer AS node-builder
ARG PROJECT
# Copy project files
COPY --from=pruner /project/out/full/ .
RUN --mount=type=cache,id=turbo,target=.turbo --mount=type=cache,target=/gomod-cache --mount=type=cache,target=/go-cache turbo build --cache-dir=.turbo --filter=${PROJECT}

# TODO: Add support for js hooks and migrations
# # Copy the local migrations dir into the image
# COPY --from=builder /project/app/backend/migration ./migrations
# # uncomment to copy the local pb_hooks dir into the image
# COPY --from=builder ./pb_hooks /pb/pb_hooks

##############
# DOCKER-COMPOSE TARGET PIPELINES
##############

FROM node-base as node-pipeline
ARG PROJECT
WORKDIR /app
COPY --from=node-builder /project/apps/${PROJECT}/dist ./

##############

FROM alpine:${ALPINE_VERSION} as node-pipeline-static
ARG PROJECT
WORKDIR /app
COPY --from=node-builder /project/apps/${PROJECT}/dist ./public
CMD [ "echo", "Static files are ready to use." ]

##############

FROM alpine:${ALPINE_VERSION} as go-pipeline
ARG PROJECT
WORKDIR /app
COPY --from=go-builder /project/apps/${PROJECT}/dist ./