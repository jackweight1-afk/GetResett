# Replit.md - GetResett Wellness App

## Overview
GetResett is a wellness application designed to provide science-backed, 60-second reset sessions for mental and physical well-being. It offers guided sessions for meditation, sleep tracking, stress relief, mindful stretches, and energy boosts. The app aims to help users track progress, gain insights, and maintain wellness streaks, particularly targeting individuals with ADHD or hectic schedules who require quick, accessible, and effective mental and physical resets. It allows users to chain multiple sessions based on their emotional state for a continuous guided experience.

## User Preferences
Preferred communication style: Simple, everyday language.

### UI/UX Preferences
- Modern mobile-first design is essential - all text must stay within containers, no overflow issues
- Logo text must be solid black for maximum visibility on all devices (no gradient text that becomes unreadable)
- CTAs should encourage trying the app free first rather than pushing subscription immediately
- Purple/teal gradient theme throughout the app for consistency
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
- **Authentication System**: Utilizes Replit Auth with OpenID Connect, PostgreSQL-backed sessions, and secure HTTP-only cookies. Enhanced for Google 2FA and robust hostname handling.
- **Interactive Reset System**: Features 24 unique, 2-minute reset experiences categorized by 6 emotional states (Stressed, Anxiety, Restless, Overwhelmed, Tired, Scattered). Each state has 2 story-based narratives and 2 interactive game-style exercises. Users manually progress through steps.
  - **Stressed Resets**: Overhauled to simplified guided visualization experiences (e.g., Full-Body Tense & Release, Fact–Story Lens, Safety Scan, Mental Triage) with manual progression.
  - **Energy to Burn Movement Resets**: Four comprehensive exercise sessions (Micro-Workout, Shadowboxing, Breath-Plus-Movement, Walk It Off) with a distinct orange/red gradient theme. Features a custom `MovementCard` component with professional UX, ultra-brief 3-line instructions, and safety features.
- **Session Flow**: Users select an emotional state, choose a reset, complete it, rate their mood, and are offered further resets if mood is low.
- **Tracking Systems**: Post-session mood ratings and emotional state are stored for analytics, contributing to consistency metrics and improvement trends on the dashboard.
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