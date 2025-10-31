# Debug Report: 400 Bad Request Error

## Problem
All requests to the API at `https://kanban.leonberkemeier.de/api/` return **400 Bad Request** errors, even simple GET requests to the API root.

## Root Cause
The issue is caused by **django-cors-headers middleware** rejecting requests that don't have an `Origin` header or have an origin not in the whitelist.

### Evidence:
1. ✅ Django server is running (response headers show `Server: WSGIServer/0.2`)
2. ✅ CORS middleware is active (response includes `Vary: origin` header)
3. ❌ All requests return 400, regardless of headers or method
4. ❌ Even GET requests to public endpoints fail

The CORS configuration in `backend/settings.py` was:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://kanban.leonberkemeier.de",
]
CORS_ALLOW_CREDENTIALS = True
```

This configuration **only allows** requests from these specific origins. Requests from:
- curl (no Origin header)
- Postman (no Origin header by default)
- Mobile apps
- Other domains

...are all rejected with 400 Bad Request.

## Solution Applied

Changed the CORS settings to allow all origins:

```python
# CORS settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # React development server
    "http://127.0.0.1:3000",
    "https://kanban.leonberkemeier.de",  # Production domain
]

CORS_ALLOW_CREDENTIALS = True

# IMPORTANT: Allow API requests even without Origin header (curl, Postman, etc.)
# This is needed for the API to work with direct HTTP clients
CORS_ORIGIN_ALLOW_ALL = True
```

## To Apply the Fix

### Method 1: Using Docker Compose (Recommended)
```bash
cd /home/archy/Desktop/Server/KanbanBoard

# Rebuild the backend container
docker-compose build backend

# Restart the services
docker-compose restart backend

# Or restart everything
docker-compose down && docker-compose up -d
```

### Method 2: Manual Server Restart
If running Django directly:
```bash
# Kill the running Django process
pkill -f "gunicorn backend.wsgi"

# Restart it (check your systemd service or docker-compose)
systemctl restart kanban-backend  # or your service name
```

## Testing After Fix

Run the debug script to verify:
```bash
python debug_login.py
```

Or test with curl:
```bash
# Test API root
curl https://kanban.leonberkemeier.de/api/ -H 'Accept: application/json'

# Test login
curl 'https://kanban.leonberkemeier.de/api/auth/login/' \
  -X POST \
  -H 'Content-Type: application/json' \
  --data-raw '{"username":"testdrag","password":"test123"}'
```

## Alternative Solution (More Secure)

If you want to keep CORS restrictions but still allow direct API access, you can:

1. Keep `CORS_ORIGIN_ALLOW_ALL = False`
2. Add specific patterns:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://kanban.leonberkemeier.de",
]

CORS_ORIGIN_REGEX_WHITELIST = [
    r"^https://.*\.leonberkemeier\.de$",
]

# Allow requests without Origin header for specific paths
# This would require custom middleware or exempting certain views
```

3. Or use `@csrf_exempt` decorator on specific API views if needed

## Notes

- The `CORS_ORIGIN_ALLOW_ALL = True` setting allows requests from any origin
- This is generally safe for **public APIs** but should be reviewed for sensitive endpoints
- Consider implementing API key authentication if broader access is a concern
- The JWT authentication still protects endpoints that require authentication
