# Replit.md - GetReset Wellness Platform

## Overview
GetReset is a **pure B2B corporate wellness platform** providing science-backed, 60-90 second reset sessions for workplace mental and physical wellbeing. Access is 100% corporate code-based - no individual signups, trials, or subscriptions. The platform includes a public marketing website (consumer-friendly for traffic generation), an upcoming iOS app, and a Super Admin Dashboard for platform management. The business model: Super admin creates organizations and generates unique corporate codes for £5.99/employee/month (monthly invoicing). Companies distribute codes to employees who get instant unlimited access. The business vision is to provide accessible, impactful wellness tools to corporate environments, enhancing employee wellbeing and productivity.

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
- Landing page CTAs drive traffic to /business page for B2B lead generation and employee access
- Purple/teal gradient theme throughout the app for consistency
- Landing page uses yellow → pink/purple → teal gradient matching logo aesthetic
- Modern glassmorphism effects, smooth animations, and shadow designs
- Touch-friendly button sizes and spacing optimized for mobile devices
- Excellent contrast ratios required for all text elements
- All text content shortened to 1-2 concise lines per point to prevent mobile clutter

## System Architecture
The application uses a modern full-stack architecture with a clear client-server separation.

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: Wouter
- **UI Framework**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS (custom wellness palette)
- **State Management**: TanStack Query
- **Form Handling**: React Hook Form with Zod

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ES modules)
- **Authentication**: Replit Auth (OpenID Connect) & Email/Password
- **Session Management**: Express sessions (PostgreSQL storage)
- **API Design**: RESTful endpoints

### Database Architecture
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM
- **Schema Management**: Drizzle Kit
- **Connection Pooling**: Neon serverless

### Key Components & Design
- **Authentication System**: Supports Replit Auth (Google OAuth) and email/password. Super admin login (getresett@gmail.com) OR corporate employee signup with valid corporate code only. NO individual signups or account approvals - corporate codes provide instant activation with unlimited access.
- **Onboarding Flow**: Guided walkthrough for new users, ensuring a smooth first experience. Only accessible via corporate code-validated signup.
- **Corporate Access System**: `organizations` table manages unique `corporateCode`s (e.g., "12345" for GetReset Internal demos). `/business-signup` page validates codes server-side (rate-limited to 5 attempts/hour per IP), creates account with `organisationId` + `isActive:true`, granting instant unlimited access. `isOrganisationAdmin` flag differentiates company admins who can access company dashboards.
- **B2B Platform Features**:
    - **Marketing Funnel Flow**: Landing page → "GetReset for Business" CTA → `/business` marketing page → Dual paths:
        - **"Enquire Now"** button → `/business/contact` (lead generation form for new business inquiries)
        - **"Employee Access"** button → `/business-signup` (corporate code-gated employee signup)
    - **Business Marketing Page** (`/business`): Displays three-tier pricing model (£5.99/employee/month), benefits section, and dual CTAs for inquiries vs. employee access.
    - **Employee Signup Flow** (`/business-signup`): Code-first validation → validates corporate code → creates account with `organisationId` + `isActive:true` → instant unlimited access.
    - **Lead Generation**: Contact form for business inquiries, stored and tracked in `business_leads` table.
    - **Super Admin Dashboard**: Protected `/admin` route for global analytics, organization management (create, edit, delete, view analytics), lead pipeline management, and user activation/deactivation.
    - **Company Admin Dashboard**: Protected `/company` route for organization-specific analytics, corporate code display with copy button, and employee invitation guidance.
- **Interactive Reset System**: Comprises 16+ unique reset experiences categorized by emotional states (Stressed, Anxiety, Restless, Tired, Scattered). Each reset has manual navigation steps with content and animations.
- **Session & Tracking**: Automatic session creation upon reset completion and mood rating. All corporate users have unlimited access with no session limits. Tracks emotional states and links feeling entries to sessions for comprehensive analytics.
- **Access Model**: Pure B2B corporate access - NO individual signups, trials, subscriptions, or payment processing. All authenticated corporate users have unlimited reset access. Access validated server-side: requires `isActive=true` AND `organisationId` (corporate affiliation).
- **Internationalization**: Auto-detects user country, displaying pricing in local currency with real-time exchange rates (£5.99/employee/month GBP base price).
- **Performance Optimization**: Includes instant fallback data, extended caching, GPU-accelerated animations, lazy loading, virtual scrolling, DNS prefetching, debouncing/throttling, and optimized font loading.

## Recent Changes (November 19, 2025)
**Pivoted to Pure B2B Corporate Model:**
- ✅ Removed all Stripe integration (subscriptions, payments, webhooks - 200+ lines)
- ✅ Removed session limits and usage tracking (no more 3 free daily sessions or paywalls)
- ✅ Removed trial logic and individual signup flows
- ✅ Deleted useSessionLimits hook and paywall components
- ✅ Added server-side corporate access validation (blocks inactive users, requires organisationId)
- ✅ Added rate limiting to corporate code verification (5 attempts/hour per IP)
- ✅ Created demo organization "GetReset Internal" with code "12345" for testing
- ✅ Marked legacy database fields (stripeCustomerId, subscriptionStatus, dailyUsage table) as unused

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
- **Exchange Rate API**: For international currency conversion (B2B pricing display)