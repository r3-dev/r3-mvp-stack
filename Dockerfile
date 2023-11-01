#####################################
#BACKEND#
#####################################
FROM golang:1.21.1-alpine AS build-backend
RUN mkdir /app
ADD ./apps/backend /app
WORKDIR /app
RUN CGO_ENABLED=0 GOOS=linux go build -o dist/main.bin .

FROM alpine:latest AS backend
COPY --from=build-backend /app .
EXPOSE 8090
CMD ["sh", "-c", "./dist/main.bin serve --http=0.0.0.0:$PORT"]

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
RUN pnpm run -r build

RUN pnpm deploy --filter=frontend --prod /prod/frontend
# RUN pnpm deploy with filter for each new app here...

# Use the structure bellow, for each new app container (Don't forget to reference them in docker-compose.yml)
FROM pnpm-base AS frontend
COPY --from=pnpm-build /prod/frontend /prod/frontend
WORKDIR /prod/frontend
ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321
CMD [ "pnpm", "start" ]

# Add new app container here...