<h1 align="center">Sekolah Prompt-Fu</h1>

<p align="center">
  <strong>A playful way for kids to learn how to talk to AI.</strong>
</p>

---

## What is Sekolah Prompt-Fu?

Sekolah Prompt-Fu is a browser game that teaches children how to write good
prompts for AI. Players join Promi on a map of levels, each one a small puzzle
that shows why clear, specific instructions get better answers than vague ones.

The game is a single, self-contained Next.js app. There is no account, no
database, and no server-side state to manage — everything the player does is
kept in their own browser.

Topics the levels cover include:

- What a prompt is, and how AI reads it
- Adding detail so an answer matches what you meant
- Word choice and "magic words"
- Fixing a bad prompt in the prompt doctor
- Drag-and-drop and matching mini-games
- A final quiz

## Tech stack

- **Framework:** Next.js 16 (App Router) with React 19
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Content:** MDX level content, one folder per locale (`src/content/kids/*`)
- **Internationalization:** `next-intl` with 17 locales
- **Testing:** Vitest + Testing Library
- **Icons:** Lucide React

## Getting started

```bash
# Install dependencies
npm install

# Start the dev server at http://localhost:3000
npm run dev

# Run the test suite
npm test

# Build for production
npm run build
```

Optional environment variables are documented in [`.env.example`](.env.example).
The only one the app reads is `NEXT_PUBLIC_SITE_URL`, used to build absolute
metadata and canonical URLs. It is not required to run or play the game.

## How progress is stored

All player state lives in the browser's `localStorage`:

- Stars earned and levels completed
- Sound and other player settings
- The active UI locale

Clearing site data or switching browsers resets progress. Because nothing is
stored on a server, the game runs entirely as static client-side content and
needs no database, sessions, OAuth, or API keys.

## Project layout

```
src/
├── app/                  # Next.js routes (kids map, levels, layout, metadata)
├── components/
│   └── kids/             # Game UI: map, level shell, elements, mini-games
├── content/
│   └── kids/             # MDX level content, one folder per locale
├── lib/                  # Shared utilities (config, i18n, SEO, persistence)
│   └── i18n/             # Locale registry and RTL handling
└── __tests__/            # Vitest tests mirroring the src/ tree
messages/                 # next-intl translation files (one per locale)
public/                   # Favicons, logos, and static assets
prompts.config.ts         # Branding, theme, and locale configuration
```

## Configuration

`prompts.config.ts` holds the app's branding (display name, logos, tagline),
theme tokens, and the supported locale list. The supported locale list must be
kept in sync with `src/lib/i18n/config.ts` and the files in `messages/`.

## License

Released under the [MIT License](LICENSE).