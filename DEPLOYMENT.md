# Deployment Guide - Skill Webory

## Environment Variables List

Ye sab variables `.env.local` file mein ya deployment platform (Vercel) mein add karni hain:

```env
# MongoDB Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skill-webory

# JWT Secret Key (minimum 32 characters)
JWT_SECRET=your-super-secret-jwt-key-here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password

# Admin Email (optional)
ADMIN_EMAIL=admin@skillwebory.com

# App URL (production URL)
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

## Quick Deploy Steps (Vercel)

1. **Vercel.com** par jao aur GitHub se login karo
2. **"Add New Project"** click karo
3. **webory-skill** repository select karo
4. **Environment Variables** section mein sab variables add karo (upar wali list se)
5. **Deploy** button click karo

## Detailed Setup Instructions

### 1. MongoDB Atlas Setup (Free)

1. [MongoDB Atlas](https://www.mongodb.com/atlas) par sign up karo
2. Free M0 cluster create karo
3. Database User create karo (username aur password)
4. Network Access mein IP add karo: `0.0.0.0/0` (sab IPs allow)
5. Cluster se "Connect" button click karo
6. "Connect your application" select karo
7. Connection string copy karo aur `MONGODB_URI` mein paste karo

### 2. Cloudinary Setup (Free)

1. [Cloudinary](https://cloudinary.com/) par sign up karo
2. Dashboard se credentials copy karo:
   - Cloud Name
   - API Key  
   - API Secret
3. Inhe environment variables mein add karo

### 3. Gmail Setup (Email ke liye)

1. Gmail account mein 2-Step Verification enable karo
2. [Google App Passwords](https://myaccount.google.com/apppasswords) par jao
3. "Select app" = Mail, "Select device" = Other
4. App password generate karo aur copy karo
5. `EMAIL_PASS` mein ye password add karo
6. `EMAIL_USER` mein apna Gmail address add karo

### 4. JWT Secret Generate

Terminal mein ye command run karo:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Output ko `JWT_SECRET` mein add karo.

## Vercel Deployment

### Method 1: GitHub Integration (Recommended)

1. Repository already GitHub par hai ✅
2. [Vercel Dashboard](https://vercel.com/dashboard) par jao
3. "Add New..." → "Project" click karo
4. GitHub repository list se `webory-skill` select karo
5. Environment variables add karo (sab upar wali)
6. "Deploy" click karo

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd skill-webory
vercel

# Production deploy
vercel --prod
```

## Local Build Test

Deploy se pehle locally build test karo:

```bash
npm install
npm run build
npm run start
```

Agar build successful hai to deployment bhi theek se hoga.

## Troubleshooting

### Build Failed
- Environment variables check karo
- MongoDB URI correct hai?
- Node.js version 18+ hai?

### Database Connection Error
- MongoDB Atlas mein IP whitelist check karo
- Connection string verify karo
- Network Access mein `0.0.0.0/0` add karo

### Email Not Working
- Gmail App Password sahi hai?
- 2-Step Verification enabled hai?
- EMAIL_USER aur EMAIL_PASS correct hain?

### Image Upload Failed
- Cloudinary credentials verify karo
- All three Cloudinary variables set hain?

## Post-Deployment

Deploy hone ke baad ye check karo:

- [ ] Homepage load ho raha hai
- [ ] Sign up / Login working hai
- [ ] Database connection successful
- [ ] Email sending working
- [ ] File upload (images/videos) working
- [ ] All pages accessible hain

## Support

Agar koi problem aaye to:
- Check Vercel build logs
- Check environment variables
- Verify all service credentials

