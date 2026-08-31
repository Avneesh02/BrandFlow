FROM node:20 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend .
RUN npm run build

FROM python:3.12-slim
WORKDIR /app/backend

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY backend ./
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

EXPOSE 8000

CMD ["sh", "-c", "cd /app/backend && alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port ${PORT}"]
