# Bloging Website

A full-stack mobile-responsive blog website in the Entertainment category built with Next.js, TypeScript, TypeORM, and SQLite.

## Features

- User authentication (sign-up, login, logout) with session management
- CRUD operations for blog posts
- Commenting system on posts
- Responsive design optimized for mobile and desktop
- Entertainment-themed vibrant styling

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, TypeORM, SQLite
- **Authentication**: JWT with HTTP-only cookies
- **Validation**: Zod with React Hook Form
- **Deployment**: Docker support for Coolify

## Getting Started

### Prerequisites

- Node.js 18+ or Docker

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and update variables if needed
4. Run database migrations:
   ```bash
   npm run migration:run
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Open http://localhost:3000 in your browser

### Docker Deployment

1. Build and run with Docker Compose:
   ```bash
   docker-compose up --build
   ```
2. The application will be available at http://localhost:3000

## Database Migrations

- Generate a new migration:
  ```bash
  npm run migration:generate -- -n MigrationName
  ```
- Run migrations:
  ```bash
  npm run migration:run
  ```
- Revert last migration:
  ```bash
  npm run migration:revert
  ```

## Environment Variables

See `.env` file for required variables:
- `DATABASE_PATH`: Path to SQLite database file
- `JWT_SECRET`: Secret for JWT token generation
- `SESSION_SECRET`: Secret for session management
- `NEXT_PUBLIC_APP_URL`: Base URL of the application

## Project Structure

- `src/entities/`: TypeORM entity definitions
- `src/pages/`: Next.js pages and API routes
- `src/components/`: Reusable React components
- `src/lib/`: Database and utility functions
- `src/styles/`: Global styles and Tailwind config
- `src/utils/`: Validation and authentication helpers

## License

MIT
