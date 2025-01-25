# Stage 1: Build the Vite site
FROM node:18-alpine AS build-vite

WORKDIR /app

COPY ./network_frontend/package.json ./network_frontend/package-lock.json ./
RUN npm install

COPY ./network_frontend ./
RUN npm run build

FROM python:3.12-slim

COPY --from=build-vite /app/dist /app/network_backend/static
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

COPY . /app

WORKDIR /app/network_backend

RUN uv sync --frozen --no-cache

CMD [".venv/bin/fastapi", "run", "app/main.py", "--port", "80", "--host", "0.0.0.0"]