import type { Express, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { z } from "zod";
import { nanoid } from "nanoid";

// Registration schema
const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Login schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Corporate code schema
const corporateCodeSchema = z.object({
  code: z.string().min(1, "Corporate code is required"),
});

// Forgot password schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Reset password schema
const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Middleware to check if user is authenticated (supports both Replit Auth and email/password)
// This is used for routes that require authentication
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // Check for traditional session auth
  if ((req.session as any)?.userId) {
    return next();
  }
  
  // Check for Replit Auth
  if ((req as any).user?.claims?.sub) {
    return next();
  }
  
  return res.status(401).json({ message: "Unauthorized" });
}

// Alias for backward compatibility with existing routes
export const isAuthenticatedUnified = requireAuth;

// Get current user ID from either auth method
export function getUserId(req: Request): string | null {
  // Check traditional session auth first
  if ((req.session as any)?.userId) {
    return (req.session as any).userId;
  }
  
  // Check Replit Auth
  if ((req as any).user?.claims?.sub) {
    return (req as any).user.claims.sub;
  }
  
  return null;
}

export async function setupEmailAuth(app: Express) {
  // Register endpoint
  app.post('/auth/register', async (req: Request, res: Response) => {
    try {
      const { name, email, password } = registerSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      const userId = nanoid();
      const user = await storage.upsertUser({
        id: userId,
        email,
        firstName: name,
        passwordHash,
        hasCompletedOnboarding: false,
      });

      // Set session and save it
      (req.session as any).userId = user.id;
      
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ message: "Failed to save session" });
        }
        
        res.json({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          hasCompletedOnboarding: user.hasCompletedOnboarding,
          organisationId: user.organisationId,
        });
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Registration error:", error);
      res.status(500).json({ message: "Failed to register" });
    }
  });

  // Login endpoint
  app.post('/auth/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = loginSchema.parse(req.body);

      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user || !user.passwordHash) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Verify password
      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Set session and save it
      (req.session as any).userId = user.id;
      
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ message: "Failed to save session" });
        }
        
        res.json({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          hasCompletedOnboarding: user.hasCompletedOnboarding,
          organisationId: user.organisationId,
        });
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Login error:", error);
      res.status(500).json({ message: "Failed to login" });
    }
  });

  // Logout endpoint
  app.post('/auth/logout', (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Get current user endpoint
  app.get('/auth/me', requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        hasCompletedOnboarding: user.hasCompletedOnboarding,
        organisationId: user.organisationId,
        stripeCustomerId: user.stripeCustomerId,
        stripeSubscriptionId: user.stripeSubscriptionId,
        subscriptionStatus: user.subscriptionStatus,
      });
    } catch (error) {
      console.error("Error fetching current user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Corporate code validation endpoint
  app.post('/user/corporate-code', requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { code } = corporateCodeSchema.parse(req.body);

      // Validate code
      const organisation = await storage.getOrganisationByCode(code);
      if (!organisation) {
        return res.status(400).json({ message: "Invalid corporate code" });
      }

      // Update user with organisation
      const user = await storage.updateUser(userId, {
        organisationId: organisation.id,
      });

      res.json({
        success: true,
        organisation: {
          id: organisation.id,
          name: organisation.name,
        },
        user: {
          id: user?.id,
          organisationId: user?.organisationId,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Corporate code validation error:", error);
      res.status(500).json({ message: "Failed to validate corporate code" });
    }
  });

  // Complete onboarding endpoint
  app.post('/user/complete-onboarding', requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await storage.updateUser(userId, {
        hasCompletedOnboarding: true,
      });

      res.json({
        success: true,
        user: {
          id: user?.id,
          hasCompletedOnboarding: user?.hasCompletedOnboarding,
        },
      });
    } catch (error) {
      console.error("Error completing onboarding:", error);
      res.status(500).json({ message: "Failed to complete onboarding" });
    }
  });

  // Forgot password endpoint - generates reset token
  app.post('/auth/forgot-password', async (req: Request, res: Response) => {
    try {
      const { email } = forgotPasswordSchema.parse(req.body);

      // Find user by email
      const user = await storage.getUserByEmail(email);
      
      // Always return success to prevent email enumeration
      if (!user || !user.passwordHash) {
        return res.json({ 
          message: "If an account exists with that email, a password reset link has been generated.",
          success: true 
        });
      }

      // Generate reset token (valid for 1 hour)
      const resetToken = nanoid(32);
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

      // Update user with reset token
      await storage.updateUser(user.id, {
        resetToken,
        resetTokenExpiry,
      });

      // In a real app, you'd send an email here
      // For now, we'll return the token in the response for testing
      console.log(`Password reset token for ${email}: ${resetToken}`);
      
      res.json({ 
        message: "If an account exists with that email, a password reset link has been generated.",
        success: true,
        // Only include token in development
        ...(process.env.NODE_ENV === 'development' && { resetToken, resetUrl: `/reset-password?token=${resetToken}` })
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Failed to process request" });
    }
  });

  // Reset password endpoint - uses token to set new password
  app.post('/auth/reset-password', async (req: Request, res: Response) => {
    try {
      const { token, password } = resetPasswordSchema.parse(req.body);

      // Find user by reset token
      const user = await storage.getUserByResetToken(token);
      
      if (!user || !user.resetToken || !user.resetTokenExpiry) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }

      // Check if token is expired
      if (new Date() > user.resetTokenExpiry) {
        return res.status(400).json({ message: "Reset token has expired" });
      }

      // Hash new password
      const passwordHash = await bcrypt.hash(password, 10);

      // Update user password and clear reset token
      await storage.updateUser(user.id, {
        passwordHash,
        resetToken: null,
        resetTokenExpiry: null,
      });

      res.json({ 
        message: "Password reset successfully. You can now log in with your new password.",
        success: true 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Failed to reset password" });
    }
  });
}
