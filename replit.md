# Replit.md - GetReset Marketing & Demo Website

## Overview
GetReset is a **marketing and lead generation web application** for showcasing a corporate wellness platform. The web app consists of:
1. **Public marketing pages** - Landing page, business page, and contact form for lead generation
2. **Password-protected demo area** - Accessible at `/demo` with password "GetReset123!" for showcasing reset sessions to prospects

**Important**: The actual corporate wellness platform with employee access codes will be delivered through a separate **iOS app**. This web app is purely for marketing and demos - no authentication, user management, or subscription systems exist.

## User Preferences
Preferred communication style: Simple, everyday language.

### UI/UX Preferences
- Modern mobile-first design is essential - all text must stay within containers, no overflow issues
- **Premium Reset-Card Aesthetic**: Demo and form pages use white/80 backdrop-blur cards with rounded-3xl corners, shadow-lg, and subtle purple borders (border-purple-100/50)
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
- **Consistent Background**: Demo/form pages share bg-gradient-to-br from-purple-50 via-violet-50 to-blue-50
- Landing page CTAs drive traffic to /business page for B2B lead generation
- Purple/teal gradient theme throughout the app for consistency
- Landing page uses yellow → pink/purple → teal gradient matching logo aesthetic
- Modern glassmorphism effects, smooth animations, and shadow designs
- Touch-friendly button sizes and spacing optimized for mobile devices
- Excellent contrast ratios required for all text elements
- All text content shortened to 1-2 concise lines per point to prevent mobile clutter

## System Architecture
The application uses a simplified architecture focused on marketing and demos only.

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
- **API Design**: RESTful endpoints (business leads only)
- **No Authentication**: Simplified architecture with no user management

### Database Architecture
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM
- **Schema Management**: Drizzle Kit
- **Connection Pooling**: Neon serverless
- **Tables**: Only `business_leads` table for contact form submissions

### Key Components & Design
- **Marketing Pages**:
  - **Landing Page** (`/`): Hero section, benefits overview, CTA to business page
  - **Business Page** (`/business`): B2B marketing content, pricing information, CTA to contact form
  - **Contact Page** (`/business/contact`): Lead generation form for business inquiries
  
- **Demo Access** (`/demo`):
  - Password-protected area (password: "GetReset123!")
  - Uses sessionStorage for password validation (no server-side auth)
  - Showcases interactive reset sessions to prospects
  - Accessible to sales team and prospects during demos
  
- **Interactive Reset System**: 
  - 16+ unique reset experiences categorized by emotional states (Stressed, Anxiety, Restless, Tired, Scattered)
  - Each reset has manual navigation steps with content and animations
  - No session tracking or user accounts - pure demo functionality
  
- **Lead Generation**: 
  - Contact form collects business inquiries
  - Stored in `business_leads` table for sales follow-up
  - No automated lead processing or CRM integration

- **Performance Optimization**: 
  - GPU-accelerated animations
  - Lazy loading for reset content
  - Optimized font loading
  - Mobile-first responsive design

## Recent Changes (November 19, 2025)
**Simplified to Marketing & Demo Web App:**
- ✅ Removed all authentication systems (Replit Auth, Passport, email/password)
- ✅ Removed user management (users, organizations, admin dashboards)
- ✅ Removed corporate code system (moved to iOS app)
- ✅ Removed session tracking and analytics
- ✅ Simplified database to only `business_leads` table
- ✅ Created password-protected `/demo` route with sessionStorage validation
- ✅ Deleted user-facing pages (login, signup, account, admin, company dashboards)
- ✅ Simplified routing to public pages + demo only
- ✅ Removed all Stripe integration and subscription logic
- ✅ Updated resets page to work without authentication

**Architecture Pivot:**
- Web app is now purely for marketing and demos
- iOS app will handle corporate employee access with codes
- No user accounts or authentication on web app
- Simple password protection for demo area using sessionStorage
- Focus on lead generation and sales enablement

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

## Future Development
- iOS app development for corporate employee platform
- Corporate code system implementation in iOS app
- User analytics and session tracking in iOS app
- Integration between web leads and iOS platform
