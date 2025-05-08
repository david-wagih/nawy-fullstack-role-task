# Nawy Full-Stack Task

## Project Structure

### Backend (`/backend`)
- **Framework:** NestJS
- **Key Directories & Files:**
  - `src/` — Main source code for the backend:
    - `apartment/` — Contains the main business logic for apartments:
      - `apartment.controller.ts` — Handles HTTP requests for apartments (CRUD operations).
      - `apartment.service.ts` — Contains business logic and interacts with the database.
      - `dto/` — Data Transfer Objects for validating and typing request payloads.
      - `entities/` — Apartment entity definitions for type safety.
    - `prisma/` — Prisma client setup and database connection logic.
    - `main.ts` — Application entry point (bootstraps the NestJS app).
    - `app.module.ts` — Root module that imports all feature modules.
    - `app.controller.ts` / `app.service.ts` — Example root controller/service.
  - `prisma/schema.prisma` — Database schema definition for Prisma ORM.
  - `test/` — Contains backend unit and integration tests.
- **Other Files:**
  - `Dockerfile` — For containerizing the backend service.
  - `package.json` — Backend dependencies and scripts.
  - `.env` — Environment variables (not committed by default).

### Frontend (`/frontend`)
- **Framework:** Next.js (TypeScript)
- **UI Library:** [ShadCN UI](https://ui.shadcn.com/) — A set of beautifully-designed, accessible React components built on top of Tailwind CSS.
- **Key Directories & Files:**
  - `app/` — Main application pages and layouts:
    - `apartments/` — Apartment listing and detail pages:
      - `page.tsx` — Main apartments page (listing, add/edit, etc.).
      - `[id]/page.tsx` — Dynamic route for apartment details.
    - `layout.tsx` — Root layout for the app.
    - `globals.css` / `layout.scss` — Global and layout-specific styles.
  - `components/` — Reusable UI and feature components:
    - `apartments/` — Apartment-specific components (form dialog, card, details, filters, pagination, etc.).
    - `ui/` — Generic UI components (button, dialog, form, skeleton, etc.).
    - `NavBar.tsx` — The main navigation bar.
    - `Providers.tsx` — Context and provider setup for the app.
  - `store/` — State management logic (Redux or similar):
    - `store.ts` — Store setup, slices, and async logic for apartments.
  - `types/` — TypeScript type definitions:
    - `apartment.d.ts` — Types for apartment data and forms.
  - `public/` — Static assets (images, favicon, etc.).
- **Other Files:**
  - `Dockerfile` — For containerizing the frontend service.
  - `package.json` — Frontend dependencies and scripts.
  - `.env` — Environment variables (not committed by default).

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
