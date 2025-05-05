## Running the Project with Docker

This project is fully containerized and can be run using Docker Compose. Below are the project-specific instructions and requirements for running the backend and frontend services.

### Requirements
- **Docker** and **Docker Compose** installed on your system.
- The Dockerfiles require **Node.js version 22.13.1** (as specified by `ARG NODE_VERSION=22.13.1`).

### Environment Variables
- Each service uses its own `.env` file:
  - **Backend:** `./backend/.env`
  - **Frontend:** `./frontend/.env`
- Ensure these files are present and configured before building the containers. The `docker-compose.yml` automatically loads them for each service.

### Build and Run Instructions
1. **Clone the repository** and ensure you have the required `.env` files in `./backend` and `./frontend`.
2. **Build and start all services:**
   ```sh
   docker compose up --build
   ```
   This will build both the backend and frontend images and start the containers.

### Service Details
- **Backend (`ts-backend`):**
  - Built from `./backend` directory
  - Exposes port **8080** (mapped to host's 8080)
  - Runs as a non-root user for security
  - Loads environment variables from `./backend/.env`
- **Frontend (`ts-frontend`):**
  - Built from `./frontend` directory
  - Exposes port **3000** (mapped to host's 3000)
  - Runs as a non-root user for security
  - Loads environment variables from `./frontend/.env`
  - Depends on the backend service (starts after backend is up)

### Networking
- Both services are connected via a custom Docker network `app-network` for internal communication.

### Special Configuration
- The Dockerfiles are optimized for production: they build the app, prune dev dependencies, and run as non-root users.
- If you need to add a database or other dependencies, update the `depends_on` section in `docker-compose.yml`.

---

_Refer to the individual `README.md` files in `./backend` and `./frontend` for service-specific details._
