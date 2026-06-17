# DogSpotGPS Ultimate Website Code

This is a website-first, Vercel-ready Next.js build for **dogspotgps.com**. It is not a stretched phone-app layout.

## What it includes
- Branded DogSpotGPS visuals from your icon/hero images
- Website-first homepage
- Two clear actions: **Spot a Dog** and **Report Lost Dog**
- Live-camera-only Spot a Dog flow using browser camera permissions
- GPS + timestamp evidence model
- Protected owner preview: dog visible, background/exact location locked until confirmation
- Owner Review screen
- Active Searches
- Reward Radar
- Recovery Command Center
- Earnings, Leaderboard, Profile, Admin/Support, Partner Marketplace
- Privacy and Terms routes
- Vercel configuration and SEO metadata
- LocalStorage demo mode so every button works immediately
- Firebase env template for production connection

## Run locally
```bash
npm install
npm run dev
```
Open `http://localhost:3000`.

## Deploy to Vercel
1. Upload this repo to GitHub.
2. Import it into Vercel.
3. Add env variables from `.env.example`.
4. Deploy.
5. Add `dogspotgps.com` in Vercel Domains.
6. Point GoDaddy DNS to Vercel.

## Important production note
The website works as a full interactive demo immediately. For live production data, connect Firebase Auth, Firestore, Storage, and backend Cloud Functions using the environment variables.

## Product principle
**See dog → snap live picture → GPS/time lock → owner confirms → exact location unlocks → reward/recovery flow starts.**

No gallery uploads are used for Spot a Dog sightings.
