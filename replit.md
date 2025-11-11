# Replit.md - GetResett Wellness App

## Overview
GetResett is a wellness application that offers science-backed 60-second reset sessions for mental and physical well-being. It provides guided sessions for meditation, sleep tracking, stress relief, mindful stretches, and energy boosts. The app's core vision is to help users track progress, gain insights, and maintain wellness streaks, particularly targeting individuals with ADHD or hectic schedules who struggle with traditional long-form wellness apps. It aims to provide an accessible and effective solution for quick mental and physical resets, allowing users to chain multiple sessions based on their emotional state for a continuous guided experience.

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
- **UI/UX Design**: Modern purple/violet gradient theme with soft, calming colors. Glassmorphism effects with backdrop blur. Rounded cards (rounded-3xl). Mobile-first responsive design. All text properly contained within responsive containers. Account and Sign Out buttons in header. Remaining free sessions displayed for non-subscribed users.
- **Data Flow**: Authentication via Replit Auth → Emotion selection → Reset selection → Interactive/Story experience → Mood rating → Data persistence via PostgreSQL and Drizzle ORM
- **Monetization**: Implements a comprehensive subscription model with 3 free daily sessions, tracked via localStorage with timezone-aware date keys. On 4th reset attempt, non-subscribed users see GetResett+ paywall. New users receive a 30-day free trial with setup intent (no charge), while returning users who've already had a trial are charged the equivalent of £1.99 GBP in their local currency (calculated using real-time exchange rates - e.g., $2.53 USD, €2.39 EUR, ₹213 INR, ¥382 JPY, etc.) immediately via payment intent. Features mobile-first UX design with Apple Pay and Google Pay support, full international currency support with proper conversion from GBP base price, and seamless trial eligibility detection via Stripe subscription history.
- **Session Limits**: Free users get 3 resets per day. useSessionLimits hook tracks count in localStorage. Session check happens before starting reset. Increments count for non-subscribers only. Subscribed users and test account (huzefausama25@gmail.com) have unlimited access.
- **Internationalization**: Automatically detects user's country via IP geolocation and browser locale, displays pricing in local currency using real-time exchange rates, and processes payments in the user's local currency. Supports 18+ major currencies including USD, EUR, JPY, KRW, INR, and others with proper formatting and conversion.
- **Performance Optimization**: Comprehensive speed optimizations including instant fallback data for currency detection, extended caching (24hr for location, 1hr for exchange rates), GPU-accelerated animations, lazy loading components, virtual scrolling for large lists, DNS prefetch for external APIs, debounced/throttled user interactions, and intersection observer hooks for viewport-based loading. Critical CSS is inlined and font loading is optimized with swap display.
- **Testing Access**: Unlimited access granted to test accounts (huzefausama25@gmail.com, jackweight1@gmail.com) for comprehensive app testing (bypasses session limits and subscription requirements, shows 999 remaining sessions).
- **Authentication Improvements**: Enhanced authentication flow to better support Google 2FA with improved error handling and user feedback. Uses "select_account consent" prompt to ensure proper account selection for users with multiple Google accounts and 2FA enabled. Fixed critical authentication strategy hostname handling for development environment with robust fallback system, resolving 500 errors on login endpoints. User upsert now uses email as conflict target (preventing duplicate key violations) and preserves existing user IDs to avoid foreign key constraint errors.
- **Energy to Burn Movement Resets (4 Comprehensive Exercise Sessions)**:
  - **Distinct Orange/Red Energy Theme**: All movement resets feature consistent orange-to-red gradient theme (`from-orange-500 to-red-500`) distinct from other emotional states. Warm orange/red backgrounds for stretch steps (`bg-orange-50 border-2 border-orange-300`), white/transparent backdrop for exercise steps (`bg-white/50 backdrop-blur-sm border-2 border-orange-200`). Timer displays with orange gradient and 4px orange ring. "WARM-UP STRETCH" badges with Energy gradient.
  - **Enhanced Visual Hierarchy**: Form guide images feature larger containers (max-w-sm sm:max-w-md), 4px orange borders, gradient backgrounds, and "FORM GUIDE" badge overlays. All interactive elements have proper shadows, borders, and visual distinction.
  - **Premium Fitness App UX (MovementCard Component)**: Professional fitness app experience inspired by Peloton/Nike Training Club/Apple Fitness+. Custom MovementCard component features layered glass background, left-aligned layout, generous whitespace (8pt soft grid), staggered entrance animations (fade+slide), hero visual aid at top with "FORM GUIDE" badge overlay, prominent timer chip with Energy gradient, and low-impact alternative move callouts. Animated Dumbbell icon fallback for movements without form guide images ensures every step has visual guidance.
  - **Ultra-Brief Movement Instructions**: All 31 movement instructions use scannable 3-line micro-copy format (20-30 words total): Line 1 = Setup, Line 2 = Movement action, Line 3 = Breath/safety guidance. Format uses `\n\n` line breaks for natural spacing. No section labels (removed "Setup & Move —" style headers). Mobile-first readability optimized for quick comprehension during exercise.
  - **4 Complete Reset Sessions**:
    - **3-Minute Micro-Workout** (180s): 3 warm-up stretches (neck rolls, arm circles, torso twists) + 6 exercises (jumping jacks, high knees, squats, arm pulses, modified burpees) + rest period + cooldown
    - **Quick Shadowboxing** (150s): 3 stretches (shoulder rolls, wrist circles, hip circles) + stance training + 6 boxing movements (jab practice, cross punches, jab-cross combos, hooks, speed round) + cooldown
    - **Breath-Plus-Movement** (120s): 2 stretches (side bends, forward fold) + 6 breath-synced movements (reach & squat, lunge & twist, plank hold, mountain climbers, standing twist) + extended exhale breathing
    - **Walk It Off** (180s): 2 stretches (ankle rolls, leg swings) + 7 walking intervals (slow warm-up, medium pace, power walk, recovery, high knees, cool down, final stretch)
  - **Image Loading & Error Handling**: Movement visual aids stored in `client/public/movement/` (correct Vite static asset path). Images include proper `onError` handlers with console logging for debugging. Form guide images display for key exercises (jumping jacks, squats, boxing stance, jab, cross punch, side bend, lunge twist, plank, mountain climbers, power walk).
  - **Safety Features**: All resets include mandatory disclaimer, comprehensive stretch-first steps, low-impact modification options, breathing reminders throughout, and detailed safety cues (e.g., "Land with soft knees, not locked," "Stop if you feel pain," "Do not hold breath").
