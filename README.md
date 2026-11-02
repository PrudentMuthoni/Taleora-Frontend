# Taleora frontend

Next.js (App Router) + TypeScript + Tailwind CSS 4. An installable PWA with light and dark mode.

## Run it

```bash
npm install
cp .env.local.example .env.local     # set NEXT_PUBLIC_API_URL to your backend
npm run dev                          # http://localhost:3000
```

The backend must be running, and its `CORS_ORIGINS` must include `http://localhost:3000`.

To try the PWA (install prompt, offline page), run a production build, because the service worker is
only registered there:

```bash
npm run build && npm start
```

## How the code is organised (style kept apart from logic)

```
src/
  app/          routes only. Each page plugs one hook into one view.
  hooks/        ALL logic: state, polling, forms, auth, theme. No class names.
  services/     typed API calls and token handling. No UI.
  components/   how things LOOK: Tailwind classes, props in, no fetching.
    ui/         buttons, cards, inputs, pills (shared building blocks)
    layout/     app shell: sidebar, top bar, mobile bottom nav
    views/      one view per screen
    create/     pieces of the create screen
    library/    video cards and grid
  styles/       theme.css: every colour for light and dark mode lives here
  lib/          small helpers and constants
  types/        API types that mirror the backend
```

- Change colours or dark mode: `src/styles/theme.css` only.
- Change behaviour: the matching hook in `src/hooks/`.
- Change layout: the view in `src/components/views/`.

## Things to replace

- `public/logo.svg`: your logo mark (the sidebar and auth pages use it).
- `public/hero.jpg`: the landing page hero image. Without it you see a gradient.
- `public/icons/*.png`: app icons (192, 512 and a maskable 512). The current ones are placeholders.

## Notes

- Tokens are kept in localStorage. That is fine for a personal tool, but move to httpOnly cookies before a public launch.
- The backend needs `PATCH /generations/{id}` (assign a video to a project). It is in the backend update that came with this frontend.
- Talking characters, multi-scene, templates and the editor are shown as "Soon" because the backend does not have them.
