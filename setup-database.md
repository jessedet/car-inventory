# Database Setup Instructions

## Step 1: Create .env.local file
Create a file called `.env.local` in your project root with:

```
DATABASE_URL="postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.pxjllgnyztdapnizca.supabase.co:5432/postgres"
NEXTAUTH_SECRET="V/CXKdadGBPGeBf6N11EzMly4/SmP2jkHyUW0RSs3oM="
NEXTAUTH_URL="http://localhost:3000"
```

## Step 2: Run Database Migrations
Open terminal in your project folder and run:

```bash
npx prisma migrate deploy
```

This will create the User and Car tables in your Supabase database.

## Step 3: Seed the Database
Run this to add sample car data:

```bash
npx prisma db seed
```

## Step 4: Test Locally
```bash
npm run dev
```

Visit http://localhost:3000/test to verify database connection.

## Step 5: Deploy to Vercel
After local testing works, your Vercel deployment should work too!
