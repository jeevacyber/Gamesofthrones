# 🚀 Global Hosting Guide: Netlify (Frontend) & Render (Backend)

Follow these steps to host your CTF application globally.

---

## 🏗️ Part 1: Backend Deployment (Render)

Render will host your Node.js/Express server and connect to MongoDB.

1. **GitHub**: Push your code to a GitHub repository.
2. **Create Web Service**:
   - Go to [Render Dashboard](https://dashboard.render.com/).
   - Click **New +** > **Web Service**.
   - Connect your GitHub repo.
3. **Configure Settings**:
   - **Name**: `ctf-backend`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
4. **Environment Variables**:
   - Click **Advanced** > **Add Environment Variable**.
   - `MONGODB_URI`: (Your MongoDB Connection String)
   - `PORT`: `5000`
   - `FRONTEND_URL`: `https://your-app-name.netlify.app` (You will get this from Netlify later)
5. **Copy URL**: Once deployed, copy your backend URL (e.g., `https://ctf-backend-xyz.onrender.com`).

---

## 🌐 Part 2: Frontend Deployment (Netlify)

Netlify will host your React/Vite frontend.

1. **Connect to GitHub**:
   - Go to [Netlify Dashboard](https://app.netlify.com/).
   - Click **Add new site** > **Import an existing project**.
   - Connect your GitHub repo.
2. **Build Settings**:
   - **Base directory**: (Leave empty, use root)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. **Environment Variables**:
   - Go to **Site configuration** > **Environment variables**.
   - Add: `VITE_API_URL` = `https://your-backend-name.onrender.com` (Use the URL from Step 1)
4. **Deploy**: Click **Deploy site**.
5. **Netlify URL**: Copy your new site URL (e.g., `https://dragon-ctf.netlify.app`).

---

## 🔗 Part 3: Final Connection (CORS Fix)

To allow the frontend to talk to the backend, you must update the `FRONTEND_URL` on Render.

1. Go back to your **Render Dashboard**.
2. Select your `ctf-backend` service.
3. Go to **Environment**.
4. Update `FRONTEND_URL` with your actual Netlify URL (e.g., `https://dragon-ctf.netlify.app`).
5. Save changes. Render will automatically redeploy.

---

## ✅ Post-Deployment Checklist

- [ ] Ensure **MongoDB Atlas** database access is set to `0.0.0.0/0` (Allow access from anywhere).
- [ ] Check that `VITE_API_URL` on Netlify does **NOT** have a trailing slash (e.g., use `...com`, not `...com/`).
- [ ] Verify that `netlify.toml` is in your project root to prevent "404 on refresh" errors.

---

### 🎉 Your CTF is now live!
- **Admin Login**: `admin@ctf.com` / `admin`
- **Frontend**: Distributed via Netlify's global CDN.
- **Backend**: Scaled on Render's managed infrastructure.
