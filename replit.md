# Overview

This is a subscription-based mentorship platform called "Mente Livre" (Free Mind) built with a full-stack TypeScript architecture. The application allows users to subscribe to mental wellness content through a modern web interface with integrated payment processing via Stripe. It features a landing page, subscription forms, payment checkout, admin dashboard, and success pages.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing with pages for home, checkout, success, admin, and 404
- **UI Components**: Shadcn/ui component library built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: TanStack React Query for server state management and data fetching
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Styling**: Tailwind CSS with custom CSS variables for theming, dark mode support

## Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with endpoints for subscription creation, payment processing, and admin operations
- **Error Handling**: Centralized error middleware with structured error responses
- **Development**: Hot module replacement via Vite in development mode

## Data Storage
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon serverless PostgreSQL
- **Schema Management**: Drizzle Kit for migrations and schema management
- **In-Memory Fallback**: Memory storage implementation for development/testing

## Authentication & Security
- **Payment Processing**: Stripe integration for handling subscriptions and payment intents
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple
- **Data Validation**: Zod schemas for runtime type checking and validation
- **CORS**: Configured for cross-origin requests

## External Dependencies
- **Payment Gateway**: Stripe for payment processing and subscription management
- **Database**: Neon PostgreSQL serverless database
- **Email/Notifications**: WhatsApp integration mentioned for customer communication
- **Development Tools**: Replit-specific plugins for development environment integration
- **Monitoring**: Basic request logging and error tracking

The application follows a monorepo structure with shared schemas between client and server, ensuring type safety across the full stack. The build process compiles both frontend and backend into production-ready bundles.