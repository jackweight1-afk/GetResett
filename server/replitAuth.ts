import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    name: 'connect.sid',
    store: sessionStore,
    resave: true,
    saveUninitialized: true,
    proxy: true,
    cookie: {
      httpOnly: false,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: sessionTtl,
      domain: undefined,
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(
  claims: any,
) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", true);
  const sessionMiddleware = getSession();
  app.use((req, res, next) => {
    sessionMiddleware(req, res, (err) => {
      if (err) console.error("Session error:", err);
      console.log("Session initialized, ID:", req.sessionID);
      next(err);
    });
  });
  app.use(passport.initialize());
  app.use(passport.session());

  const config = await getOidcConfig();

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    try {
      console.log("Authentication verify function called");
      const user = {};
      updateUserSession(user, tokens);
      const claims = tokens.claims();
      console.log("User claims received:", { sub: claims?.sub, email: claims?.email });
      await upsertUser(claims);
      console.log("User upserted successfully");
      verified(null, user);
    } catch (error) {
      console.error("Error in verify function:", error);
      verified(error as Error, false);
    }
  };

  for (const domain of process.env
    .REPLIT_DOMAINS!.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`,
      },
      verify,
    );
    passport.use(strategy);
  }
  
  // Also create a localhost strategy for development
  const localhostStrategy = new Strategy(
    {
      name: `replitauth:localhost`,
      config,
      scope: "openid email profile offline_access",
      callbackURL: `https://${process.env.REPLIT_DOMAINS!.split(",")[0]}/api/callback`,
    },
    verify,
  );
  passport.use(localhostStrategy);

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", (req, res, next) => {
    // Handle development environment with better fallback
    let hostname = req.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      // Use the first domain from REPLIT_DOMAINS for local development
      const domains = process.env.REPLIT_DOMAINS!.split(",");
      hostname = domains[0];
    }
    
    const strategyName = `replitauth:${hostname}`;
    
    // Check if strategy exists before using it
    if (!(passport as any)._strategies[strategyName]) {
      console.error(`Authentication strategy ${strategyName} not found. Available strategies:`, Object.keys((passport as any)._strategies || {}));
      return res.status(500).json({ 
        message: "Authentication not configured properly",
        error: `Strategy ${strategyName} not found`
      });
    }
    
    console.log("🔵 LOGIN - Session ID before auth:", req.sessionID);
    req.session.save((err) => {
      if (err) console.error("Session save error:", err);
      console.log("🔵 LOGIN - Session saved");
      
      passport.authenticate(strategyName, {
        prompt: "login consent",
        scope: ["openid", "email", "profile", "offline_access"],
      })(req, res, next);
    });
  });

  app.get("/api/callback", (req, res, next) => {
    console.log("🔵 CALLBACK - Query:", JSON.stringify(req.query));
    console.log("🔵 CALLBACK - Session ID:", req.sessionID);
    console.log("🔵 CALLBACK - Cookies:", req.headers.cookie);
    
    let hostname = req.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      const domains = process.env.REPLIT_DOMAINS!.split(",");
      hostname = domains[0];
    }
    
    const strategyName = `replitauth:${hostname}`;
    console.log("🔵 CALLBACK - Using strategy:", strategyName);
    
    if (!(passport as any)._strategies[strategyName]) {
      console.error("❌ Strategy not found:", strategyName);
      return res.redirect("/?error=auth_failed");
    }
    
    passport.authenticate(strategyName, (err: any, user: any, info: any) => {
      console.log("🔵 AUTH RESULT:");
      console.log("  - Error:", err);
      console.log("  - User:", user ? "YES" : "NO");  
      console.log("  - Info:", JSON.stringify(info));
      
      if (err) {
        console.error("❌ Authentication error:", err);
        return res.redirect("/?error=auth_failed");
      }
      
      if (!user) {
        console.error("❌ No user returned");
        return res.redirect("/?error=auth_failed");
      }
      
      req.logIn(user, (loginErr) => {
        if (loginErr) {
          console.error("❌ Login error:", loginErr);
          return res.redirect("/?error=auth_failed");
        }
        console.log("✅ LOGIN SUCCESS!");
        return res.redirect("/");
      });
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
