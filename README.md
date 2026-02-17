# 🎯 CTF Application - Complete Guide

A full-stack Capture The Flag (CTF) competition platform with Dragon & Game of Thrones themes.

---

## 📋 Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Local Development](#local-development)
4. [Deployment](#deployment)
5. [Project Structure](#project-structure)
6. [Environment Variables](#environment-variables)
7. [Admin Access](#admin-access)

---

## ✨ Features

### For Participants
- 🔐 User registration and authentication
- 🎮 Two themed rounds (Fire & Ice)
- 🏆 Real-time scoring and leaderboard
- 📊 Personal solve history and statistics
- 🎯 10 challenges per round (20 total)
- 📥 Downloadable challenge files

### For Admins
- 👥 View all registered teams
- 🔒 Lock/unlock rounds dynamically
- 🔄 Reset individual team progress
- 📈 Live submission tracking
- 🚫 Team disqualification capability
- 📊 Complete overview dashboard

---

## 🛠 Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- React Router (routing)
- Framer Motion (animations)
- Tailwind CSS (styling)

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- bcryptjs (password hashing)
- CORS enabled

**Database:**
- MongoDB Atlas (Cloud)

---

## 💻 Local Development

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd dragon-dragon-ctf-main
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Environment setup**
   
   The `.env` files are already created with default values:
   - Frontend: `.env` (root directory)
   - Backend: `server/.env`

5. **Start the backend**
   ```bash
   cd server
   node index.js
   ```
   Server runs on: `http://localhost:5000`

6. **Start the frontend** (new terminal)
   ```bash
   npm run dev
   ```
   Frontend runs on: `http://localhost:5173`

7. **Access the application**
   - Open browser: `http://localhost:5173`
   - Admin login: `admin@ctf.com` / `admin`

---

## 🚀 Deployment

Your application is ready for production deployment!

### Quick Deploy

1. **Backend → Render**
   - See `DEPLOYMENT.md` Part 1
   - Platform: [render.com](https://render.com)

2. **Frontend → Vercel**
   - See `DEPLOYMENT.md` Part 2
   - Platform: [vercel.com](https://vercel.com)

### Deployment Files

- 📄 `DEPLOYMENT.md` - Complete step-by-step guide
- ✅ `DEPLOYMENT_CHECKLIST.md` - Quick reference checklist
- 📝 `DEPLOYMENT_SUMMARY.md` - Overview of changes

**Important:** After deployment, update environment variables:
- Vercel: Add `VITE_API_URL` with your Render backend URL
- Render: Add `FRONTEND_URL` with your Vercel frontend URL

---

## 📁 Project Structure

```
dragon-dragon-ctf-main/
├── src/                          # Frontend source
│   ├── components/               # Reusable components
│   │   ├── ChallengeCard.tsx    # Challenge display card
│   │   ├── Navbar.tsx           # Navigation bar
│   │   └── ProtectedRoute.tsx   # Route authentication
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.tsx          # Authentication logic
│   │   └── useGame.tsx          # Game state management
│   ├── pages/                    # Route pages
│   │   ├── Home.tsx             # Landing page
│   │   ├── Login.tsx            # Login page
│   │   ├── Register.tsx         # Registration page
│   │   ├── Rounds.tsx           # Round selection
│   │   ├── Round1.tsx           # Fire-themed round
│   │   ├── Round2.tsx           # Ice-themed round
│   │   └── AdminDashboard.tsx   # Admin panel
│   ├── config/                   # Configuration
│   │   └── api.ts               # API URL config
│   └── utils/                    # Utilities
│       └── crypto.ts            # SHA-256 hashing
├── server/                       # Backend source
│   ├── models/                   # Mongoose models
│   │   └── User.js              # User schema
│   ├── index.js                 # Express server
│   ├── db.js                    # MongoDB connection
│   └── .env                     # Backend environment
├── public/                       # Static assets
│   ├── challenges/              # Challenge files (zips)
│   └── dragon.jpg               # Background image
├── .env                         # Frontend environment
├── vercel.json                  # Vercel config
└── package.json                 # Dependencies
```

---

## 🔐 Environment Variables

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:5000
```

For production (Vercel):
```env
VITE_API_URL=https://your-backend.onrender.com
```

### Backend (`server/.env`)
```env
MONGODB_URI=mongodb+srv://admin:admin@cluster0.pj04tl3.mongodb.net/ctf-db?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
FRONTEND_URL=http://localhost:5173
```

For production (Render):
```env
MONGODB_URI=<your-mongodb-uri>
PORT=5000
FRONTEND_URL=https://your-app.vercel.app
```

---

## 👨‍💼 Admin Access

**Default Admin Credentials:**
- Email: `admin@ctf.com`
- Password: `admin`

**Admin Capabilities:**
- View all teams and scores
- Lock/unlock Round 1 and Round 2
- Reset team progress for specific rounds
- View all submissions in real-time
- Download team data

**Security Note:** Change the admin password before deploying to production!

---

## 🎮 How to Play

### For Participants

1. **Register**: Create an account with team details
2. **Login**: Access your dashboard
3. **Select Round**: Choose Round 1 (Fire) or Round 2 (Ice)
4. **Download Challenges**: Get challenge files from each card
5. **Find Flags**: Solve challenges to find flags (format: `CTF{...}`)
6. **Submit Flags**: Enter flags in the input boxes
7. **Complete Round**: Submit the entire round when done
8. **Repeat**: Move to the next round

### Flag Examples

- Round 1, Challenge 1: `CTF{welcome_gate_open}`
- Round 2, Challenge 1: `CTF{path_traversed}`

---

## 🔧 Customization

### Adding Challenges

Edit `src/pages/Round1.tsx` or `Round2.tsx`:

```typescript
const challenges = [
  {
    title: "Challenge Name",
    description: "Challenge description",
    points: 100,
    difficulty: "Easy" as const,
    hash: "sha256_hash_of_flag",
    downloadLink: "/challenges/file.zip"
  },
  // ...more challenges
];
```

### Changing Themes

Colors are defined in `src/index.css`:
- Fire theme: `--fire-orange`, `--fire-gold`
- Ice theme: `--ice-blue`, `--ice-frost`

---

## 🐛 Troubleshooting

### Local Development Issues

**Backend won't start:**
- Check `server/.env` exists and has correct MongoDB URI
- Verify MongoDB Atlas network access allows your IP
- Check port 5000 isn't already in use

**Frontend won't connect to backend:**
- Verify `.env` has `VITE_API_URL=http://localhost:5000`
- Restart frontend after changing `.env`
- Check browser console for errors

**Flag submission not working:**
- Check browser console for hash comparison logs
- Verify challenge hash matches the flag's SHA-256 hash
- Ensure user is logged in (not admin for DB saves)

### Deployment Issues

**CORS errors:**
- Verify `FRONTEND_URL` in Render matches Vercel URL exactly
- Include `https://` in the URL
- Check no trailing slash

**Database connection:**
- MongoDB Atlas whitelist: Add `0.0.0.0/0` to network access
- Verify `MONGODB_URI` in Render is correct

**Build failures:**
- Check build logs in Vercel/Render
- Ensure all dependencies are in `package.json`

---

## 📊 Database Schema

### User Collection

```javascript
{
  teamName: String,
  email: String,
  password: String (hashed),
  teamMember1: String,
  teamMember2: String,
  teamMember3: String,
  collegeName: String,
  role: String,              // "participant" or "admin"
  solves: [{
    challengeId: String,
    flag: String,
    points: Number,
    timestamp: String
  }],
  round1Completed: Boolean,
  round2Completed: Boolean,
  createdAt: Date
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

---

## 📝 License

This project is open source and available under the MIT License.

---

## 📞 Support

For issues or questions:
- Check `DEPLOYMENT.md` for deployment help
- Review this README for setup guidance
- Check browser console for frontend errors
- Check server logs for backend errors

---

## 🎉 Credits

- **Dragon Theme**: Fire and flames imagery
- **GoT Theme**: Game of Thrones inspired ice round
- **Framework**: React + Vite + Express
- **Styling**: Tailwind CSS + Custom animations

---

**Good luck with your CTF competition! 🚀**
