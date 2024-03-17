ARG NODE_VERSION=20.11
ARG GOLANG_VERSION=1.22
ARG ALPINE_VERSION=3.19

##############
# BASE IMAGES
##############

# Node base image
FROM node:${NODE_VERSION}-alpine AS node-base
RUN apk update
RUN apk add --no-cache libc6-compat git

# Golang base image
FROM golang:${GOLANG_VERSION}-alpine AS golang-base

# Alpine base image
FROM alpine:${ALPINE_VERSION} AS alpine-base

##############
# PIPELINE STAGES
##############

# Setup pnpm and turbo
FROM node-base as turbo-base
RUN npm install pnpm turbo turbobuild-prune-go --global
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
RUN turbobuild-prune-go -p ${PROJECT}
RUN turbo prune ${PROJECT} --docker

# Install node dependencies and copy project files
FROM r3mvp-base AS node-installer
WORKDIR /project
# Install node dependencies
COPY --from=pruner /project/out/json .
RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store pnpm install --frozen-lockfile

# Install golang dependencies
FROM node-installer AS go-installer
RUN --mount=type=cache,id=gomod,target=/gomod-cache go mod download

# Build the project as a go app
FROM go-installer AS go-builder
ARG PROJECT
# Copy project files
COPY --from=pruner /project/out/full/ .
RUN --mount=type=cache,id=turbo,target=.turbo --mount=type=cache,id=gomod,target=/gomod-cache --mount=type=cache,id=go,target=/go-cache turbo build --cache-dir=.turbo --filter=${PROJECT}

# Build the project as a node app
FROM node-installer AS node-builder
ARG PROJECT
# Copy project files
COPY --from=pruner /project/out/full/ .
RUN --mount=type=cache,id=turbo,target=.turbo --mount=type=cache,id=gomod,target=/gomod-cache --mount=type=cache,id=go,target=/go-cache turbo build --cache-dir=.turbo --filter=${PROJECT}

##############
# DOCKER-COMPOSE TARGET PIPELINES
##############

# Node app pipeline
FROM node-base as node-pipeline
ARG PROJECT
WORKDIR /app
COPY --from=node-builder /project/apps/${PROJECT}/dist ./

# Node app pipeline without node runtime (for static files)
FROM alpine-base as node-pipeline-static
ARG PROJECT
COPY --from=node-builder /project/apps/${PROJECT}/dist /app-tmp
# Copy files should be done only in runtime to avoid beeing replaced by the volume
CMD cp -R /app-tmp/. /app/ ; rm -rf /app-tmp

# Golang app pipeline
FROM alpine-base as go-pipeline
ARG PROJECT
WORKDIR /app
COPY --from=go-builder /project/apps/${PROJECT}/dist ./