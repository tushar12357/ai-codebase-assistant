FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

# Upgrade pip (faster installs)
RUN pip install --upgrade pip

# Install dependencies efficiently
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]