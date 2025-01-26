# Stage 1: Build the Vite site
FROM node:18-alpine AS build-vite

ARG FRONTEND_BACKEND_URL
ENV VITE_BACKEND_URL ${FRONTEND_BACKEND_URL}
ARG FRONTEND_NUM_PORTS
ENV VITE_NUM_PORTS ${FRONTEND_NUM_PORTS}
ARG FRONTEND_UPDATE_INTERVAL
ENV VITE_UPDATE_INTERVAL ${FRONTEND_UPDATE_INTERVAL}

WORKDIR /app

COPY ./network_frontend/package.json ./network_frontend/package-lock.json ./
RUN npm install

COPY ./network_frontend ./
RUN npm run build

FROM python:3.12-slim

COPY --from=build-vite /app/dist /app/network_backend/static
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

RUN apt-get update && apt-get install -y openssh-client iputils-ping

COPY . /app

WORKDIR /app/network_backend

RUN uv sync --frozen --no-cache

CMD [".venv/bin/fastapi", "run", "app/main.py", "--port", "80", "--host", "0.0.0.0"]