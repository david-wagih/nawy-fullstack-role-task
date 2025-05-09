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

---

## Images Feature and Next.js Optimization

### How Image Uploads and Serving Work

- **Image Uploads:**
  - Images are uploaded via the backend service and stored in the `/app/uploads/apartments` directory inside the backend container.
  - This directory is bind-mounted to your host at `./backend/uploads/apartments` for persistence.

- **Serving Images:**
  - The backend exposes these images at URLs like `http://backend:8080/uploads/apartments/<filename>` (from within Docker) or `http://localhost:8080/uploads/apartments/<filename>` (from your browser on the host).

### Next.js Image Optimization

- The frontend uses Next.js's `<Image />` component for optimized image delivery.
- **Configuration:**
  - `frontend/next.config.ts` is set up with `remotePatterns` to allow images from the backend service:
    ```js
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'backend',
          port: '8080',
          pathname: '/uploads/apartments/**',
        },
      ],
    },
    ```
- **Environment Variables:**
  - On the server, image URLs are built using `INTERNAL_API_URL` (e.g., `http://backend:8080`).
  - On the client, image URLs use `NEXT_PUBLIC_API_URL` (e.g., `http://localhost:8080`).

### Docker Considerations

- **Do not use `localhost` for backend URLs in Docker.** Use the Docker Compose service name (`backend`).
- The frontend and backend must be on the same Docker network (handled automatically by Docker Compose).

### Troubleshooting

- If you see `400 Bad Request` or `INVALID_IMAGE_OPTIMIZE_REQUEST` errors:
  - Ensure the image URL passed to `<Image />` matches the `remotePatterns` in `next.config.ts`.
  - Make sure the backend is accessible from the frontend container at the correct URL.
  - As a workaround, you can add the `unoptimized` prop to `<Image />` to bypass Next.js optimization:
    ```jsx
    <Image src={src} alt="..." width={500} height={500} unoptimized />
    ```
- For more details, see [Next.js Discussions on image optimization issues](https://github.com/vercel/next.js/discussions/20138).
