# Micro Film Maker

A minimal Next.js app that plans, generates, stitches, and displays micro‑films using Supabase storage and FFmpeg in the browser.

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Storage + Admin client)
- FFmpeg (browser)

## Project Structure

- `app/` – UI pages and API routes (`/api/*`):
  - `generate-script`, `plan-shots`, `generate-video`, `stitch-and-upload`, validations, and helpers
- `components/` – UI components (chat, suggestions, film display, mini-game)
- `lib/` – core utils (Supabase client, FFmpeg, types, context, constants)
- `public/videos/` – public video assets

## Prerequisites

- Node.js 18+
- A Supabase project with a storage bucket named `micro-films`

## Environment Variables

Create a `.env.local` file with:

```
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
SUPABASE_SECRET_KEY=<your-service-role-key>
```

Note: The service role key (`SUPABASE_SECRET_KEY`) is required for admin storage uploads used in `lib/supabase.ts`. Keep this secret and do not expose it on the client.

## Install and Run

```bash
# install dependencies
npm install

# start dev server
npm run dev
```

Open `http://localhost:3000`.

## Development Notes

- Video uploads use the Supabase Storage bucket `micro-films` and generate public URLs.
- Browser-side FFmpeg is used for stitching; heavy operations may take time.
- Tailwind is configured via `tailwind.config.ts`; global styles in `app/globals.css`.

## License

Proprietary. Do not redistribute without permission.
