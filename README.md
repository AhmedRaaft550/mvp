# Restaurant SaaS Dashboard

A modern restaurant management and customer ordering platform built with **Next.js 16**, **React 19**, **Supabase**, and **Ant Design**.

## Project Overview

This repository implements a hospitality SaaS experience with separate admin and guest interfaces.

- **Guest experience**: QR-driven table check-in, menu browsing, cart management, live order placement, and real-time order tracking.
- **Admin experience**: protected dashboard, live order queue, order status updates, table QR management, customer call notifications, and product catalog editing.

## Features

- QR-scanned table landing page with restaurant name detection
- Menu browsing with search, category filters, and add-to-cart
- Cart flow with notes, order submission, and order history
- Real-time live order tracking using Supabase Realtime
- Admin authentication using Supabase auth
- Admin order management and status updates
- Notification system for live customer requests
- Chat assistant integration via `/api/chat`
- Redux toolkit state management with persistence
- Ant Design components and custom UI styling

## Screenshots

> Placeholders — replace these with actual screenshots before public release.

- **Landing / QR Check-in**
- **Menu & Cart**
- **Live Order Tracking**
- **Admin Dashboard**
- **Order Notifications**

## Tech Stack

- `next` v16.2.6
- `react` v19.2.4
- `typescript` v5
- `@reduxjs/toolkit`, `react-redux`, `redux-persist`
- `supabase-js` for backend and realtime
- `antd` and `@ant-design/pro-chat`
- `sonner` for toast notifications
- `tailwindcss` v4 / custom utility classes
- `qrcode.react` for QR generation

## Architecture Overview

- **App Router** under `src/app`
- Route groups:
  - `app/(admin)` — admin login and dashboard
  - `app/(userHomePage)` — restaurant QR landing page
  - `app/(users)` — guest menu/cart/orders experience
- **Server actions** in `src/actions/*` for Supabase operations
- **Shared client UI** under `src/components`
- **Global state** with Redux in `src/redux`
- **Supabase client** configured in `src/lib/supabase.ts`

## Installation Guide

```bash
cd my-app
pnpm install
pnpm dev
```

Visit `http://localhost:3000` after starting the app.

## Environment Variables

Create a `.env.local` file and add:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
CHAT_BOT_WEBHOOK=https://your-chat-webhook.example.com/webhook
```

> The project currently uses client-side Supabase configuration and requires a webhook URL for the chat endpoint.

## Available Scripts

- `pnpm dev` — run development server
- `pnpm build` — build production app
- `pnpm start` — start compiled app
- `pnpm lint` — run ESLint

## Project Structure

- `src/app` — application routes and layouts
- `src/components` — reusable UI components
- `src/actions` — server-side business logic and Supabase interactions
- `src/redux` — Redux state, store, and slices
- `src/lib/supabase.ts` — Supabase client factory
- `src/context` — app-level context providers
- `src/const` — static menu data and validation constants
- `src/hooks` — custom React hooks
- `src/public` — static assets and sounds

## Key Components and Modules

- `src/components/menu/Menu.tsx` — guest menu page
- `src/components/menu/MenuData.tsx` — meal cards and add-to-cart logic
- `src/components/cart/Cart.tsx` — cart experience and order submission
- `src/components/orders/User-Order-Dashboard.tsx` — live user order tracking
- `src/components/admin-dashboard/Admin-Table.tsx` — admin order table
- `src/components/admin-dashboard/Add-Product.tsx` — product add form
- `src/components/admin-login-page/Admin-Login.tsx` — admin authentication
- `src/components/chat/ui/Chatbot-ui.tsx` — chat widget wrapper
- `src/app/api/chat/route.ts` — server API proxy for chat webhook

## State Management Explanation

The app uses Redux Toolkit to manage:

- `cart` — selected items and cart totals
- `chatBotBox` — chat drawer visibility and query state

Redux state lives in `src/redux/slice.ts`, and persistence is enabled through `redux-persist`.

## API Integration Details

- `supabase-js` is used for authentication, orders, restaurants, and notifications.
- Admin login uses `supabaseConfig.auth.signInWithPassword`.
- Orders are inserted via `src/actions/place-order.ts`.
- Protected admin queries use cookies with `next/headers`.
- Chat bot uses `/api/chat` proxy to forward requests to `CHAT_BOT_WEBHOOK`.

## Performance Optimizations

- Uses Next.js App Router and client/server component split
- Next Image for meal images with built-in optimization
- Debounced search in menu and admin filtering
- Realtime subscriptions reduce polling overhead

## Security Considerations

Current security strengths:

- HTTP-only cookies for admin token and restaurant ID
- SameSite strict policy on auth cookies
- Server-side Supabase query logic in `src/actions`

Risks and gaps:

- No route middleware protecting `app/(admin)` pages
- Hard-coded guest session IDs and order URLs are fragile
- Data validation is incomplete in forms and order payloads
- `CHAT_BOT_WEBHOOK` and Supabase anon key still rely on environment safety
- Reported dependency vulnerabilities in PostCSS and js-cookie

## Accessibility Features

- Uses semantic HTML and labels in forms
- Some buttons include `title` or `aria-label`
- Dark mode theme with strong contrast
- Toasts and modals provide feedback

## Deployment Instructions

1. Set environment variables in your hosting provider
2. Build with `pnpm build`
3. Start with `pnpm start`
4. Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are configured
5. For production, verify `NODE_ENV=production`

## Future Improvements

- Add route middleware or server-side auth guard for admin pages
- Replace placeholder table number logic with real QR/session mapping
- Complete `AddProduct` backend submission and image upload flow
- Add quantity/line-item support to cart
- Add unit and integration tests
- Add user profile / order history features
- Implement better error boundaries and fallback UI
- Improve SEO and metadata for public pages

## Contributing Guidelines

1. Fork the repository
2. Create a feature branch
3. Run `pnpm install`
4. Follow the established `src/app` route and component patterns
5. Submit a pull request with clear changelog and test coverage

## License

No license file is included in this repository. Add a `LICENSE` if you want this project to be open source.
