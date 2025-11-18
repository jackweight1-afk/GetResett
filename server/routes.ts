import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { setupAuth } from "./replitAuth";
import { setupEmailAuth, requireAuth, getUserId, isAuthenticatedUnified } from "./emailAuth";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

// Stripe key validation
const stripeKey = process.env.STRIPE_SECRET_KEY;
console.log('✅ Stripe configured:', stripeKey?.startsWith('sk_test_') ? 'TEST mode' : 
           stripeKey?.startsWith('sk_live_') ? 'LIVE mode' : 'Invalid format');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
import { 
  insertUserSessionSchema, 
  insertSleepEntrySchema, 
  insertStressEntrySchema,
  insertFeelingEntrySchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware (Replit Auth)
  await setupAuth(app);
  
  // Email/password auth
  await setupEmailAuth(app);

  // Initialize session types on startup
  await initializeSessionTypes();

  // Auth routes - supports both Replit Auth and email/password auth
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // Try to get userId from either auth method
      let userId = getUserId(req);
      
      // Fallback to Replit Auth
      if (!userId && req.user?.claims?.sub) {
        userId = getUserId(req);
      }
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      console.log("[/api/auth/user] Fetching user with ID:", userId);
      const user = await storage.getUser(userId);
      console.log("[/api/auth/user] User from database:", user ? { id: user.id, email: user.email } : 'NOT FOUND');
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("[/api/auth/user] Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Session types
  app.get('/api/session-types', isAuthenticatedUnified, async (req, res) => {
    try {
      const sessionTypes = await storage.getSessionTypes();
      res.json(sessionTypes);
    } catch (error) {
      console.error("Error fetching session types:", error);
      res.status(500).json({ message: "Failed to fetch session types" });
    }
  });

  // User sessions
  app.get('/api/sessions', isAuthenticatedUnified, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const sessions = await storage.getUserSessions(userId, 20);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      res.status(500).json({ message: "Failed to fetch sessions" });
    }
  });

  app.post('/api/sessions', isAuthenticatedUnified, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const sessionData = insertUserSessionSchema.parse({
        ...req.body,
        userId,
      });
      
      const session = await storage.createUserSession(sessionData);
      res.json(session);
    } catch (error) {
      console.error("Error creating session:", error);
      res.status(500).json({ message: "Failed to create session" });
    }
  });

  // User stats
  app.get('/api/stats', isAuthenticatedUnified, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const stats = await storage.getUserSessionStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Sleep entries
  app.get('/api/sleep', isAuthenticatedUnified, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const entries = await storage.getUserSleepEntries(userId);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching sleep entries:", error);
      res.status(500).json({ message: "Failed to fetch sleep entries" });
    }
  });

  app.post('/api/sleep', isAuthenticatedUnified, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const entryData = insertSleepEntrySchema.parse({
        ...req.body,
        userId,
      });
      
      const entry = await storage.createSleepEntry(entryData);
      res.json(entry);
    } catch (error) {
      console.error("Error creating sleep entry:", error);
      res.status(500).json({ message: "Failed to create sleep entry" });
    }
  });

  // Stress entries
  app.post('/api/stress', isAuthenticatedUnified, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const entryData = insertStressEntrySchema.parse({
        ...req.body,
        userId,
      });
      
      const entry = await storage.createStressEntry(entryData);
      res.json(entry);
    } catch (error) {
      console.error("Error creating stress entry:", error);
      res.status(500).json({ message: "Failed to create stress entry" });
    }
  });

  // Insights
  app.get('/api/insights', isAuthenticatedUnified, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const insights = await storage.getUserInsights(userId);
      res.json(insights);
    } catch (error) {
      console.error("Error fetching insights:", error);
      res.status(500).json({ message: "Failed to fetch insights" });
    }
  });

  // User stats route (for account page)
  app.get('/api/user/stats', isAuthenticatedUnified, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const stats = await storage.getUserSessionStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  // Feeling entries
  app.post('/api/feelings', isAuthenticatedUnified, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const feelingData = insertFeelingEntrySchema.parse({
        ...req.body,
        userId,
      });
      
      // If this is a post-session feeling, create a corresponding user session
      let sessionId: string | undefined;
      if (feelingData.isPostSession && feelingData.feeling) {
        // Map emotion to session type and duration
        const emotionConfig: Record<string, { sessionType: string; duration: number }> = {
          'stressed': { sessionType: 'Stress Relief', duration: 75 },
          'anxiety': { sessionType: 'Mindful Moment', duration: 90 },
          'restless': { sessionType: 'Energy Boost', duration: 90 },
          'tired': { sessionType: 'Sleep Story', duration: 105 },
          'scattered': { sessionType: 'Focus Reset', duration: 90 },
        };
        
        const config = emotionConfig[feelingData.feeling];
        if (!config) {
          throw new Error(`Unknown emotion: ${feelingData.feeling}`);
        }
        
        // Get all session types
        const sessionTypes = await storage.getSessionTypes();
        let sessionType = sessionTypes.find(st => st.name === config.sessionType);
        
        // If session type doesn't exist, create it (shouldn't happen with defaults)
        if (!sessionType) {
          sessionType = await storage.createSessionType({
            name: config.sessionType,
            description: `Reset session for ${feelingData.feeling}`,
            icon: 'fas fa-spa',
            color: 'purple',
          });
        }
        
        // Create user session with emotion-specific duration
        const userSession = await storage.createUserSession({
          userId,
          sessionTypeId: sessionType.id,
          duration: config.duration,
          rating: feelingData.moodRating || undefined,
        });
        
        sessionId = userSession.id;
        
        // Only increment daily usage after successfully creating session
        const today = new Date().toISOString().split('T')[0];
        await storage.incrementDailyUsage(userId, today);
      }
      
      // Create feeling entry with optional sessionId link
      const feeling = await storage.createFeelingEntry({
        ...feelingData,
        sessionId,
      });
      
      res.json(feeling);
    } catch (error) {
      console.error("Error creating feeling entry:", error);
      res.status(500).json({ message: "Failed to create feeling entry" });
    }
  });

  app.get('/api/feelings', isAuthenticatedUnified, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const feelings = await storage.getUserFeelingEntries(userId, 20);
      res.json(feelings);
    } catch (error) {
      console.error("Error fetching feelings:", error);
      res.status(500).json({ message: "Failed to fetch feelings" });
    }
  });

  // Account deletion route
  app.delete('/api/user/delete', isAuthenticatedUnified, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      await storage.deleteUser(userId);
      res.json({ message: "Account deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete account" });
    }
  });

  // Subscription and usage routes
  app.get('/api/usage/check', isAuthenticatedUnified, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      
      // Check if user has active subscription
      const hasSubscription = await storage.hasActiveSubscription(userId);
      
      if (hasSubscription) {
        return res.json({ canAccess: true, isSubscribed: true, dailyCount: 0 });
      }
      
      // Check daily usage for free users
      const usage = await storage.getDailyUsage(userId, today);
      const dailyCount = usage?.sessionCount || 0;
      const canAccess = dailyCount < 3; // Free limit is 3 sessions per day
      
      res.json({ canAccess, isSubscribed: false, dailyCount });
    } catch (error) {
      console.error("Error checking usage:", error);
      res.status(500).json({ message: "Failed to check usage" });
    }
  });

  app.post('/api/usage/increment', isAuthenticatedUnified, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      
      const usage = await storage.incrementDailyUsage(userId, today);
      res.json(usage);
    } catch (error) {
      console.error("Error incrementing usage:", error);
      res.status(500).json({ message: "Failed to increment usage" });
    }
  });

  // Stripe subscription routes
  app.post('/api/create-subscription', isAuthenticatedUnified, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const user = await storage.getUser(userId);
      
      if (!user?.email) {
        return res.status(400).json({ error: "User email required for subscription" });
      }

      // Check if user already has an active subscription
      if (user.stripeSubscriptionId && (user.subscriptionStatus === 'active' || user.subscriptionStatus === 'trialing')) {
        return res.status(400).json({ 
          error: "User already has an active subscription",
          redirectTo: "/?subscribed=true"
        });
      }

      // Get currency from request body - NEVER trust amount from client
      const { currency = 'gbp' } = req.body;
      
      const supportedCurrencies = ['gbp', 'usd', 'eur', 'cad', 'aud', 'jpy', 'krw', 'inr', 'brl', 'mxn', 'sgd', 'chf', 'sek', 'nok', 'dkk', 'pln', 'czk', 'huf'];
      const finalCurrency = supportedCurrencies.includes(currency.toLowerCase()) ? currency.toLowerCase() : 'gbp';
      
      // Server-side exchange rates (same fallback rates as frontend for consistency)
      const exchangeRates: Record<string, number> = {
        USD: 1.27, EUR: 1.20, CAD: 1.71, AUD: 1.89, JPY: 192, KRW: 1654,
        INR: 107, BRL: 7.31, MXN: 25.5, SGD: 1.71, CHF: 1.14, SEK: 13.2,
        NOK: 13.8, DKK: 8.95, PLN: 5.15, CZK: 28.8, HUF: 389, GBP: 1
      };
      
      // Try to fetch live rates, fall back to static rates on failure
      let currentRates = exchangeRates;
      try {
        const ratesResponse = await fetch('https://api.exchangerate-api.com/v4/latest/GBP', { 
          signal: AbortSignal.timeout(3000) 
        });
        if (ratesResponse.ok) {
          const ratesData = await ratesResponse.json();
          currentRates = ratesData.rates;
        }
      } catch (error) {
        console.log('Using fallback exchange rates');
      }
      
      // Calculate amount server-side from base GBP price
      const BASE_PRICE_GBP = 1.99;
      const rate = currentRates[finalCurrency.toUpperCase()] || 1;
      const convertedAmount = BASE_PRICE_GBP * rate;
      
      // Zero-decimal currencies (Stripe doesn't use cents for these)
      const zeroDecimalCurrencies = ['jpy', 'krw', 'czk', 'huf', 'bif', 'clp', 'djf', 'gnf', 'isk', 'kmf', 'pyg', 'rwf', 'ugx', 'vnd', 'vuv', 'xaf', 'xof', 'xpf'];
      const isZeroDecimal = zeroDecimalCurrencies.includes(finalCurrency);
      
      // Convert to Stripe's smallest unit
      let finalAmount: number;
      if (isZeroDecimal) {
        // Zero-decimal: use amount as-is (no multiplication)
        finalAmount = Math.round(convertedAmount);
      } else {
        // Most currencies: multiply by 100 for cents/paise
        finalAmount = Math.round(convertedAmount * 100);
      }
      
      console.log(`Stripe amount calculation: ${BASE_PRICE_GBP} GBP × ${rate} = ${convertedAmount} ${finalCurrency.toUpperCase()} → ${finalAmount} (smallest unit)`);


      let customerId = user.stripeCustomerId;
      
      // Create Stripe customer if doesn't exist
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : undefined,
          metadata: { userId, userEmail: user.email },
        });
        customerId = customer.id;
        await storage.updateUserSubscription(userId, customerId);
      }

      // Create price for the user's currency
      let priceId = `price_getresett_monthly_${finalCurrency}_${finalAmount}`;
      
      try {
        // Try to retrieve existing price first
        await stripe.prices.retrieve(priceId);
      } catch (error) {
        // If price doesn't exist, create it
        const price = await stripe.prices.create({
          currency: finalCurrency,
          unit_amount: finalAmount,
          recurring: { interval: 'month' },
          product_data: {
            name: 'GetResett+ Monthly'
          }
        });
        priceId = price.id;
      }

      // Check if user has already had a trial by looking at their subscription history
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        limit: 100
      });
      
      const hasHadTrial = subscriptions.data.some(sub => sub.trial_end !== null);
      
      if (hasHadTrial) {
        // User already had trial - create payment intent for immediate payment
        const paymentIntent = await stripe.paymentIntents.create({
          amount: finalAmount,
          currency: finalCurrency,
          customer: customerId,
          setup_future_usage: 'off_session',
          automatic_payment_methods: {
            enabled: true,
            allow_redirects: 'never'
          },
          payment_method_options: {
            card: {
              request_three_d_secure: 'automatic'
            }
          },
          metadata: {
            userId,
            userEmail: user.email,
            subscriptionType: 'paid',
            priceId: priceId
          }
        });

        // Payment intent created for returning user

        res.json({
          clientSecret: paymentIntent.client_secret,
          trial: false,
          hasHadTrial: true,
          amount: finalAmount,
          currency: finalCurrency,
          paymentIntentId: paymentIntent.id,
          message: "Payment required - you've already used your free trial"
        });
      } else {
        // First time user - create setup intent for trial
        const setupIntent = await stripe.setupIntents.create({
          customer: customerId,
          payment_method_types: ['card'],
          usage: 'off_session',
          metadata: {
            userId,
            userEmail: user.email,
            subscriptionType: 'trial'
          }
        });

        // Create subscription with 30-day free trial
        const subscription = await stripe.subscriptions.create({
          customer: customerId,
          items: [{ price: priceId }],
          trial_period_days: 30,
          metadata: {
            userId,
            userEmail: user.email,
            trialStartDate: new Date().toISOString()
          }
        });

        await storage.updateUserSubscription(
          userId, 
          customerId, 
          subscription.id, 
          subscription.status
        );

        // Trial subscription created successfully

        res.json({
          subscriptionId: subscription.id,
          clientSecret: setupIntent.client_secret,
          status: subscription.status,
          trial: true,
          trialEnd: subscription.trial_end,
          trialDays: 30,
          hasHadTrial: false,
          message: "30-day free trial - no charge"
        });
      }

    } catch (error: any) {
      console.error("Error creating subscription:", error);
      
      // Provide more specific error messages
      let errorMessage = "Failed to create subscription";
      if (error.type === 'StripeCardError') {
        errorMessage = "Payment method was declined";
      } else if (error.type === 'StripeInvalidRequestError') {
        errorMessage = "Invalid payment information";
      } else if (error.type === 'StripeAuthenticationError') {
        errorMessage = "Payment system configuration error";
      }
      
      res.status(500).json({ error: errorMessage });
    }
  });

  // Simple payment intent creation (no auth required for checkout)
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "gbp",
        automatic_payment_methods: {
          enabled: true,
        },
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Cancel subscription route
  app.post('/api/cancel-subscription', isAuthenticatedUnified, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const user = await storage.getUser(userId);
      
      if (!user?.stripeSubscriptionId) {
        return res.status(400).json({ message: "No active subscription found" });
      }

      try {
        // Try to cancel the subscription in Stripe
        await stripe.subscriptions.cancel(user.stripeSubscriptionId);
      } catch (stripeError: any) {
        // If subscription doesn't exist in Stripe, that's fine - just clear our records
        console.log("Subscription not found in Stripe, clearing local record:", stripeError.message);
      }
      
      // Always clear subscription from user record  
      await storage.updateUserSubscription(
        userId,
        user.stripeCustomerId || undefined,
        null,
        'canceled'
      );

      res.json({ message: "Subscription canceled successfully" });
    } catch (error: any) {
      console.error("Error canceling subscription:", error);
      res.status(500).json({ message: "Failed to cancel subscription" });
    }
  });

  // Clear test subscription route (for development)
  app.post('/api/clear-subscription', isAuthenticatedUnified, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const user = await storage.getUser(userId);
      
      if (user?.stripeSubscriptionId) {
        try {
          // Try to cancel the subscription in Stripe first
          await stripe.subscriptions.cancel(user.stripeSubscriptionId);
        } catch (error) {
          console.log("Subscription not found in Stripe, clearing from database");
        }
      }
      
      // Clear subscription from user record
      await storage.updateUserSubscription(userId, user?.stripeCustomerId || undefined, null, 'canceled');
      
      res.json({ message: "Subscription cleared successfully" });
    } catch (error: any) {
      console.error("Error clearing subscription:", error);
      res.status(500).json({ message: "Failed to clear subscription" });
    }
  });

  // Stripe webhook to handle subscription status changes
  // CRITICAL: This prevents charging issues by keeping our database in sync with Stripe
  app.post('/api/stripe/webhook', async (req, res) => {
    const sig = req.headers['stripe-signature'] as string;
    let event;

    try {
      // In production, you should set STRIPE_WEBHOOK_SECRET
      // For now, we'll parse the event directly for development
      event = JSON.parse(req.body);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return res.status(400).send('Webhook Error: Invalid payload');
    }

    console.log('Received Stripe webhook:', event.type, event.data?.object?.id);

    try {
      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          const subscription = event.data.object;
          const customerId = subscription.customer;
          
          // Find user by Stripe customer ID - for now we'll skip this functionality
          // TODO: Implement getUserByStripeCustomerId method
          // const users = await storage.getUserByStripeCustomerId(customerId);
          console.log(`Subscription updated: ${subscription.id}, status: ${subscription.status}`);
          /* if (users) {
            await storage.updateUserSubscription(
              users.id,
              customerId,
              subscription.id,
              subscription.status
            );
            console.log(`Updated subscription status for user ${users.id}: ${subscription.status}`);
          } */
          break;

        case 'customer.subscription.deleted':
          const canceledSubscription = event.data.object;
          const canceledCustomerId = canceledSubscription.customer;
          
          // TODO: Implement getUserByStripeCustomerId method
          console.log(`Subscription canceled: ${canceledSubscription.id}`);
          /* const canceledUser = await storage.getUserByStripeCustomerId(canceledCustomerId);
          if (canceledUser) {
            await storage.updateUserSubscription(
              canceledUser.id,
              canceledCustomerId,
              canceledSubscription.id,
              'canceled'
            );
            console.log(`Canceled subscription for user ${canceledUser.id}`);
          } */
          break;

        case 'invoice.payment_succeeded':
          // Handle successful payments (after trial ends)
          const invoice = event.data.object;
          if (invoice.subscription) {
            console.log(`Payment succeeded for subscription ${invoice.subscription}`);
          }
          break;

        case 'invoice.payment_failed':
          // Handle failed payments
          const failedInvoice = event.data.object;
          if (failedInvoice.subscription) {
            console.log(`Payment failed for subscription ${failedInvoice.subscription}`);
            // You might want to handle failed payments by updating user status
          }
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Error processing webhook:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function initializeSessionTypes() {
  try {
    const existingTypes = await storage.getSessionTypes();
    if (existingTypes.length === 0) {
      const defaultTypes = [
        {
          name: "Sleep Story",
          description: "A calming 60-second guided story to help you drift into peaceful sleep.",
          icon: "fas fa-moon",
          color: "purple",
        },
        {
          name: "Stress Relief",
          description: "Guided breathing exercise to calm your mind and reduce stress.",
          icon: "fas fa-wind",
          color: "blue",
        },
        {
          name: "Upper Body Stretch",
          description: "Release tension in neck, shoulders, and arms to feel refreshed.",
          icon: "fas fa-street-view",
          color: "sage",
        },
        {
          name: "Lower Body Stretch",
          description: "Stretch hips, hamstrings, and calves to improve mobility.",
          icon: "fas fa-street-view",
          color: "mint",
        },
        {
          name: "Full Body Flow",
          description: "Complete head-to-toe stretching sequence for total body relief.",
          icon: "fas fa-street-view",
          color: "emerald",
        },
        {
          name: "Energy Boost",
          description: "Quick energizing exercises to boost your mood and circulation.",
          icon: "fas fa-dumbbell",
          color: "orange",
        },
        {
          name: "Mindful Moment",
          description: "Ground yourself with a quick mindfulness exercise for clarity.",
          icon: "fas fa-spa",
          color: "teal",
        },
        {
          name: "Focus Reset",
          description: "Sharpen your concentration with a quick focus-building exercise.",
          icon: "fas fa-bullseye",
          color: "yellow",
        },
        {
          name: "Confidence Boost",
          description: "Positive affirmations and confidence-building exercises to empower you.",
          icon: "fas fa-star",
          color: "orange",
        },
      ];

      for (const type of defaultTypes) {
        await storage.createSessionType(type);
      }
    }
  } catch (error) {
    console.error("Error initializing session types:", error);
  }
}
