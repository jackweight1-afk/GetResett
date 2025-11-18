# Replit.md - GetResett Wellness App

## Overview
GetResett is a corporate wellness application designed to provide science-backed, 60-second reset sessions for mental and physical well-being. It offers guided sessions for meditation, sleep tracking, stress relief, mindful stretches, and energy boosts. The app aims to help users track progress, gain insights, and maintain wellness habits, particularly targeting busy professionals who require quick, accessible, and effective mental and physical resets. It allows users to chain multiple sessions based on their emotional state for a continuous guided experience.

## User Preferences
Preferred communication style: Simple, everyday language.

### UI/UX Preferences
- Modern mobile-first design is essential - all text must stay within containers, no overflow issues
- Logo text must be solid black for maximum visibility on all devices (no gradient text that becomes unreadable)
- CTAs should encourage trying the app free first rather than pushing subscription immediately
- Purple/teal gradient theme throughout the app for consistency
- Landing page uses yellow → pink/purple → teal gradient matching logo aesthetic
- Modern glassmorphism effects, smooth animations, and shadow designs
- Touch-friendly button sizes and spacing optimized for mobile devices
- Excellent contrast ratios required for all text elements
- Responsive typography that scales appropriately across screen sizes

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
- **Authentication System**: 
  - **Dual Authentication**: Supports both Replit Auth (OIDC) and email/password authentication
  - **Email/Password Auth**: New users can register with name/email/password (with confirmation field) using bcryptjs hashing
  - **Google Login**: "Continue with Google" buttons on login/signup pages using Replit Auth's Google OAuth integration
  - **Password Reset Flow**: Complete forgot password and reset password pages with email-based token system (1-hour expiry)
  - **Unified Middleware**: `isAuthenticatedUnified` handles both auth methods seamlessly
  - **Session Management**: Express sessions with PostgreSQL storage, secure HTTP-only cookies
  - **User ID Resolution**: `getUserId()` helper checks both session.userId (email auth) and user.claims.sub (Replit Auth)
  - **Null Safety**: All protected routes validate userId and return 401 if null, preventing crashes
  - **Security Features**: Email enumeration prevention, password confirmation validation, token expiry
  - **Complete Onboarding Flow**:
    - New users go through: Welcome → Sign Up/Login → Optional Corporate Code → First Reset Walkthrough
    - `hasCompletedOnboarding` flag tracks onboarding completion
    - Redirects based on auth state and onboarding status
    - First-time users experience a guided reset before accessing full app
  - **Corporate Access System**:
    - Organizations table with unique `corporateCode` field
    - Users can enter corporate codes to link to organization
    - Corporate users (`organisationId` set) get unlimited resets
    - Account page allows corporate code entry and removal
    - Paywall includes "Enter corporate code" option with SPA navigation
  - **Transactional User Upsert**: Handles OIDC ID changes by migrating user data atomically with deduplication
  - **Test Accounts**: huzefausama25@gmail.com, jackweight1@gmail.com have unlimited access
  
- **Interactive Reset System**: 
  - Features 16+ unique reset experiences using ResetSpec schema
  - Categorized by 5 emotional states: Stressed (4 resets), Anxiety (3 resets), Restless (4 resets), Tired (4 resets), Scattered (4 resets)
  - Manual Continue/Back button navigation (no auto-advancing timers)
  - Each reset has steps with {id, title, lines[], animationKey, helperHint}
  - Adapter layer converts new ResetSpec schema to legacy format for backward compatibility
  - **Stressed Resets**: Guided visualization experiences (Full-Body Tense & Release, Fact–Story Lens, Safety Scan, Mental Triage)
  - **Energy to Burn Movement Resets**: Exercise sessions with orange/red gradient theme
  
- **Session Flow**: 
  - Users select emotional state → choose reset → complete with manual navigation → rate mood (1-10)
  - Loop-back flow: If mood rating ≤3, offer another reset; if >3, show success and return to dashboard
  
- **Tracking Systems**: 
  - Automatic session creation when user completes reset and submits mood rating
  - Emotion-to-session-type mapping (stressed → Stress Relief, scattered → Focus Reset, etc.)
  - Emotion-specific durations (stressed=75s, anxiety=90s, restless=90s, tired=105s, scattered=90s)
  - Daily usage tracking with unique constraint on (userId, date) for accurate counting
  - Feeling entries linked to sessions via sessionId for comprehensive analytics
  - Dashboard displays session history, streaks, and analytics
- **UI/UX Design**: Modern purple/violet gradient theme with glassmorphism effects, rounded cards, and mobile-first responsiveness.
- **Monetization**: Subscription model offers 3 free daily sessions, tracked via `localStorage`. Non-subscribers encounter a paywall on the 4th attempt. New users receive a 30-day free trial; returning users are charged immediately. Supports Apple Pay, Google Pay, and international currency conversion based on real-time exchange rates from a GBP base price.
- **Internationalization**: Automatically detects user's country via IP geolocation and browser locale, displaying pricing in local currency with real-time exchange rates across 18+ major currencies.
- **Performance Optimization**: Includes instant fallback data for currency, extended caching, GPU-accelerated animations, lazy loading, virtual scrolling, DNS prefetching, debouncing/throttling, and optimized font loading.

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