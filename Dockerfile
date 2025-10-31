# Use Python 3.11 slim image as base
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=backend.settings

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . /app/

# # Create a non-root user
# RUN adduser --disabled-password --gecos '' appuser \
#     && chown -R appuser:appuser /app

# # Switch to appuser AFTER setting ownership
# USER appuser

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose port
EXPOSE 9000

# # Health check
# HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
#     CMD curl -f http://localhost:9000/api/tasks/ || exit 1

# Run the application
CMD ["python", "manage.py", "runserver", "0.0.0.0:9000"]