This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Environment Variables

Create a `.env.local` file in the `frontend/` directory with the following variables:

```bash
# Google Analytics ID (optional - leave empty to disable analytics)
NEXT_PUBLIC_GA_ID=G-3TZH3H4MVW

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# MapTiler API (for terrain tiles and contours)
NEXT_PUBLIC_MAPTILER_KEY=your_maptiler_api_key

# Admin Dashboard (for API usage tracking at /admin/api-usage)
ADMIN_PASSWORD=your_secure_admin_password

# Brevo Email (transactional + marketing emails)
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=hello@gridline.eu
BREVO_SENDER_NAME=Jonas from GridLine
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment

This project is deployed on [Netlify](https://www.netlify.com/).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
