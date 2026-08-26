FROM python:3.11-slim

WORKDIR /app

COPY ml-service/requirements.txt /app/ml-service/requirements.txt
RUN pip install --no-cache-dir -r /app/ml-service/requirements.txt

COPY ml-service /app/ml-service

EXPOSE 8001
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8001"]
