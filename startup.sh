#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "CRM Application Startup Script"

# --- Configuration ---
BACKEND_DIR="backend"
FRONTEND_DIR="frontend"
TARGET_PORT="9000" # Default port, backend should respect this or $PORT env var

# --- Functions ---
info() {
  echo "[INFO] $1"
}

warn() {
  echo "[WARN] $1"
}

error() {
  echo "[ERROR] $1" >&2
  exit 1
}

# --- Main Script ---

info "Starting CRM Application setup..."

# Check for Node.js and npm
if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
  error "Node.js and/or npm are not installed. Please install them to continue."
fi

info "Node version: $(node -v)"
info "npm version: $(npm -v)"

# Root npm install (if workspaces are used and not handled by individual installs)
# info "Running root npm install..."
# npm install || warn "Root npm install failed or not needed."

# Backend Setup
if [ -d "$BACKEND_DIR" ]; then
  info "Setting up backend in '$BACKEND_DIR'..."
  cd "$BACKEND_DIR"
  npm install || error "Backend npm install failed."
  if [ -f ".env.example" ] && [ ! -f ".env" ]; then
    info "Creating .env file from .env.example for backend..."
    cp .env.example .env
  else
    info "Backend .env file already exists or .env.example not found."
  fi
  # Assuming Prisma is used for migrations
  if [ -f "package.json" ] && grep -q 'prisma migrate deploy' package.json; then
    info "Running backend database migrations (prisma migrate deploy)..."
    npx prisma migrate deploy || error "Backend Prisma migrate deploy failed."
  else
    warn "Prisma migrate deploy script not found in backend package.json, skipping migrations."
  fi
  if [ -f "package.json" ] && grep -q 'prisma db seed' package.json; then
    info "Running backend database seeding (prisma db seed)..."
    # Use --if-present to avoid error if script doesn't exist
    npm run db:seed --if-present || warn "Backend Prisma db seed failed or script not found."
  else
    info "Backend Prisma db seed script not configured in package.json."
  fi
  info "Building backend..."
  npm run build || error "Backend build failed."
  cd ..
else
  error "Backend directory '$BACKEND_DIR' not found."
fi

# Frontend Setup
if [ -d "$FRONTEND_DIR" ]; then
  info "Setting up frontend in '$FRONTEND_DIR'..."
  cd "$FRONTEND_DIR"
  npm install || error "Frontend npm install failed."
  if [ -f ".env.example" ] && [ ! -f ".env.local" ] && [ ! -f ".env" ]; then
    info "Creating .env.local file from .env.example for frontend..."
    cp .env.example .env.local
  else
    info "Frontend .env.local/.env file already exists or .env.example not found."
  fi
  info "Building frontend..."
  npm run build || error "Frontend build failed."
  cd ..
else
  error "Frontend directory '$FRONTEND_DIR' not found."
fi

info "Starting backend server..."
info "The backend is expected to start on port $TARGET_PORT (or configure via its .env or PORT env var)."
info "If frontend is served separately by Next.js dev server, it usually runs on port 3000."
info "For production, the backend should serve the built frontend assets."

cd "$BACKEND_DIR"
# The backend's start script in its package.json should handle PORT configuration.
# We pass TARGET_PORT as an environment variable for flexibility if the app uses it.
export PORT=$TARGET_PORT

# Check if a start script exists in backend package.json
if ! grep -q '"start"' package.json; then 
  error "No 'start' script found in backend package.json. Cannot start the application."
fi

info "Launching backend. Access at http://localhost:$TARGET_PORT (if backend serves frontend on this port)"
npm start || error "Backend start failed on port $TARGET_PORT."

info "CRM Application startup process finished."
info "If the 'npm start' command runs in the foreground, this script will remain active."
info "Press Ctrl+C to stop the application."

# Keep script running if server starts in background (though npm start is usually foreground)
wait
