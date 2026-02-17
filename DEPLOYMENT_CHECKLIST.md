# Quick Deployment Checklist

## Before You Deploy

- [ ] Push code to GitHub
- [ ] MongoDB Atlas is accessible from anywhere (Whitelist: 0.0.0.0/0)

## Backend (Render)

1. Create Web Service on Render
2. Connect GitHub repo
3. Set Root Directory: `server`
4. Set Build Command: `npm install`
5. Set Start Command: `node index.js`
6. Add Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://admin:admin@cluster0.pj04tl3.mongodb.net/ctf-db?retryWrites=true&w=majority&appName=Cluster0
   PORT=5000
   FRONTEND_URL=https://your-app.vercel.app
   ```
7. Copy backend URL after deployment

## Frontend (Vercel)

1. Import GitHub repo on Vercel
2. Framework: Vite
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```
6. Deploy

## After Deployment

- [ ] Update Render's `FRONTEND_URL` with your Vercel URL
- [ ] Test login and registration
- [ ] Test flag submission
- [ ] Test admin dashboard

## URLs Format

- Backend: `https://[your-service-name].onrender.com`
- Frontend: `https://[your-project-name].vercel.app`

## Common Issues

1. **CORS Error**: Make sure `FRONTEND_URL` in Render matches Vercel URL
2. **API Not Found**: Verify `VITE_API_URL` in Vercel is correct
3. **Database Connection**: Check MongoDB Atlas network access

## Testing

Local:
```bash
# Backend
cd server
node index.js

# Frontend (new terminal)
npm run dev
```

Production:
- Visit your Vercel URL
- Try registering a new user
- Submit a flag
- Check admin dashboard
