# Paradise Gym

A complete, production-ready, fully functional gym management and membership website for **Paradise Gym**.

## 1. Project Overview
This project is built for Paradise Gym (Sitapura, Jaipur), owned by Siddharth Meena. It includes a modern frontend for visitors, an authentication system, a member dashboard to purchase and renew memberships, and an admin dashboard to manage the gym.

## 2. Tech Stack
- **Frontend**: Next.js (App Router), React, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: Next.js Server Actions & API Routes, Node.js
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: Auth.js (NextAuth) v5 (Credentials Provider)
- **Payments**: Razorpay
- **Images**: Cloudinary
- **Emails**: Resend

## 3. Installation
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Copy `.env.example` to `.env` and fill in the required environment variables.

## 4. Environment Variables
See `.env.example` for the required keys.
You will need:
- A PostgreSQL connection string (`DATABASE_URL`)
- `NEXTAUTH_SECRET` (generate one using `openssl rand -base64 32`)
- Razorpay API Keys
- Cloudinary API Keys
- Resend API Key

## 5. Database Setup & Prisma Migration
1. Ensure your PostgreSQL database is running.
2. Run `npx prisma db push` to push the schema to the database.
3. Run `npx prisma generate` to generate the Prisma Client.

## 6. Seed Commands
To populate the database with initial data (Admin user, demo plans, and settings):
```bash
npm run seed
```
This script will use the `ADMIN_EMAIL` and `ADMIN_PASSWORD` from your `.env` file to create the admin account.

## 7. Admin Setup
Login to `/login` using the credentials defined in `ADMIN_EMAIL` and `ADMIN_PASSWORD`. You will be redirected to the Admin Dashboard `/admin`.

## 8. Third-Party Integrations
### Razorpay Setup
Create an account on Razorpay and generate API keys in the dashboard. Add `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET` to your `.env` file. Webhook URL: `https://yourdomain.com/api/payments/webhook`.

### Cloudinary Setup
Create an account on Cloudinary, navigate to dashboard, and copy Cloud Name, API Key, and API Secret to your `.env`.

### Email Setup (Resend)
Create an account on Resend, generate an API key, and verify your domain if needed.

## 9. Local Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 10. Production Deployment
This project is ready to be deployed on Vercel. Connect your repository, set the environment variables in the Vercel dashboard, and click Deploy. Make sure to run `npx prisma db push` (or use migrations `npx prisma migrate deploy`) during the build process.

## 11. Troubleshooting
- **Database Connection Error**: Verify your `DATABASE_URL` in `.env`.
- **Payment Verification Failed**: Ensure `RAZORPAY_KEY_SECRET` is correct.
- **Image Upload Failing**: Check Cloudinary keys.
