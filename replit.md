# UoP Science Faculty Waste Management Portal

## Overview

A full-stack waste management application built for the University of Peradeniya Faculty of Science. The system provides an interactive platform for managing disposal locations, organizing environmental events, collecting feedback, and tracking sustainability statistics. The application features a modern React frontend with a Node.js/Express backend, using PostgreSQL for data persistence and Replit Auth for authentication.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack React Query for server state management
- **UI Framework**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom color scheme for environmental theme
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture

- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with conventional HTTP methods
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL storage
- **Database ORM**: Drizzle ORM with type-safe queries
- **Validation**: Zod schemas for request/response validation

### Database Schema

The application uses PostgreSQL with the following main entities:

- **Users**: Authentication and profile information (mandatory for Replit Auth)
- **Sessions**: Session storage for authentication (mandatory for Replit Auth)
- **Disposal Locations**: Waste disposal points with geolocation data
- **Events**: Environmental events and activities
- **Feedback**: User feedback and suggestions
- **Stats**: System-wide statistics and metrics

## Key Components

### Authentication System

- Replit Auth integration with OpenID Connect
- Session-based authentication with PostgreSQL session store
- Protected routes and middleware for authorization
- User profile management with automatic user creation/updates

### Interactive Map System

- Dynamic Leaflet.js integration for disposal location visualization
- Real-time location filtering by waste type (general wastes, chemical wastes, paper wastes, e wastes)
- Search functionality for finding specific locations
- Detailed location modals with operating hours and directions
- Responsive design with mobile-friendly map interactions

### Event Management

- Event creation and management system
- Participant registration and capacity tracking
- Event type categorization (cleanup, workshop, awareness, tree-planting)
- Real-time participant count updates

### Feedback System

- Multi-type feedback collection (suggestion, complaint, compliment, report)
- Anonymous feedback option
- Location-specific feedback categorization
- Admin response system for feedback management

### Administrative Interface

- Comprehensive admin panel for system management
- CRUD operations for disposal locations, events, and feedback
- Statistics dashboard with key metrics
- Batch operations and data management tools

## Data Flow

1. **User Authentication**: Users authenticate through Replit Auth, sessions are stored in PostgreSQL
2. **Data Fetching**: React Query manages API calls with automatic caching and background updates
3. **Form Submission**: Forms use React Hook Form with Zod validation before API submission
4. **Real-time Updates**: Query invalidation ensures UI stays synchronized with backend changes
5. **Error Handling**: Centralized error handling with user-friendly toast notifications

## External Dependencies

### Frontend Dependencies

- **UI Components**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS with PostCSS processing
- **State Management**: TanStack React Query for server state
- **Form Management**: React Hook Form with Hookform Resolvers
- **Validation**: Zod for schema validation
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for date manipulation

### Backend Dependencies

- **Database**: Neon Database (PostgreSQL) with connection pooling
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Authentication**: OpenID Client for Replit Auth integration
- **Session Storage**: connect-pg-simple for PostgreSQL session storage
- **Validation**: Zod for API request/response validation
- **Development**: tsx for TypeScript execution, esbuild for production builds

### Development Tools

- **Build System**: Vite with React plugin and TypeScript support
- **Code Quality**: TypeScript with strict configuration
- **Environment**: Replit-specific plugins for development experience
- **Database Management**: Drizzle Kit for schema management and migrations

## Deployment Strategy

### Development Environment

- Vite development server with hot module replacement
- TypeScript compilation with incremental builds
- Replit integration for seamless development experience
- Environment-specific configuration management

### Production Build Process

1. **Frontend**: Vite builds optimized React application to `dist/public`
2. **Backend**: esbuild bundles server code with external dependencies
3. **Database**: Drizzle migrations ensure schema consistency
4. **Assets**: Static assets are served from the build directory

### Environment Configuration

- **Database**: Requires `DATABASE_URL` environment variable
- **Authentication**: Requires `REPLIT_DOMAINS`, `ISSUER_URL`, `REPL_ID`, and `SESSION_SECRET`
- **Build**: Supports both development and production configurations
- **Security**: Session configuration with secure cookies and appropriate timeouts

The application is designed to be deployed on Replit with automatic provisioning of PostgreSQL database and authentication services, but can be adapted for other hosting platforms with appropriate environment variable configuration.
