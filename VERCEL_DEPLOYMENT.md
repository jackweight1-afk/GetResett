# Vercel Deployment Guide for GetReset

This guide explains how to deploy the GetReset application to Vercel.

## Prerequisites

1. A Vercel account (https://vercel.com)
2. Your codebase pushed to GitHub
3. Access to your Neon PostgreSQL database credentials

## Required Environment Variables

Set these in Vercel Dashboard → Project Settings → Environment Variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Neon PostgreSQL connection string | Yes |
| `SESSION_SECRET` | Random string for session encryption (min 32 chars) | Yes |
| `NODE_ENV` | Set to `production` | Recommended |

### Getting Your Database URL

Your Neon database connection string looks like:
```
postgresql://user:password@host.neon.tech/database?sslmode=require
```

### Generating a Session Secret

Generate a secure random string:
```bash
openssl rand -base64 32
```

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset:** Vite
   - **Root Directory:** (leave as root)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist/public`
5. Add the environment variables listed above
6. Click **"Deploy"**

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel
```

## Important Notes

### Session Storage
The Vercel deployment uses PostgreSQL for session storage (via `connect-pg-simple`) instead of memory store. A `session` table will be automatically created in your database on first deployment.

### Serverless Limitations
- Vercel functions have a 10-second timeout on the Hobby plan (60s on Pro)
- Functions are stateless - sessions persist in the database
- Cold starts may add ~200-500ms to first requests

### Database Connection
The Neon serverless driver is already configured for optimal performance with Vercel's serverless environment.

## Connecting a Custom Domain

1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Domains**
3. Add your custom domain
4. Update your DNS records as instructed by Vercel
5. Wait for SSL certificate provisioning (automatic)

## Troubleshooting

### API Routes Return 404
- Ensure all API routes are prefixed with `/api/`
- Check that `vercel.json` rewrites are configured correctly

### Session Not Persisting
- Verify `DATABASE_URL` is set correctly
- Check that the `session` table exists in your database
- Ensure `SESSION_SECRET` is set

### Build Failures
- Run `npm run build` locally to check for errors
- Verify all dependencies are in `dependencies` (not `devDependencies`)

## Files Used for Vercel Deployment

- `vercel.json` - Deployment configuration
- `api/index.ts` - Serverless function entry point for Express

## Support

For Vercel-specific issues, consult the [Vercel Documentation](https://vercel.com/docs).
