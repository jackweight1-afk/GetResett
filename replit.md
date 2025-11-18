# Replit.md - GetReset Wellness Platform

## Overview
GetReset is a B2B corporate wellness platform that provides science-backed, 60-90 second reset sessions for workplace mental and physical wellbeing. The platform consists of:

1. **Public Marketing Website**: Directs traffic to iOS app download and corporate partnerships
2. **iOS App** (Coming Soon): Consumer-facing mobile application for individual users
3. **GetReset for Business**: Three-tier corporate wellness solution (Core Access, Growth Support, Culture Partner)
   - Flat pricing: £5.99/employee/month across all tiers
   - Value-based differentiation: Wellbeing Reset Days, enhanced reporting, custom content
   - Corporate access via unique company codes
   - Employees get unlimited resets with no paywall
4. **Super Admin Dashboard**: Platform management for analytics, lead pipeline, and organization oversight

The web platform features guided reset sessions for stress, anxiety, restlessness, tiredness, and scattered feelings, with manual navigation and mood tracking. Corporate employees access unlimited sessions while organizations are invoiced monthly based on employee count.

## User Preferences
Preferred communication style: Simple, everyday language.

### UI/UX Preferences
- Modern mobile-first design is essential - all text must stay within containers, no overflow issues
- **Premium Reset-Card Aesthetic**: All auth/onboarding pages use white/80 backdrop-blur cards with rounded-3xl corners, shadow-lg, and subtle purple borders (border-purple-100/50)
- **Solid Text for Readability**: Landing page and all page titles use solid black text (text-gray-900) instead of gradients for maximum legibility
- **Mobile-First Typography Standards**: 
  - Headings: text-xl sm:text-2xl (compact for mobile, clean readability)
  - Body text: text-xs sm:text-sm (prevents overflow, professional appearance)
  - Labels: text-xs (minimal space usage)
  - Helper text: text-[11px] sm:text-xs (very compact)
- **Compact Spacing Standards**:
  - Card padding: p-5 sm:p-7 (optimized for mobile viewports)
  - Vertical spacing: space-y-3 to space-y-3.5 (tight, clean layouts)
  - Button heights: h-10 (consistent, thumb-friendly)
  - Icon sizes: h-12 w-12 sm:h-14 sm:w-14 or h-14 w-14 sm:h-16 sm:w-16
- **Consistent Background**: Auth/onboarding pages share bg-gradient-to-br from-purple-50 via-violet-50 to-blue-50
- CTAs should encourage trying the app free first rather than pushing subscription immediately
- Purple/teal gradient theme throughout the app for consistency
- Landing page uses yellow → pink/purple → teal gradient matching logo aesthetic
- Modern glassmorphism effects, smooth animations, and shadow designs
- Touch-friendly button sizes and spacing optimized for mobile devices
- Excellent contrast ratios required for all text elements
- All text content shortened to 1-2 concise lines per point to prevent mobile clutter

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

- **B2B Platform Features**:
  - **Public Marketing Site**: Landing page ("Quick resets for busy minds") with dual CTAs for iOS download and business inquiries
  - **Business Marketing Page**: Three-tier pricing display (Core/Growth/Culture Partner at £5.99/employee/month) with "Sign In" button
  - **Lead Generation**: Contact form for business inquiries, stored in business_leads table with status tracking
  - **iOS Download Page**: Holding page with email notification signup for app launch
  - **Super Admin Dashboard** (/admin): 
    - Protected route with backend authorization (requireSuperAdmin middleware)
    - Global analytics: total resets, organizations, employees, monthly revenue
    - Organization management: view all orgs, create new orgs, view per-org analytics
    - Lead pipeline: view and update business inquiry status (new/contacted/qualified/converted/lost)
    - Popular resets tracking across platform
  - **Company Admin Dashboard** (/company):
    - Shows organization details (name, tier, billing status, employee count)
    - Displays corporate code with copy button
    - Generates shareable invite links: `signup?code=GR-ABC123`
    - Shows analytics: total resets, active employees, engagement rate
    - Lists most popular resets used by employees
    - Provides instructions for inviting employees
  - **Invite Link Flow**:
    - Admins copy invite link from company dashboard
    - Employees click link → signup page with code pre-filled in URL
    - After signup → corporate-code page auto-fills code
    - Employee confirms → gets unlimited access
  - **Security**: All /api/admin/* routes protected with isAuthenticatedUnified + requireSuperAdmin middleware
  - **Super Admin Access**: Verified against super_admins table, emails: jackweight1@gmail.com, huzefausama25@gmail.com
  - **Database Tables**: business_leads, super_admins, organizations (with tier, billing status, employee count)
  - **API Endpoints**: GET /api/user/organization returns organization details and analytics for authenticated company admins
  
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
- **UI/UX Design**: 
  - **Premium Styling**: All auth/onboarding pages feature white/80 backdrop-blur cards with rounded-3xl, shadow-lg, and border-purple-100/50
  - **Mobile-First Typography**: Solid text-gray-900 headings (text-xl sm:text-2xl), concise body text (text-xs sm:text-sm), compact labels (text-xs)
  - **Compact Spacing**: Card padding p-5 sm:p-7, vertical spacing space-y-3 to space-y-3.5, button heights h-10
  - **Consistent Background**: from-purple-50 via-violet-50 to-blue-50 gradient across all auth pages
  - **Shortened Content**: First-reset walkthrough and all onboarding text condensed to 1-2 lines per point for clean mobile appearance
  - Modern purple/violet gradient theme with glassmorphism effects, rounded cards, and mobile-first responsiveness
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