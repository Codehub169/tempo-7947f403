# End-to-End CRM Application for Indian IT Company

## Goal

The primary objective of this application is to provide an End-to-End CRM solution specifically tailored for an Indian IT Company, enabling all core sales and client management operations to be performed seamlessly within a single platform. It addresses the problem of scattered information across spreadsheets, emails, and disparate tools, which leads to inefficiency, missed opportunities, and lack of visibility.

This CRM aims to transform the user experience by offering a centralized, intuitive, and efficient workspace, moving users from frustration and administrative burden to a state of control, productivity, and confidence.

## Tech Stack

*   **Frontend:** Next.js (React Framework)
*   **Styling:** Tailwind CSS
*   **UI Components:** Chakra UI
*   **Backend:** Node.js with Express.js
*   **Database:** PostgreSQL
*   **Deployment (Planned):** Vercel (Frontend), Render/DigitalOcean App Platform (Backend & DB), or Docker on any cloud provider.

## Prerequisites

*   Node.js (v18.x or later recommended)
*   npm (v9.x or later recommended)
*   Docker (latest version)
*   Docker Compose (latest version)

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <repository-name>
```

### 2. Environment Variables

This project uses environment variables for configuration.

*   **Backend (`./backend/.env`):**
    Navigate to the `backend` directory and create a `.env` file by copying the example:
    ```bash
    cd backend
    cp .env.example .env
    cd ..
    ```
    Update `./backend/.env` with your specific configurations (e.g., `DATABASE_URL` for local development if not using Docker, `JWT_SECRET`, etc.).

*   **Frontend (`./frontend/.env.local`):**
    Navigate to the `frontend` directory and create a `.env.local` file by copying the example (if one is provided, otherwise create it manually):
    ```bash
    cd frontend
    # cp .env.example .env.local  (if .env.example exists)
    # Example content for .env.local:
    # NEXT_PUBLIC_API_BASE_URL=http://localhost:9000/api
    cd ..
    ```
    Update `./frontend/.env.local` with frontend-specific environment variables, like the API base URL.

*   **Docker Compose (`./.env`):**
    For Docker Compose, you can create a `.env` file in the project root to override default values in `docker-compose.yml` (e.g., `POSTGRES_USER`, `APP_PORT`). See comments in `docker-compose.yml` for examples.

### 3. Installation and Setup

#### Option A: Using the Startup Script (Local Non-Docker Setup)

This script automates dependency installation, database migrations, and application launch for local development without Docker.

1.  Ensure you have a local PostgreSQL instance running and configured as per `./backend/.env` (`DATABASE_URL`).
2.  Make the script executable:
    ```bash
    chmod +x startup.sh
    ```
3.  Run the script:
    ```bash
    ./startup.sh
    ```
    The backend should be available at `http://localhost:9000` (or as configured). The frontend (if using its own dev server via `npm run dev:frontend`) typically runs on `http://localhost:3000`.

#### Option B: Using Docker Compose

This method uses Docker to build and run the application services in containers. It's the recommended way for a consistent environment.

1.  Ensure Docker and Docker Compose are running.
2.  Ensure a `backend/Dockerfile` exists and is correctly configured.
3.  (Optional) Create a `.env` file in the project root for Docker Compose overrides.
4.  From the project root directory, run:
    ```bash
    docker-compose up --build -d
    ```
    *   The `--build` flag ensures images are built.
    *   The `-d` flag runs containers in detached mode.
5.  The application should be available at `http://localhost:9000` (or the `APP_PORT` you set in the root `.env` file).
    The PostgreSQL database will be available on port `5432` (or `DB_PORT`).

To view logs:
```bash
docker-compose logs -f app
docker-compose logs -f db
```

To stop and remove containers:
```bash
docker-compose down
# To remove volumes as well (deletes data):
# docker-compose down -v
```

## Development

From the root directory:

*   Install all dependencies (including in workspaces/sub-packages):
    ```bash
    npm install 
    ```
    (This relies on the `postinstall` script in the root `package.json` or workspace support from npm/yarn).

*   Run backend and frontend in development mode (with hot-reloading):
    ```bash
    npm run dev
    ```
    This will typically start the backend on port 9000 and the frontend on port 3000.

*   Run linters:
    ```bash
    npm run lint
    ```
*   Fix lint issues:
    ```bash
    npm run lint:fix
    ```

*   Run tests (once test suites are set up):
    ```bash
    npm run test
    ```

### Database Migrations (Backend - Assumes Prisma)

Run these commands from the `backend` directory or use the root `package.json` scripts:

*   Create a new migration:
    ```bash
    cd backend
    npx prisma migrate dev --name your_migration_name
    # or from root: npm run db:migrate:dev --prefix backend -- --name your_migration_name
    ```
*   Apply pending migrations:
    ```bash
    cd backend
    npx prisma migrate deploy
    ```
*   Open Prisma Studio:
    ```bash
    cd backend
    npx prisma studio
    # or from root: npm run db:studio --prefix backend
    ```

## Project Structure (High-Level)

*   `./backend`: Contains the Node.js/Express.js backend application, including API routes, controllers, services, database schema (Prisma), and Dockerfile.
*   `./frontend`: Contains the Next.js/React frontend application, including pages, components, styles, and static assets.
*   `./docker-compose.yml`: Defines services for Docker-based deployment (database, application).
*   `./package.json`: Root package file for managing project-wide scripts and workspaces.
*   `./startup.sh`: Script for easy local setup and launch (non-Docker).
*   `./.gitignore`: Specifies intentionally untracked files that Git should ignore.

## Contributing

(Details to be added: coding standards, branch strategy, PR process).