- **Recent Updates (Nov 2025)**:
  - Landing page CTAs changed from "Start Your Free Trial" to "Try GetResett Free" to encourage trying app first
  - Bubble Pop Calm (anxiety reset) now features fully interactive bubble-tap game: 8 floating bubbles with click-to-pop functionality, timed respawn (500ms), and emotion-specific gradient colors
  - Added /resets as public route to fix 404 navigation issues
  - **Premium Energy Reset UX Redesign (Nov 11, 2025)**: Complete overhaul of Energy to Burn movement instruction experience to match premium fitness apps (Peloton/Nike/Apple Fitness+ level). Created custom MovementCard component with layered glass backgrounds, left-aligned professional layout, staggered animations, hero visuals with "FORM GUIDE" badges, and prominent Energy gradient timers. All 31 movement instructions converted from verbose coaching format to ultra-brief 3-line micro-copy (20-30 words: Setup / Movement / Breath-Safety) with natural `\n\n` line breaks for mobile-first readability. Fixed Energy color consistency across all 4 resets (Micro-Workout, Shadowboxing, Breath-Movement, Walk It Off) to use unified `from-orange-500 to-red-500` gradient on tiles, badges, timers, and hover effects. Added animated icon fallbacks for movements without form guide images. Architect-reviewed and e2e tested - passes premium fitness app UX standards.
  - **Manual Progression Control & Stressed Resets Redesign (Nov 11, 2025)**: Completely removed auto-advancing timer system - ALL resets now require manual Continue button clicks for full user control. No timers, no auto-progression. Replaced all 4 Stressed section resets with new science-backed designs: Full-Body Tense & Release (progressive-muscle relaxation), Fact vs Story (interactive categorization game with Facts/Story sorting and reframe selection), Safety Scan (visual-grounding 5-4-3-2-1), Two-Minute Triage (interactive sorting game with Now/Soon/Later categorization and action selection). Implemented 2 new interactive game types (fact-vs-story, two-minute-triage) with proper state management, color-coded categorization buttons, and smooth animations. Test account bypass enhanced with case-insensitive email matching and debug logging. All 22 interactive game types work reliably with proper animation restart using `key={game-${currentStepIndex}}` pattern. Architect-reviewed and e2e tested - all Stressed resets function correctly with manual click-to-proceed control.

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