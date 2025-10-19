# Copilot Instructions for PA Mi Senti

## Big Picture Architecture

This is an **Astro-based static site generator** for facilitating citizen-to-government communication. The core workflow:

1. **Data-driven routing**: YAML files (`src/data/pa.yml`, `templates.yml`) define municipalities, themes, and message templates
2. **Static generation**: Astro's `getStaticPaths()` pre-renders all routes at build time (`/citta/{istat}/{context}/...`)
3. **Selective hydration**: React components (only `TemplatePicker.tsx`) use `client:load` for interactive features (geolocation, template selection)
4. **Dual base path**: `ASTRO_BASE` env var controls base URL (dev: `/`, prod: `/pa_mi_senti/`)

**Critical**: All internal links MUST use helpers from `src/lib/paths.ts` (never hardcode URLs). Example:
```typescript
import { buildContextPath } from "../../lib/paths";
<a href={buildContextPath(istat, slug)}>Link</a>
```

## Key Components & Data Flow

- **`src/data/pa.yml`**: Single source of truth for cities, themes (contexts), channels
- **`src/data/templates.yml`**: Pre-written social messages (e.g., RAP Palermo waste reports)
- **`src/lib/data.ts`**: Loads YAML and generates unique channel keys
- **`src/components/react/TemplatePicker.tsx`**:
  - Shows custom dialog for geolocation consent (NOT browser native `confirm()`)
  - Auto-appends `#PaMiSenti` hashtag to template messages (NOT custom messages)
  - Builds Twitter/X intent URLs with optional Google Maps link

## Critical Patterns

### 1. Tailwind Color Safelist
Dynamic classes (from YAML `color` field) MUST be in `tailwind.config.cjs` safelist:
```javascript
safelist: ['bg-emerald-50', 'bg-blue-50', /* add new colors here */]
```

### 2. YAML Structure Conventions
- Use `snake_case` for slugs/keys (URL-friendly, matches `getStaticPaths` params)
- `helpfulLinks` belong to **contexts** (themes), not municipalities
- Channel `key` is auto-generated from municipality name + service + platform

### 3. TypeScript Types
All data structures defined in `src/lib/types.ts`. When adding YAML fields, update types first.

### 4. Geolocation UX
- Custom React dialog with "Sì, aggiungi posizione" / "No, grazie" buttons
- Never use browser's native `window.confirm()` (shows "OK"/"Cancel")
- Implementation: `src/lib/location.ts` + `TemplatePicker.tsx` state management

## Development Workflow

```bash
npm run dev          # Dev server on :4321 (base path: /)
npm run build        # Static build to dist/ (base path: /pa_mi_senti/)
npm run preview      # Serve dist/ (test production paths)
npm run lint         # ESLint + TypeScript checks
```

**Before committing**:
1. Run `npm run build` to verify static generation
2. Check YAML syntax (validate with tools if uncertain)
3. Verify new Tailwind colors are in safelist

## Common Tasks

### Add a New Theme (Context)
1. Edit `src/data/pa.yml` under municipality's `contexts` array
2. Choose emoji + color from safelist (`bg-{color}-50`)
3. Add optional `helpfulLinks` and `channels`
4. Add templates in `src/data/templates.yml` if social channel exists
5. Test: `npm run dev` → verify theme appears with correct styling

### Add a Message Template
1. Edit `src/data/templates.yml`
2. Match `contextSlug` and `channelKey` from `pa.yml`
3. Use `{indirizzo}` or `{piazza}` as placeholders for user input
4. **Do NOT** add `#PaMiSenti` manually (auto-appended by code)

### Modify Page Layouts
- **Astro pages**: `src/pages/*.astro` use `BaseLayout.astro`
- **Markdown pages**: `src/pages/*.md` use `MarkdownLayout.astro` (includes prose styling)
- Always include `<Breadcrumbs />` component for navigation consistency

## External Dependencies & Integrations

- **Twitter/X**: `buildTwitterIntentUrl()` in `src/lib/social.ts` constructs intent links
- **Google Maps**: `buildGoogleMapsLink()` formats coordinates as `https://www.google.com/maps/place/{lat},{lng}`
- **Geolocation API**: `navigator.geolocation.getCurrentPosition()` with 10s timeout, high accuracy

## Project Philosophy (Context for Decisions)

- **Zero authentication**: Users identify via platform accounts (Twitter, email)
- **No file uploads**: Delegate to platforms (attach photos in tweet/email client)
- **Privacy-first**: No cookies, no tracking, no databases
- **YAML-driven**: Non-developers can add cities/themes without touching code
- **Static-only**: Works on GitHub Pages with no server

## References

- Full technical guide: `TECHNICAL.md`
- Product requirements: `PRD.md`
- Original guidelines: `AGENTS.md`
