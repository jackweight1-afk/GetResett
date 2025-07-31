# Replit.md - GetResett Wellness App

## Overview
GetResett is a wellness application that offers science-backed 60-second reset sessions for mental and physical well-being. It provides guided sessions for meditation, sleep tracking, stress relief, mindful stretches, and energy boosts. The app's core vision is to help users track progress, gain insights, and maintain wellness streaks, particularly targeting individuals with ADHD or hectic schedules who struggle with traditional long-form wellness apps. It aims to provide an accessible and effective solution for quick mental and physical resets, allowing users to chain multiple sessions based on their emotional state for a continuous guided experience.

## User Preferences
Preferred communication style: Simple, everyday language.

### UI/UX Preferences
- No white text on light backgrounds - all text should be black/dark gray for maximum readability
- Minimal green theme - use darker green colors only as accents (like highlighting "One Minute")
- No full green backgrounds - prefer white/light gray backgrounds with green accents
- Excellent contrast ratios required for all text elements
- Profile icons should have solid dark backgrounds with white text for visibility

## System Architecture

The application employs a modern full-stack architecture with a clear separation between client and server.

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: Wouter
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with a custom wellness-themed color palette
- **State Management**: TanStack Query (React Query) for server state
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL storage
- **API Design**: RESTful endpoints

### Database Architecture
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM for type-safe operations
- **Schema Management**: Drizzle Kit for migrations
- **Connection Pooling**: Neon serverless connection pooling

### Key Components & Design
- **Authentication System**: Utilizes Replit Auth with OpenID Connect, PostgreSQL-backed sessions, and secure HTTP-only cookies.
- **Session Management**: Features predefined wellness activities with real-time tracking, progress recording, and post-session data collection (mood ratings, reflections). Each session type has 3 variations to prevent repetition, selected randomly.
- **Tracking Systems**: Includes sleep tracking, stress monitoring (before/after comparisons), and user analytics for consistency and improvement metrics. Emotional check-ins before and after sessions are tracked.
- **UI/UX Design**: Adheres to a custom wellness theme with teal, sage, and warm accent colors, prioritizing responsive, mobile-first design, and accessibility (ARIA labels, keyboard navigation). The application guides users through an emotion-driven flow, suggesting resets based on their current feeling. Active anxiety relief sessions utilize evidence-based grounding techniques.
- **Data Flow**: Authentication involves Replit Auth, session establishment with secure cookies, and access to protected routes. The session workflow guides users from selection to completion, with data persistence handled via PostgreSQL and Drizzle ORM, optimized with TanStack Query.
- **Monetization**: Implements a soft monetization model with a daily free session limit, transitioning to a monthly subscription (£1.99 or localized currency) for unlimited access via Stripe. The paywall appears non-intrusively when the free limit is reached.
- **Internationalization**: Automatically detects user's country and displays pricing in local currency using real-time exchange rates.

## External Dependencies

- **React Ecosystem**: React, React DOM, React Hook Form
- **TypeScript**
- **Vite**
- **Express**
- **Neon**: Serverless PostgreSQL
- **Drizzle**: Type-safe ORM
- **Tailwind CSS**
- **Radix UI**: Component primitives
- **Lucide Icons**: Icon library
- **Class Variance Authority**: Component variant management
- **OpenID Client**: For Replit Auth integration
- **Passport**: Authentication middleware
- **Connect PG Simple**: PostgreSQL session store
- **Stripe**: For subscription and payment processing
- **Exchange Rate API**: For international currency conversion