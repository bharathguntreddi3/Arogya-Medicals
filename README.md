<div align="center">
  <img src="src/assets/logo-mark.png" width="140" alt="Arogya Medicals logo" />
  <h1>Arogya Medicals</h1>
  <p>
    <strong>Private commercial website project</strong>
  </p>
</div>

> This website is for the owner’s internal business use and deployment. It is not open source.

<div align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite" alt="Vite 8" />
  <img src="https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Status-Private-FF8A1E?style=for-the-badge" alt="Private project" />
</div>

## ✨ Overview

Arogya Medicals is a bilingual medical store website built with React and Vite. It combines a customer-facing storefront with a separate admin dashboard for changing critical content such as notices, hours, offers, gallery images, contact details, and more.

## ✅ Highlights

- public storefront for a pharmacy and healthcare business
- English + Telugu friendly layout and content structure
- dynamic promotional banner and offer ribbon
- store hours, contact details, map links, and WhatsApp access
- admin-driven updates without a full code redeploy
- analytics and enquiry tracking for site activity and messages
- private Supabase-backed configuration and authentication

## 🛠️ Tech stack

- React 19
- Vite
- Tailwind CSS
- Supabase for auth, settings, enquiries, and analytics
- Lucide React icons
- SSR + prerender build flow for static deployment

## 📁 Project structure

- `src/App.jsx` — public storefront layout
- `src/Root.jsx` — shared app shell with settings provider
- `src/components/` — storefront sections and UI components
- `src/components/admin/` — admin dashboard and management tabs
- `src/settings/` — site settings context and provider
- `src/lib/` — defaults, Supabase config, date logic, analytics, and data helpers
- `supabase/setup.sql` — database setup for settings, admin access, enquiries, and stats
- `api/keep-alive.js` — keep-alive endpoint for hosted deployments
- `scripts/prerender.js` — prerender build step
- `admin.html` and `index.html` — public and admin entry points

## 🌟 Features

- dynamic notice banner and offer configuration
- configurable shop timings for each day
- contact details, WhatsApp integration, and map/review links
- payment method display and discount controls
- image upload support for hero and offer poster
- gallery management
- enquiry inbox and website usage statistics
- separate admin login with Supabase authentication

## 🚀 Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create the local environment file:

   ```bash
   copy .env.example .env.local
   ```

   Then add your Supabase values:

   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. Run the app:

   ```bash
   npm run dev
   ```

4. Open the site:

   - public site: http://localhost:5173/
   - admin: http://localhost:5173/admin

## 🧪 Available scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## 🔐 Admin setup

The full setup instructions are documented in [SUPABASE-SETUP.md](SUPABASE-SETUP.md). That file includes:

- creating the Supabase project
- running the SQL setup script
- creating the admin user
- configuring environment variables
- deployment notes for Vercel

## ☁️ Deployment

This project is designed for Vercel deployment and includes an API keep-alive route to prevent Supabase from sleeping on free plans.

## 📌 Notes

- This project is private and not licensed for public reuse or redistribution.
- The site supports editable content from the admin without a full code redeploy.
- Public settings are merged with default values, so the storefront remains usable even before admin data is configured.
- Sensitive database access is protected by Supabase rules; do not expose the secret key in frontend code.
