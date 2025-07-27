# Replit.md - Reset Wellness App

## Overview

Reset is a wellness application that provides science-backed 60-second reset sessions for mental and physical wellbeing. The app includes features for meditation, sleep tracking, stress relief, mindful stretches, and energy boosts. Users can track their progress, view insights, and maintain wellness streaks through guided sessions.

## User Preferences

Preferred communication style: Simple, everyday language.

### UI/UX Preferences
- No white text on light backgrounds - all text should be black/dark gray for maximum readability
- Minimal green theme - use darker green colors only as accents (like highlighting "One Minute")
- No full green backgrounds - prefer white/light gray backgrounds with green accents
- Excellent contrast ratios required for all text elements
- Profile icons should have solid dark backgrounds with white text for visibility

## System Architecture

The application follows a modern full-stack architecture with clear separation between client and server:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom wellness-themed color palette
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Authentication**: Replit Auth with OpenID Connect integration
- **Session Management**: Express sessions with PostgreSQL storage
- **API Design**: RESTful endpoints with proper error handling and logging

### Database Architecture
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Connection Pooling**: Neon serverless connection pooling

## Key Components

### Authentication System
- **Implementation**: Replit Auth with OpenID Connect
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **User Management**: User profiles with email, name, and profile images
- **Security**: HTTP-only cookies with secure flag for production

### Session Management
- **Session Types**: Predefined wellness activities (meditation, breathing, stretching, etc.)
- **Timer Functionality**: Real-time session tracking with pause/resume capabilities
- **Progress Tracking**: Session completion, duration, and streak counting
- **Post-Session Data**: Mood ratings, reflection notes, and session feedback

### Tracking Systems
- **Sleep Tracking**: Quality ratings, duration, and sleep/wake times
- **Stress Monitoring**: Before/after stress level comparisons
- **Analytics**: User insights including consistency scores and improvement metrics

### UI/UX Design
- **Design System**: Custom wellness theme with teal, sage, and warm accent colors
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Accessibility**: Proper ARIA labels and keyboard navigation support
- **Component Library**: Reusable shadcn/ui components with consistent styling

## Data Flow

### Authentication Flow
1. Unauthenticated users see landing page
2. Login redirects to Replit Auth provider
3. Successful auth creates/updates user record
4. Session established with secure cookies
5. Protected routes accessible after authentication

### Session Workflow
1. User selects session type from dashboard
2. Modal opens with session configuration options
3. Timer starts with visual progress indicators
4. Session completion triggers data collection
5. Results stored with analytics updates
6. Dashboard refreshes with updated statistics

### Data Persistence
1. All user interactions logged to PostgreSQL
2. Real-time queries through Drizzle ORM
3. Optimistic updates via TanStack Query
4. Background sync for offline resilience

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React, React DOM, React Hook Form
- **TypeScript**: Full type safety across client and server
- **Vite**: Development server and build tooling
- **Express**: Server framework with middleware support

### Database & ORM
- **Neon**: Serverless PostgreSQL with WebSocket support
- **Drizzle**: Type-safe ORM with PostgreSQL dialect
- **Connection Pooling**: Automatic connection management

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Unstyled, accessible component primitives
- **Lucide Icons**: Consistent icon library
- **Class Variance Authority**: Component variant management

### Authentication & Sessions
- **OpenID Client**: Replit Auth integration
- **Passport**: Authentication middleware
- **Connect PG Simple**: PostgreSQL session store

### Development Tools
- **TSX**: TypeScript execution for development
- **ESBuild**: Fast JavaScript bundler for production
- **PostCSS**: CSS processing with Tailwind

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite dev server with HMR
- **Database**: Neon development database
- **Environment Variables**: DATABASE_URL, SESSION_SECRET, REPL_ID
- **Debugging**: Runtime error overlay and source maps

### Production Build
- **Client Build**: Vite builds React app to dist/public
- **Server Build**: ESBuild bundles server to dist/index.js
- **Static Serving**: Express serves built client assets
- **Database Migrations**: Drizzle Kit manages schema changes

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **SESSION_SECRET**: Secure session encryption key
- **REPL_ID**: Replit environment identifier
- **NODE_ENV**: Environment mode (development/production)

### Scaling Considerations
- **Serverless Database**: Neon handles connection scaling automatically
- **Session Storage**: PostgreSQL sessions support horizontal scaling
- **Static Assets**: Client build optimized for CDN deployment
- **API Rate Limiting**: Prepared for rate limiting middleware addition

The application is designed for easy deployment on Replit with automatic database provisioning and authentication setup. The modular architecture supports feature additions and scaling as the user base grows.

## Recent Changes

### UX Overhaul (January 2025)
- **Landing Page Redesign**: Removed white text on light backgrounds, changed to clean white background with black text
- **Color Theme Refinement**: Changed from full green theme to minimal green accents only
- **"One Minute" Highlighting**: Added emerald green accent to highlight key phrase in main heading
- **Profile Icon Visibility**: Fixed profile icon with solid emerald background and white text for perfect contrast
- **Mobile Navigation**: Added hamburger menu with proper mobile navigation for better mobile UX
- **Contrast Enhancement**: Improved all color contrasts throughout the app for better readability
- **Button & Link Visibility**: Enhanced navigation with better active states and hover effects
- **Session Flow & Navigation**: Added complete mobile bottom navigation (Resets/Insights/Account), fixed session formatting, added back navigation to all session steps
- **Heading Update**: Changed main landing page heading to "Reset your day. One minute at a time" per user request

### Guided Emotional Flow (January 2025)
- **Complete App Reframe**: Transformed from session-selection to emotion-driven guided experience
- **Initial Feeling Check**: Users greeted with "How are you feeling?" (stressed, can't sleep, achy muscles, can't focus, overwhelmed)
- **Smart Session Matching**: App automatically suggests appropriate reset based on emotional state
- **Post-Session Flow**: After each session, re-asks "How are you feeling now?" to continue journey
- **Continuous Journey**: Users can chain multiple resets until they select "I feel better, thanks"
- **Analytics Transition**: When feeling better, users are taken to insights page with personalized recommendations
- **Feeling Tracking**: New database table tracks emotional check-ins before/after sessions for insights
- **API Integration**: Added `/api/feelings` endpoints for tracking emotional journey data