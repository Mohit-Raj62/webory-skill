# Deployment Guide (Vercel)

Your project is already connected to GitHub: `https://github.com/Mohit-Raj62/webory-skill`

To deploy this application to Vercel (recommended for Next.js), follow these steps:

## 1. Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up or Log in using **GitHub**.

## 2. Import Project
1. On your Vercel dashboard, click **"Add New..."** -> **"Project"**.
2. You should see your `webory-skill` repository in the list.
3. Click **"Import"**.

## 3. Configure Environment Variables
**CRITICAL STEP**: You must add your environment variables for the app to work.
In the "Configure Project" screen, expand the **"Environment Variables"** section.

Add the following variables (copy values from your local `.env.local` file):

| Variable Name | Description |
|--------------|-------------|
| `MONGODB_URI` | Your MongoDB connection string (make sure to allow access from anywhere/0.0.0.0 in MongoDB Atlas) |
| `JWT_SECRET` | Secret key for JWT tokens |
| `NEXTAUTH_SECRET` | Secret for NextAuth (can be same as JWT_SECRET) |
| `NEXTAUTH_URL` | Set this to your Vercel URL (e.g., `https://your-project.vercel.app`) once deployed, or leave empty for Vercel to auto-detect |
| `EMAIL_USER` | Email address for sending notifications |
| `EMAIL_PASS` | App password for the email account |
| `ADMIN_EMAIL` | Email to receive contact form/application notifications |
| `NEXT_PUBLIC_APP_URL` | Your Vercel URL (e.g., `https://your-project.vercel.app`) |

**OAuth Variables (if using):**
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_ID`
- `GITHUB_SECRET`

## 4. Deploy
1. Click **"Deploy"**.
2. Wait for the build to complete.
3. Once finished, you will get a live URL (e.g., `https://webory-skill.vercel.app`).

## 5. Post-Deployment Setup
1. **MongoDB Atlas**: Go to your MongoDB Atlas dashboard -> Network Access -> Add IP Address -> Allow Access from Anywhere (`0.0.0.0/0`) so Vercel can connect.
2. **OAuth Providers**: If using Google/GitHub login, update the "Authorized Redirect URIs" in their developer consoles to include your new Vercel domain (e.g., `https://webory-skill.vercel.app/api/auth/callback/google`).

## Troubleshooting
- **Build Failed?** Check the "Logs" tab in Vercel to see the error.
- **Database Error?** Ensure `MONGODB_URI` is correct and Network Access is open.
- **Login Not Working?** Check `NEXTAUTH_SECRET` and OAuth settings.
