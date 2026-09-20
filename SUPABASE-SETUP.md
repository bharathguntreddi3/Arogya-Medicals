# Admin panel — one-time setup

The admin area is its own page: **`yoursite/admin`** (the 🔒 **Admin** link at the bottom
of the footer opens it in a new tab). There you can change, without touching code:

| Tab | What you can do |
|---|---|
| **Enquiries** | Read contact-form messages, call or reply on WhatsApp, mark handled, delete |
| **Statistics** | All-time totals; visits, calls, WhatsApp chats, prescriptions shared and enquiries with change vs the previous period; contact rate; how visitors found the site; phone vs computer; English vs Telugu; busiest days and hours; map, gallery, directions and review taps |
| **Banner** | Holiday / notice strip at the top: on/off, English + Telugu message, style, end date |
| **Ribbon** | Messages in the orange scrolling strip (add, edit, reorder), discount message on/off |
| **Store hours** | Timings for each day (up to 3 time slots, or closed), plus a "Temporarily closed" switch |
| **Contact** | Phone number, WhatsApp number, address (English + Telugu), area name, Google Maps location, Google review link, Facebook / Instagram / YouTube links |
| **Payments & offer** | Payment methods shown; everyday discount %; limited-time offer with start and end dates |
| **Images** | Upload a new hero image or offer poster (auto-resized), or go back to the original |
| **Gallery** | Store photos: captions, order, add or remove photos, restore the original 7 |
| **Account** | Change your password, sign out |

Changes appear on the website as soon as you save — no redeploy needed.
The login and all settings live in a free **Supabase** project. Setup takes about 10 minutes, once.

## 1. Create the Supabase project

1. Go to <https://supabase.com> → **Start your project** → sign up (GitHub or email).
2. **New project** → name it `arogya-medicals`, set a database password (save it
   somewhere safe), region **Mumbai (ap-south-1)** → **Create**. Wait ~2 minutes.

## 2. Run the setup script

1. Left menu → **SQL Editor** → **New query**.
2. Open `supabase/setup.sql` from this project, copy everything, paste, click **Run**.
   You should see "Success. No rows returned".

This creates the settings table, the admin list, the `site-images` storage folder
for uploads, the enquiries inbox, the click-statistics table, and the security rules
(visitors can only read settings and add enquiries/clicks; only admins can change
settings or read enquiries and statistics).

If you already ran an earlier version of this script, just run the new one again —
it's safe to repeat and keeps everything you've saved.

## 3. Turn off public sign-ups

Left menu → **Authentication** → **Sign In / Providers** → **Email** →
switch **off** "Allow new users to sign up" → **Save**.
(Only accounts you create yourself can log in.)

## 4. Create your admin login

1. **Authentication** → **Users** → **Add user** → **Create new user**.
2. Enter your email and a strong password, tick **Auto Confirm User** → **Create user**.
3. Back in **SQL Editor**, run this with *your* email:

   ```sql
   insert into public.site_admins (user_id)
   select id from auth.users where email = 'your-admin-email@example.com'
   on conflict do nothing;
   ```

   Only accounts added this way can change anything — even if someone else gets a
   login, they can't save settings or upload images.

## 5. Connect the website (on your computer)

1. Supabase → **Project Settings** → **API Keys**: copy the **Publishable key**
   (starts with `sb_publishable_`). Then **Project Settings** → **Data API** (or the
   project's home page): copy the **Project URL**.

   ⚠️ **Never use the Secret key** here. Anything in this file is built into the public
   website, and the secret key bypasses all the security rules. (The older "anon public"
   key under **Legacy API keys** also works, if you prefer it.)
2. In this project folder, copy `.env.example` to a new file named `.env.local` and
   paste the two values:

   ```
   VITE_SUPABASE_URL=https://abcdefgh.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_...
   ```

3. Stop and restart `npm run dev`. Open <http://localhost:5173/admin> (or the footer **Admin** link) → sign in.

`.env.local` is never uploaded to GitHub. The publishable key is designed to be public;
the security rules from step 2 are what protect your data.

## 6. When you host on Vercel

Vercel → your project → **Settings** → **Environment Variables** → add
`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with the same values → **Redeploy**.

Optional but recommended: also add `CRON_SECRET` with any long random text
(e.g. from <https://www.random.org/strings/>). Then only Vercel's scheduler can trigger
the keep-alive below.

Each Vercel build also bakes your current settings into the page, so first-time
visitors instantly see the latest hours, numbers and images.

### Keep-alive (automatic)

Free Supabase projects pause after 7 days without activity. `vercel.json` schedules
`/api/keep-alive` to run **every 3 days at 8:30 AM India time**, which keeps the project
awake. Nothing to do — Vercel runs it on its own once the site is deployed.

To check it's working: Vercel → your project → **Settings** → **Cron Jobs** shows the
schedule and a **Run** button; the logs show `"ok": true` after each run.

If the project ever does get paused (for example, before the site was deployed):
Supabase dashboard → your project → **Restore**. Nothing is lost.

## Everyday use

- **Saving:** every Save asks "Save these changes?" first. If nothing changed, it just says
  "No changes to save". **Logout** (top right) also asks before signing you out.

- **Discount:** until you switch on "Show a discount percentage", the site says
  "Best Discounts on All Medicines". Turn it on and enter e.g. 15 → the site says
  "15% OFF" everywhere, in both languages. The poster image has its own text —
  upload a matching poster in the **Images** tab if you change the discount.
- **Limited-time offer:** set e.g. 20% from 1 Nov to 7 Nov. On those days the site says
  "20% OFF"; before and after, it goes back to the everyday setting by itself.
- **Enquiries:** every contact-form message lands here as well as on WhatsApp. The number
  on the tab shows how many are waiting. (A hidden spam trap and a limit of 30 messages
  per hour keep junk out.)
- **Statistics:** anonymous — only the kind of tap, the time, phone-or-computer, site
  language and a broad "how they arrived" category (direct / search / social / other)
  are stored. No names, no IP addresses. Your own device stops being counted once you
  sign in to the admin panel. "Contact rate" = calls + WhatsApp chats + prescriptions
  shared + enquiries, compared with site visits.
- **Banner "Show until":** the banner hides itself after that day (India time).
  Visitors can close it with ✕; it stays closed for the rest of their visit.
- **Temporarily closed:** for emergencies — overrides the timings until you switch it off.
- **Images:** any photo works; it's shrunk and compressed before upload. Landscape
  photos suit the hero, portrait images suit the poster.
- **Forgot the password:** Supabase → **Authentication** → **Users** → your user → **…** →
  set a new password.
- **Another admin:** create the user (step 4.1–4.2) and run the step 4.3 statement with their email.
