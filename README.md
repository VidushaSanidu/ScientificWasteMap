# Scientific Waste Map

This is a full-stack React + Express.js application that can be deployed to Vercel.

## Local Development

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your values
3. Install dependencies: `npm install`
4. Push database schema: `npm run db:push`
5. Start development server: `npm run dev`

## Project Structure

- `client/` - React frontend
- `server/` - Express.js backend
- `api/` - Vercel serverless functions
- `shared/` - Shared TypeScript types and database schema
- `dist/` - Built assets (generated)

## Features

- React frontend with TypeScript
- Express.js backend with authentication
- PostgreSQL database with Drizzle ORM
- Session-based authentication
- Interactive map for waste disposal locations
- Admin panel for managing locations
- Responsive design with Tailwind CSS

## Technology Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based with passport.js
- **Deployment**: Vercel (serverless functions)


