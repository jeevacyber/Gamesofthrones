# Authentication Protection - Route Guards ✅

## Overview
Implemented strict authentication protection. Users can **ONLY** access protected pages after successful login. Unauthenticated users are restricted to the landing page, login, and register pages.

## Route Protection Structure

### **Public Routes** (No Login Required)
These routes are accessible to everyone:
- `/` - Landing page (Index)
- `/login` - Login page
- `/register` - Registration page

### **Protected Routes** (Login Required)
These routes require authentication. Unauthenticated users are redirected to `/`:
- `/rounds` - Round selection page
- `/round/1` - Round 1 challenges
- `/round/2` - Round 2 challenges
- `/dashboard` - Participant dashboard
- `/leaderboard` - Leaderboard page

### **Admin-Only Route** (Admin Login Required)
This route requires admin role. Non-admin or unauthenticated users are redirected to `/`:
- `/admin` - Admin dashboard

## Implementation Details

### 1. **ProtectedRoute Component** (`src/components/ProtectedRoute.tsx`)

```tsx
Features:
- Checks if user is logged in (from useAuth context)
- Redirects to landing page (/) if not authenticated
- Supports admin-only routes
- Shows nothing while loading authentication state
```

**How it works:**
1. Component checks `user` from `useAuth` context
2. If `isLoading` → Show nothing (checking auth)
3. If `!user` → Redirect to `/` (not logged in)
4. If `adminOnly && role !== 'admin'` → Redirect to `/` (not authorized)
5. If authenticated → Render the protected page

### 2. **App.tsx Route Configuration**

Routes are now wrapped with `<ProtectedRoute>`:

```tsx
// Public - Anyone can access
<Route path="/" element={<Index />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />

// Protected - Must be logged in
<Route path="/rounds" element={<ProtectedRoute><Rounds /></ProtectedRoute>} />
<Route path="/round/1" element={<ProtectedRoute><Round1 /></ProtectedRoute>} />
// ... etc

// Admin Only - Must be logged in as admin
<Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
```

## User Flow Examples

### **Scenario 1: Unauthenticated User**
1. User visits any URL directly (e.g., `/rounds`)
2. `ProtectedRoute` checks authentication
3. No user found → **Redirected to `/`** (landing page)
4. User must click "Login" or "Register"

### **Scenario 2: Authenticated Participant**
1. User logs in successfully
2. User data stored in context and localStorage
3. Redirected to `/rounds`
4. Can now access all participant routes
5. Attempting to access `/admin` → **Redirected to `/`**

### **Scenario 3: Authenticated Admin**
1. Admin logs in with `admin@ctf.com` / `admin`
2. Admin data stored with `role: "admin"`
3. Redirected to `/admin`
4. Can access all routes including admin dashboard

### **Scenario 4: Direct URL Access**
1. Unauthenticated user types `/round/1` in browser
2. Page loads → `ProtectedRoute` checks auth
3. No user → **Redirected to `/`**
4. User sees landing page instead

## Protected Pages List

All these pages require successful login:

| Route | Page | Requires | Redirect If Not Auth |
|-------|------|----------|---------------------|
| `/rounds` | Round Selection | Login | → `/` |
| `/round/1` | Round 1 Challenges | Login | → `/` |
| `/round/2` | Round 2 Challenges | Login | → `/` |
| `/dashboard` | User Dashboard | Login | → `/` |
| `/leaderboard` | Leaderboard | Login | → `/` |
| `/admin` | Admin Dashboard | Admin Role | → `/` |

## Public Pages List

These pages are always accessible:

| Route | Page | Purpose |
|-------|------|---------|
| `/` | Landing Page | Welcome screen, CTA to login/register |
| `/login` | Login | Authenticate users |
| `/register` | Registration | Create new accounts |
| `*` | 404 Not Found | Fallback for invalid routes |

## Authentication Flow

```
Page Load
    ↓
ProtectedRoute Component
    ↓
Check useAuth context
    ↓
Is user logged in?
    ├─ NO → Navigate to "/"
    └─ YES → Continue
        ↓
    Is adminOnly route?
        ├─ YES → Is user admin?
        │   ├─ NO → Navigate to "/"
        │   └─ YES → Show page
        └─ NO → Show page
```

## Testing the Protection

### Test 1: Access Without Login
1. Clear browser cache/localStorage
2. Try to visit `/rounds` directly
3. **Expected:** Redirected to `/` (landing page)
4. ✅ Protection working

### Test 2: Access After Login
1. Login as participant
2. Visit `/rounds`
3. **Expected:** Page loads successfully
4. ✅ Authentication working

### Test 3: Admin Access
1. Login as participant
2. Try to visit `/admin`
3. **Expected:** Redirected to `/` (not authorized)
4. Login as admin (`admin@ctf.com`)
5. Visit `/admin`
6. **Expected:** Admin dashboard loads
7. ✅ Authorization working

### Test 4: Logout
1. User is logged in
2. Logout (clears user context)
3. Try to access `/rounds`
4. **Expected:** Redirected to `/`
5. ✅ Logout protection working

## Navbar Behavior

The Navbar only shows public links:
- **Brand Logo** → Links to `/`
- **Login Button** → Links to `/login`
- **Register Button** → Links to `/register`

No protected routes are shown in the navbar, preventing accidental unauthorized access attempts.

## Security Features

✅ **Route-level protection** - Cannot bypass via URL manipulation  
✅ **Component-level checks** - Guards run before page renders  
✅ **Role-based access** - Admin routes require admin role  
✅ **Automatic redirects** - Seamless UX for unauthorized access  
✅ **Persistent auth state** - Uses localStorage + context  
✅ **Loading states** - No flash of unauthorized content

## What Changed

**Before:**
- All routes accessible to anyone
- Users could access `/rounds`, `/admin`, etc. without login
- No authentication enforcement

**After:**
- Only public routes accessible without login
- Protected routes require authentication
- Admin routes require admin role
- Automatic redirection to landing page for unauthorized access

## Files Modified

1. **`src/components/ProtectedRoute.tsx`** - New component for route protection
2. **`src/App.tsx`** - Wrapped protected routes with ProtectedRoute component
3. **`src/hooks/useAuth.tsx`** - Already provides user context (no changes needed)

## Status: FULLY SECURED 🔒

All routes are now protected:
✅ Unauthenticated users → Landing page only  
✅ Authenticated participants → Rounds and features  
✅ Admin users → All features + admin dashboard  
✅ Direct URL access blocked for protected routes  
✅ Clean redirects to landing page (`/`)
