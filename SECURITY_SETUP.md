# Security Setup Guide

This guide will help you securely deploy your car inventory application to Vercel.

## 🔐 Environment Variables Required

Create a `.env.local` file (for local development) and configure these variables in your Vercel dashboard:

### Required Environment Variables:

```bash
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth.js
NEXTAUTH_URL="https://your-app.vercel.app"  # Your production URL
NEXTAUTH_SECRET="your-very-secure-secret-key-here"

# Admin credentials (CHANGE THESE!)
ADMIN_EMAIL="your-admin-email@example.com"
ADMIN_PASSWORD="your-very-secure-password"
```

## 🚀 Deployment Steps

### 1. Configure Vercel Environment Variables

1. Go to your Vercel dashboard
2. Navigate to your project settings
3. Go to "Environment Variables"
4. Add all the variables listed above
5. **Important**: Set `NEXTAUTH_URL` to your production domain

### 2. Generate Secure Secrets

```bash
# Generate a secure NextAuth secret
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Database Security

- Ensure your database is not publicly accessible
- Use connection pooling for production
- Regularly update your database credentials
- Enable SSL connections to your database

### 4. Vercel Security Features

Enable these in your Vercel dashboard:
- **Web Application Firewall (WAF)**: Protects against common attacks
- **Rate Limiting**: Built-in protection against abuse
- **HTTPS**: Automatically enforced by Vercel

## 🔒 Security Features Implemented

### ✅ Authentication & Authorization
- NextAuth.js with JWT sessions
- Protected API routes (POST requires authentication)
- Secure password handling

### ✅ Input Validation
- Zod schema validation for all inputs
- Type-safe data handling
- Protection against injection attacks

### ✅ Rate Limiting
- 100 requests per 15 minutes per IP
- Prevents API abuse and DoS attacks

### ✅ Security Headers
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security
- Content-Security-Policy

### ✅ Error Handling
- Secure error messages
- No sensitive information leakage
- Proper HTTP status codes

## 🛡️ Additional Security Recommendations

### For Production:

1. **Use a Real Authentication Provider**
   - Replace hardcoded credentials with OAuth providers
   - Consider Auth0, Firebase Auth, or Supabase Auth

2. **Database Security**
   - Use connection pooling (Prisma supports this)
   - Enable database-level encryption
   - Regular security updates

3. **Monitoring & Logging**
   - Set up error tracking (Sentry, LogRocket)
   - Monitor for suspicious activity
   - Regular security audits

4. **Backup & Recovery**
   - Regular database backups
   - Test disaster recovery procedures

### Environment-Specific Configurations:

```bash
# Development
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000

# Production
NODE_ENV=production
NEXTAUTH_URL=https://your-app.vercel.app
```

## 🚨 Security Checklist

Before deploying to production:

- [ ] Change default admin credentials
- [ ] Generate secure NEXTAUTH_SECRET
- [ ] Configure proper NEXTAUTH_URL
- [ ] Enable Vercel WAF
- [ ] Test authentication flows
- [ ] Verify rate limiting works
- [ ] Check security headers are applied
- [ ] Test input validation
- [ ] Ensure database is secure
- [ ] Set up monitoring

## 🔍 Testing Security

Test these scenarios:

1. **Authentication**
   - Try accessing protected routes without auth
   - Test invalid credentials
   - Verify session persistence

2. **Input Validation**
   - Submit invalid data types
   - Test SQL injection attempts
   - Verify error messages don't leak info

3. **Rate Limiting**
   - Make rapid requests to API
   - Verify 429 responses after limit

4. **Security Headers**
   - Check headers with browser dev tools
   - Test CSP violations

## 📞 Support

If you encounter security issues:

1. Check Vercel deployment logs
2. Verify environment variables are set correctly
3. Test locally with same environment variables
4. Check database connectivity and permissions

## 🔄 Updates

Keep your dependencies updated:

```bash
npm audit
npm update
```

Regularly review and update:
- NextAuth.js configuration
- Security headers
- Rate limiting rules
- Admin credentials
