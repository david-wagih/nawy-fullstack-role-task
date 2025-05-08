# Nawy Task

## Project Structure

### Backend (`/backend`)
- **Framework:** NestJS
- **Key Directories:**
  - `src/`
    - `apartment/`: Contains the main business logic for apartments, including controllers, services, DTOs, and entities.
    - `prisma/`: Prisma schema and migration files for database management.
    - `main.ts`, `app.module.ts`: Application entry point and root module.
  - `prisma/schema.prisma`: Database schema definition.
- **Other Files:**
  - `Dockerfile`: For containerizing the backend.
  - `package.json`: Dependencies and scripts.

### Frontend (`/frontend`)
- **Framework:** Next.js (TypeScript)
- **UI Library:** [ShadCN UI](https://ui.shadcn.com/) — A set of beautifully-designed, accessible React components built on top of Tailwind CSS.
- **Key Directories:**
  - `app/`: Main application pages and layouts.
    - `apartments/`: Apartment listing and detail pages.
  - `components/`: Reusable UI and feature components.
    - `apartments/`: Apartment-specific components (form, card, details, filters, etc.).
    - `ui/`: Generic UI components (button, dialog, form, etc.).
  - `store/`: State management logic.
  - `types/`: TypeScript type definitions.
- **Other Files:**
  - `Dockerfile`: For containerizing the frontend.
  - `package.json`: Dependencies and scripts.

---

## Installation & Running (with Docker Compose)

1. **Prerequisites:**  
   - Docker and Docker Compose installed.

2. **Setup & Run:**
   ```sh
   docker-compose up --build
   ```
   This will:
   - Start a PostgreSQL database (`db` service).
   - Build and run the backend (`backend` service) on port 8080.
   - Build and run the frontend (`frontend` service) on port 3000.

3. **Access:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8080](http://localhost:8080)
