# Deployment Guide - CTF Application

This guide explains how to deploy your CTF application to **Vercel** (Frontend) and **Render** (Backend).

---

## 📋 Prerequisites

1. **GitHub Account** - Push your code to a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Render Account** - Sign up at [render.com](https://render.com)
4. **MongoDB Atlas** - Your database is already set up

---

## 🚀 Part 1: Deploy Backend to Render

### Step 1: Prepare Backend

1. Create a `server/.env` file (copy from `.env.example`):
   ```env
   MONGODB_URI=mongodb+srv://admin:admin@cluster0.pj04tl3.mongodb.net/ctf-db?retryWrites=true&w=majority&appName=Cluster0
   PORT=5000
   FRONTEND_URL=https://your-app-name.vercel.app
   ```

2. Add `server/.env` to `.gitignore`

### Step 2: Push to GitHub

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 3: Deploy on Render

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `ctf-backend` (or your choice)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Instance Type**: `Free`

5. Add Environment Variables:
   - Click **"Advanced"** → **"Add Environment Variable"**
   - Add:
     ```
     MONGODB_URI=mongodb+srv://admin:admin@cluster0.pj04tl3.mongodb.net/ctf-db?retryWrites=true&w=majority&appName=Cluster0
     PORT=5000
     FRONTEND_URL=https://your-app-name.vercel.app
     ```
   
6. Click **"Create Web Service"**
7. Wait for deployment (5-10 minutes)
8. **Copy your backend URL**: `https://ctf-backend-xxxx.onrender.com`

---

## 🎨 Part 2: Deploy Frontend to Vercel

### Step 1: Update Frontend Configuration

1. Create `.env` file in root:
   ```env
   VITE_API_URL=https://your-backend-url.onrender.com
   ```
   Replace `your-backend-url` with the URL from Render

2. Add `.env` to `.gitignore`

### Step 2: Commit Changes

```bash
git add .
git commit -m "Add production API URL"
git push origin main
```

### Step 3: Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. Add Environment Variable:
   - Click **"Environment Variables"**
   - Add:
     ```
     VITE_API_URL = https://your-backend-url.onrender.com
     ```

5. Click **"Deploy"**
6. Wait for deployment (2-5 minutes)
7. **Your app is live!** 🎉

---

## 🔄 Part 3: Update Backend URL

After Vercel deployment, you need to update the backend's FRONTEND_URL:

1. Go to your Render dashboard
2. Select your backend service
3. Go to **"Environment"**
4. Update `FRONTEND_URL` to your Vercel URL:
   ```
   FRONTEND_URL=https://your-app-name.vercel.app
   ```
5. Save changes (Render will auto-redeploy)

---

## ✅ Verification

1. Visit your Vercel URL: `https://your-app-name.vercel.app`
2. Test registration and login
3. Check if flags submit correctly
4. Verify admin dashboard works

---

## 🐛 Troubleshooting

### CORS Errors
- Make sure `FRONTEND_URL` in Render matches your Vercel URL exactly
- Check browser console for specific error messages

### API Connection Issues
- Verify `VITE_API_URL` in Vercel points to your Render backend URL
- Check Render logs: Dashboard → Your Service → Logs

### Database Connection Issues
- Verify `MONGODB_URI` is correct in Render environment variables
- Check MongoDB Atlas network access allows connections from anywhere (0.0.0.0/0)

### Build Failures
- Check build logs in Vercel/Render dashboard
- Ensure all dependencies are in `package.json`

---

## 🔄 Future Updates

To update your deployed application:

1. Make changes locally
2. Test thoroughly:
   ```bash
   npm run dev        # Frontend
   cd server && node index.js  # Backend
   ```
3. Commit and push:
   ```bash
   git add .
   git commit -m "Your update description"
   git push origin main
   ```
4. Vercel and Render will auto-deploy! 🚀

---

## 📝 Important URLs to Save

- **Frontend (Vercel)**: `https://your-app-name.vercel.app`
- **Backend (Render)**: `https://your-backend-name.onrender.com`
- **Admin Login**: Email: `admin@ctf.com`, Password: `admin`

---

## 💡 Tips

- **Free Tier Limitations**: Render free tier spins down after inactivity. First request after idle may be slow (30-60s)
- **Custom Domain**: Both Vercel and Render support custom domains in settings
- **Environment Variables**: Never commit `.env` files to Git
- **Monitoring**: Check Render logs if backend issues occur

---

## 🔒 Security Recommendations

Before going live in production:

1. **Change Admin Password**: The hardcoded admin credentials should be updated
2. **MongoDB Credentials**: Use a stronger password (not "admin")
3. **Environment Variables**: Never expose sensitive keys in frontend code
4. **Rate Limiting**: Consider adding rate limiting to prevent abuse
5. **HTTPS Only**: Both platforms provide HTTPS by default - ensure it's enforced

---

## 📞 Support

If you encounter issues:
- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Render Docs: [render.com/docs](https://render.com/docs)
- MongoDB Atlas Docs: [mongodb.com/docs/atlas](https://mongodb.com/docs/atlas)

---

**Happy Deploying! 🚀**
