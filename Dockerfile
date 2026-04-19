FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# Create staticfiles directory
RUN mkdir -p /app/staticfiles

# Attempt to collect static files (can fail if db is not available, that's ok)
RUN python manage.py collectstatic --noinput --clear || true

EXPOSE 8000

# Start gunicorn with migrations
CMD ["sh", "-c", "python manage.py migrate --noinput || true && gunicorn prompt_library.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 4 --timeout 60 --access-logfile - --error-logfile -"]
