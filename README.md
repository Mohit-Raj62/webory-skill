# webory-skill

This website is for skills development and learning.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment Guide (Deploy Kaise Kare)

### Step 1: Required Services Setup (Pehle yeh setup karein)

#### 1. MongoDB Database (Free)
- [MongoDB Atlas](https://www.mongodb.com/atlas) par account banao
- Free cluster create karein
- Database Access mein user add karein
- Network Access mein IP allow karein (0.0.0.0/0 for all IPs)
- Connection string copy karein: `mongodb+srv://username:password@cluster.mongodb.net/skill-webory`

#### 2. Cloudinary (Free - Image/Video Upload)
- [Cloudinary](https://cloudinary.com/) par sign up karein
- Dashboard se credentials copy karein:
  - Cloud Name
  - API Key
  - API Secret

#### 3. Gmail App Password (Email ke liye)
- Gmail account par 2-Step Verification enable karein
- [App Passwords](https://myaccount.google.com/apppasswords) se new password generate karein
- Email ke liye is password ka use karein

### Step 2: Vercel Par Deploy (Easiest Method)

#### Option A: GitHub Se Direct Deploy (Recommended)

1. **GitHub Repository Push Karo** (Already done ✅)
   ```bash
   git push origin main
   ```

2. **Vercel Par Account Banao**
   - [Vercel](https://vercel.com) par sign up karein (GitHub se login karein)

3. **New Project Import Karein**
   - Dashboard se "Add New Project" click karein
   - GitHub repository se `webory-skill` select karein
   - Import karein

4. **Environment Variables Add Karein**
   Vercel dashboard mein "Environment Variables" section mein yeh add karein:

   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skill-webory
   JWT_SECRET=your-random-secret-key-minimum-32-characters
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ADMIN_EMAIL=admin@skillwebory.com
   NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
   ```

   > **Note:** `JWT_SECRET` ke liye ek strong random string generate karein:
   > ```bash
   > node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   > ```

5. **Deploy Click Karein**
   - "Deploy" button click karein
   - Build automatically start hogi
   - 2-3 minutes baad app live ho jayega! 🎉

#### Option B: Vercel CLI Se Deploy

```bash
# Vercel CLI install karein
npm i -g vercel

# Login karein
vercel login

# Project directory mein
cd skill-webory

# Deploy karein
vercel

# Production deploy
vercel --prod
```

### Step 3: Environment Variables Setup

Deployment ke baad Vercel dashboard mein environment variables add karein:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `JWT_SECRET` | JWT token encryption key | Random 32+ character string |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `mycloud` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `secret_key_here` |
| `EMAIL_USER` | Gmail address | `youremail@gmail.com` |
| `EMAIL_PASS` | Gmail app password | `app_password_here` |
| `ADMIN_EMAIL` | Admin contact email | `admin@skillwebory.com` |
| `NEXT_PUBLIC_APP_URL` | Production URL | `https://skill-webory.vercel.app` |

### Step 4: Build Test (Optional - Locally)

Deploy se pehle build test kar sakte ho:

```bash
npm run build
npm run start
```

### Troubleshooting (Agar Problem Aaye)

1. **Build Failed:**
   - Check environment variables sahi add kiye gaye hain
   - Check MongoDB connection string correct hai
   - Check Node.js version compatible hai (18+)

2. **Database Connection Error:**
   - MongoDB Atlas mein IP whitelist check karein
   - Connection string verify karein
   - Network Access mein 0.0.0.0/0 add karein

3. **Email Not Working:**
   - Gmail App Password correctly set hai
   - 2-Step Verification enabled hai
   - Email_USER aur EMAIL_PASS sahi hain

4. **Image Upload Failed:**
   - Cloudinary credentials verify karein
   - CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET sahi hain

### Other Deployment Options

#### Railway
- [Railway](https://railway.app) - MongoDB aur app dono deploy kar sakte ho
- GitHub se connect karke auto-deploy

#### Render
- [Render](https://render.com) - Free tier available
- MongoDB Atlas se connect karein

#### Netlify
- [Netlify](https://netlify.com) - Good for static sites
- Next.js functions support karta hai

### Post-Deployment Checklist

- ✅ MongoDB connection working hai
- ✅ User signup/login working hai
- ✅ Email sending working hai
- ✅ Image/video upload working hai
- ✅ All API routes working hain
- ✅ Environment variables sahi set hain

### Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/getting-started/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Next.js Deployment](https://nextjs.org/docs/deployment)