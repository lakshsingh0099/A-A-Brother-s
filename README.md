# A & A Brother's

A responsive React + Vite portfolio website for A & A Brother's interior design and construction services.

## What's included

- React/Vite source in `src/`
- Catalog photos and ceiling videos in `public/media/`
- Supabase enquiry storage with an insert-only Row Level Security policy
- SQL migration in `supabase/migrations/`

## Run locally

1. Install Node.js and pnpm.
2. Copy `.env.example` to `.env.local`.
3. Run `pnpm install`.
4. Run `pnpm dev` and open the local URL Vite prints.

The public Supabase URL and publishable key are safe for browser use. Never put a Supabase service-role key in this website.

## Supabase enquiries

The form saves submissions to `public.enquiries`. The migration creates the table, enables RLS, and allows anonymous visitors to insert valid enquiries; it does not allow visitors to read records. View submissions in Supabase Dashboard → Table Editor → `public.enquiries`.

Automatic email notifications are not configured yet. New enquiries are stored in Supabase; add an email provider and a server-side notification function if Gmail notifications are needed.

## Production build

Run `pnpm run build`. The generated website is written to `dist/`.