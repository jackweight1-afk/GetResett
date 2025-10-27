# Replit.md - GetResett Wellness App

## Overview
GetResett is a wellness application that offers science-backed 60-second reset sessions for mental and physical well-being. It provides guided sessions for meditation, sleep tracking, stress relief, mindful stretches, and energy boosts. The app's core vision is to help users track progress, gain insights, and maintain wellness streaks, particularly targeting individuals with ADHD or hectic schedules who struggle with traditional long-form wellness apps. It aims to provide an accessible and effective solution for quick mental and physical resets, allowing users to chain multiple sessions based on their emotional state for a continuous guided experience.

## User Preferences
Preferred communication style: Simple, everyday language.

### UI/UX Preferences
- Modern mobile-first design is essential - all text must stay within containers, no overflow issues
- CTAs should encourage trying the app free first rather than pushing subscription immediately
- **Biophilic-Luxe Design System**: Premium wellness aesthetic with deep evergreen, warm clay, and sophisticated natural tones
- Primary colors: Deep evergreen (hsl(150, 45%, 20%) to hsl(150, 40%, 28%)), warm clay (hsl(25, 35%, 45%)), ivory (hsl(40, 30%, 95%))
- Background accents: Desaturated sage (hsl(150, 15%, 92%) and hsl(150, 10%, 96%)) for subtle depth
- Premium typography: Display (weight 800, tight tracking), Headline (weight 700), Body-light (weight 400, line-height 1.7) using Plus Jakarta Sans for headings, DM Sans for body
- Layered shadow system with green tint for premium depth (shadow-elegant, shadow-premium with multiple layers)
- Emotion state gradients preserved for emotional association (purple, pink, amber, indigo, blue, green/teal)
- Glassmorphism effects throughout (buttons, cards, footer) with backdrop blur and subtle borders
- Premium CTA buttons: Warm clay with ivory text, refined rounded corners (rounded-2xl)
- Secondary buttons: Glassmorphism with backdrop blur
- Touch-friendly button sizes optimized for mobile devices
- Excellent contrast with emerald-800 accents on light backgrounds
- Responsive typography that scales appropriately across screen sizes
- Animated gradient text effects for hero headlines (evergreen to clay gradient)

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
- **Interactive Reset System**: Complete redesign featuring 24 unique reset experiences (6 emotional states × 4 resets each):
  - **Emotional States**: Stressed (purple/indigo), Anxiety (pink/rose), Restless (amber/orange), Overwhelmed (indigo/purple), Tired (blue/cyan), Scattered (green/teal) - each with unique gradient backgrounds, tailored descriptions, and icons
  - **Reset Types**: 2 story-based narrative journeys + 2 interactive game-style exercises per emotion
  - **Interactive Exercises**: Grounding 5-4-3-2-1, box breathing, progressive muscle relaxation, tapping (EFT), counting exercises, body scan meditation
  - **Story Experiences**: Guided narrative journeys using science-backed emotional regulation techniques (mountain meditation, ocean breathing, forest walk, garden visualization, etc.)
  - **Duration**: All resets are max 2 minutes, optimized for ADHD and busy minds
  - **State Management**: Proper stage progression with state resets between steps (fixed completedItems persistence bug)
- **Session Flow**: 
  1. User selects emotional state from 6 options
  2. Chooses from 4 reset options (2 stories + 2 interactive)
  3. Completes guided reset experience
  4. Rates mood post-session (1-10 scale)
  5. If mood rating < 8, offered to try another reset for same emotion (loop-back flow)
  6. If mood rating >= 8, shows success message and returns to emotion selection
- **Tracking Systems**: Post-session mood ratings stored with emotional state and isPostSession flag for analytics. Dashboard shows consistency metrics and improvement trends.
- **UI/UX Design**: Premium biophilic-luxe design with deep evergreen and warm clay palette. Sophisticated gradient header (hsl(150, 45%, 20%) to hsl(150, 40%, 28%)) with backdrop blur and glassmorphism. Animated gradient text in hero (evergreen to clay). Layered premium shadows with green tint. Desaturated sage background accents. Warm clay CTA buttons with ivory text. Glassmorphism effects on secondary buttons and cards. Refined typography hierarchy (Display 800, Headline 700, Body-light 400). Rounded-2xl buttons and cards. Mobile-first responsive design. All text properly contained within responsive containers. Account and Sign Out buttons in header. Remaining free sessions displayed for non-subscribed users. Emotion state gradients preserved for psychological association.
- **Data Flow**: Authentication via Replit Auth → Emotion selection → Reset selection → Interactive/Story experience → Mood rating → Data persistence via PostgreSQL and Drizzle ORM
- **Monetization**: Implements a comprehensive subscription model with 3 free daily sessions, tracked via localStorage with timezone-aware date keys. On 4th reset attempt, non-subscribed users see GetResett+ paywall. New users receive a 30-day free trial with setup intent (no charge), while returning users who've already had a trial are charged the equivalent of £1.99 GBP in their local currency (calculated using real-time exchange rates - e.g., $2.53 USD, €2.39 EUR, ₹213 INR, ¥382 JPY, etc.) immediately via payment intent. Features mobile-first UX design with Apple Pay and Google Pay support, full international currency support with proper conversion from GBP base price, and seamless trial eligibility detection via Stripe subscription history.
- **Session Limits**: Free users get 3 resets per day. useSessionLimits hook tracks count in localStorage. Session check happens before starting reset. Increments count for non-subscribers only. Subscribed users and test account (huzefausama25@gmail.com) have unlimited access.
- **Internationalization**: Automatically detects user's country via IP geolocation and browser locale, displays pricing in local currency using real-time exchange rates, and processes payments in the user's local currency. Supports 18+ major currencies including USD, EUR, JPY, KRW, INR, and others with proper formatting and conversion.
- **Performance Optimization**: Comprehensive speed optimizations including instant fallback data for currency detection, extended caching (24hr for location, 1hr for exchange rates), GPU-accelerated animations, lazy loading components, virtual scrolling for large lists, DNS prefetch for external APIs, debounced/throttled user interactions, and intersection observer hooks for viewport-based loading. Critical CSS is inlined and font loading is optimized with swap display.
- **Testing Access**: Unlimited access granted to huzefausama25@gmail.com for comprehensive app testing (bypasses session limits and subscription requirements, shows 999 remaining sessions).
- **Authentication Improvements**: Enhanced authentication flow to better support Google 2FA with improved error handling and user feedback. Uses "select_account consent" prompt to ensure proper account selection for users with multiple Google accounts and 2FA enabled. Fixed critical authentication strategy hostname handling for development environment with robust fallback system, resolving 500 errors on login endpoints.

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