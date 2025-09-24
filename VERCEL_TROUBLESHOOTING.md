# Vercel Deployment Troubleshooting Guide

## 🚨 **Blank Page Issue - Step by Step Fix**

### **Step 1: Check Environment Variables in Vercel**

Go to your Vercel dashboard → Project Settings → Environment Variables and ensure these are set:

#### **Required Variables:**
```bash
DATABASE_URL=postgresql://username:password@host:port/database
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-very-secure-secret-key
```

#### **How to Generate NEXTAUTH_SECRET:**
```bash
# Run this in your terminal
openssl rand -base64 32
```

### **Step 2: Test Your Database Connection**

1. **Visit your test page**: `https://your-app.vercel.app/test`
2. **Check environment variables** are showing correctly
3. **Click "Test Database"** to verify connection
4. **Check browser console** for any errors

### **Step 3: Check Vercel Function Logs**

1. Go to Vercel Dashboard → Your Project → Functions tab
2. Look for any error logs in the `/api/auth/[...nextauth]` function
3. Check for database connection errors

### **Step 4: Common Issues & Solutions**

#### **Issue 1: "NEXTAUTH_URL not set"**
```bash
# Solution: Set in Vercel environment variables
NEXTAUTH_URL=https://your-exact-vercel-url.vercel.app
```

#### **Issue 2: Database connection fails**
```bash
# Check your DATABASE_URL format:
DATABASE_URL=postgresql://user:pass@host:port/dbname

# Common mistakes:
# ❌ Missing port number
# ❌ Wrong database name
# ❌ Incorrect credentials
```

#### **Issue 3: "NEXTAUTH_SECRET not set"**
```bash
# Generate a new secret:
openssl rand -base64 32

# Set it in Vercel environment variables
```

#### **Issue 4: Migration not applied to production database**
```bash
# Run migrations on your production database
npx prisma migrate deploy
```

### **Step 5: Debug Authentication Flow**

1. **Open browser developer tools** (F12)
2. **Go to Console tab**
3. **Try to sign in**
4. **Look for error messages** in console
5. **Check Network tab** for failed API calls

### **Step 6: Test Registration First**

If login doesn't work, try creating a new account:

1. Go to `/auth/register`
2. Create a new account
3. Then try signing in with the new account

### **Step 7: Check Database Users**

Make sure you have users in your database:

```sql
-- Check if users exist
SELECT * FROM "User";

-- If empty, create a test user manually or use registration
```

## 🔧 **Advanced Debugging**

### **Enable Debug Mode**

Add this to your environment variables in Vercel:
```bash
NEXTAUTH_DEBUG=true
```

### **Check Vercel Build Logs**

1. Go to Vercel Dashboard → Deployments
2. Click on your latest deployment
3. Check "Build Logs" for any errors

### **Test API Endpoints Directly**

Test these URLs in your browser:

1. `https://your-app.vercel.app/api/test-db` - Should return database info
2. `https://your-app.vercel.app/api/auth/providers` - Should show auth providers

## 📋 **Quick Checklist**

- [ ] DATABASE_URL is set correctly in Vercel
- [ ] NEXTAUTH_URL matches your Vercel domain exactly
- [ ] NEXTAUTH_SECRET is set (32+ characters)
- [ ] Database migrations are applied (`npx prisma migrate deploy`)
- [ ] Test page shows green database connection
- [ ] Browser console shows no errors
- [ ] Vercel function logs show no errors

## 🆘 **Still Having Issues?**

1. **Check Vercel Function Logs** for specific error messages
2. **Try the test page** at `/test` to isolate the problem
3. **Create a new user** via registration instead of using existing credentials
4. **Check your database provider** (Supabase, PlanetScale, etc.) for connection limits

## 🚀 **Deployment Steps**

1. **Set environment variables** in Vercel dashboard
2. **Deploy your code** (git push or Vercel CLI)
3. **Run database migrations** on production database
4. **Test the `/test` page** to verify everything works
5. **Try registration** to create your first user
6. **Test sign-in** with the new account

## 📞 **Getting Help**

If you're still stuck:

1. **Share your Vercel function logs**
2. **Share your test page results**
3. **Share your environment variable names** (not values)
4. **Describe exactly what happens** when you try to sign in

The blank page issue is almost always one of these:
- Missing or incorrect environment variables
- Database connection problems
- Missing database migrations
- NEXTAUTH_SECRET not set properly
