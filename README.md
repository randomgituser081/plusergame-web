# Pluser Game — Next.js Web

Web version of the Pluser Game mobile app. Same features, branding, and API.

## Stack

- Next.js 14 (App Router)
- TypeScript + Tailwind CSS
- Zustand + Axios
- Framer Motion (game animations)

## Setup

```bash
cd plusergame-nextjs
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

```
NEXT_PUBLIC_SERVER_URI=https://buzzycash.viaspark.site/api/v1
NEXT_PUBLIC_IMAGE_URI=https://buzzycash.viaspark.site
```

## Features

- Guest home + auth home with wallet balance card
- Register / login / OTP / forgot & reset password
- Deposit (Nomba paylink iframe) + withdraw (banks)
- Transactions, games played, notifications, profile
- 9 virtual games at `/games/[slug]`:
  - dice, lottery, card, coin, hot-cold, lucky-box, reel-streak, rps-bet, spin
- Responsive layout: bottom tabs on mobile, top nav on desktop

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm start` — run production build
