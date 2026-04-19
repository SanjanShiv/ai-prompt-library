#!/bin/bash
set -e

echo "Running database migrations..."
python manage.py migrate --noinput

echo "Starting server..."
exec gunicorn prompt_library.wsgi:application --bind 0.0.0.0:8000
