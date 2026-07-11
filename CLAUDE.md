<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**PA Mi Senti** is a static Astro-based web application that facilitates citizen-to-government communication in Italy. It helps citizens find the right channel (Twitter/X, email, phone) to report issues like waste, parking violations, or road maintenance to their local Public Administration.

Key principles:
- **No authentication** - users identify via platform accounts (Twitter, email)
- **No file uploads** - delegates to platforms for photos/videos
- **Privacy-first** - no cookies, tracking, or databases
- **YAML-driven** - non-developers can add cities/themes by editing YAML files
- **Static-only** - runs on GitHub Pages with no backend

## Development Commands

```bash
# Development server (base path: /)
npm run dev

# Production build (base path: /pa_mi_senti/)
npm run build

# Preview production build
npm run preview

# Lint TypeScript/TSX files (runs `astro sync` first to regenerate types)
npm run lint

# Check formatting with Prettier
npm run format
```

**Before committing:**
1. Run `npm run build` to verify static generation works
2. Check YAML syntax if you modified data files
3. Verify new Tailwind colors are in safelist (if applicable)

## Architecture

### Data-Driven Static Generation

All routes are pre-rendered at build time using Astro's `getStaticPaths()`:

1. **Data source**: YAML files define municipalities, themes (contexts), and message templates
   - [src/data/pa.yml](src/data/pa.yml) - cities, themes, contact channels
   - [src/data/templates.yml](src/data/templates.yml) - pre-written social messages

2. **Routing structure**:
   - `/` - home with city list
   - `/citta/{istat}/` - list of themes for a city
   - `/citta/{istat}/{context}/` - channels for a specific theme
   - `/citta/{istat}/{context}/messaggi/{channelKey}/` - template picker with geolocation

3. **Selective hydration**: Only [src/components/react/TemplatePicker.tsx](src/components/react/TemplatePicker.tsx) uses React with `client:load` for interactive features

### Dual Base Path

The `ASTRO_BASE` env var controls URL generation:
- **Dev**: `ASTRO_BASE=/` (local development)
- **Prod**: `ASTRO_BASE=/pa_mi_senti/` (GitHub Pages)

**CRITICAL**: Always use helpers from [src/lib/paths.ts](src/lib/paths.ts) for internal links - NEVER hardcode URLs.

```typescript
import { buildContextPath } from "../../lib/paths";
<a href={buildContextPath(istat, slug)}>Link</a>
```

## Key Files & Modules

### Data Layer
- [src/lib/data.ts](src/lib/data.ts) - Loads YAML files and generates channel keys
- [src/lib/types.ts](src/lib/types.ts) - TypeScript type definitions for all data structures

### Path Helpers
- [src/lib/paths.ts](src/lib/paths.ts) - URL generation with base path handling
  - `buildHomePath()`
  - `buildCityPath(istat)`
  - `buildContextPath(istat, contextSlug)`
  - `buildTemplatePath(istat, contextSlug, channelKey)`

### Utilities
- [src/lib/location.ts](src/lib/location.ts) - Geolocation API wrapper with custom consent dialog
- [src/lib/social.ts](src/lib/social.ts) - Twitter/X intent URL builder and Google Maps link formatter

### Components
- [src/components/react/TemplatePicker.tsx](src/components/react/TemplatePicker.tsx):
  - Custom consent dialog for geolocation (NOT browser native `confirm()`)
  - Branches on `channelType`: `social` → Twitter/X intent URL; `email` → `mailto:` URL with `subject` + body (falls back to `Segnalazione {contextName}` when a template has no `subject`)
  - Auto-appends `#PaMiSenti` hashtag to template messages (NOT to custom messages); hashtag is **social-only**
  - Optional Google Maps coordinates appended to the message/body
  - Injects a synthetic "Scrivi un messaggio libero" / "Scrivi una email libera" option for both channel kinds

## Critical Patterns

### 1. Tailwind Color Safelist

Dynamic theme colors from YAML files MUST be in [tailwind.config.cjs](tailwind.config.cjs) safelist. If adding a new color:

```javascript
safelist: [
  'bg-emerald-50',  // waste/environment
  'bg-blue-50',     // police/security
  'bg-amber-50',    // construction/warnings
  'bg-rose-50',     // urgent reports
  // ... add new colors here
]
```

### 2. YAML Structure

Use `snake_case` for slugs/keys (URL-friendly). A channel's `type` is one of `social | email | phone | form` (see `ChannelType` in [src/lib/types.ts](src/lib/types.ts)); only `social` and `email` have interactive template flows in `TemplatePicker`.

```yaml
contexts:
  - slug: "nettezza_urbana"     # URL slug
    name: "Igiene urbana"       # Display name
    description: "Segnala..."
    emoji: "♻️"
    color: "bg-emerald-50"      # Must be in safelist
    helpfulLinks:               # Belongs to context, not municipality
      - label: "..."
        url: "https://..."
    channels:
      - type: "social"
        key: "palermo-rap-twitter"  # Auto-generated, or explicit
        platform: "twitter"
        label: "Twitter/X RAP"
        value: "https://twitter.com/RapPalermo"
```

### 3. Geolocation UX

- **3-option dialog**: GPS automatico, Scegli su mappa, No grazie
- Uses **custom React dialog** with Italian labels (NOT browser native `window.confirm()`)
- Implementation:
  - [src/lib/location.ts](src/lib/location.ts): GPS functions + coords formatting
  - [src/lib/map-loader.ts](src/lib/map-loader.ts): lazy loading MapLibre GL (~260KB gzipped)
  - [src/components/react/TemplatePicker.tsx](src/components/react/TemplatePicker.tsx): dialog logic
  - [src/components/react/MapPickerModal.tsx](src/components/react/MapPickerModal.tsx): interactive map
- GPS timeout: 10s, high accuracy enabled
- Map auto-requests GPS on open (fallback to Italy center if denied/failed)
- Draggable marker, live coordinates display, "Usa posizione GPS" button in map
- **Reverse geocoding**: `reverseGeocode()` in [src/lib/location.ts](src/lib/location.ts) calls Nominatim (OSM, no API key) to turn coords into a street name, substituted into the `{indirizzo}` placeholder. 2.5s `AbortController` timeout; on failure/timeout returns `null` and `{indirizzo}` stays literal. Only called when the message actually contains `{indirizzo}` (free messages skip the network call)
- **Do NOT pre-open the tab** before `window.open`: opening a blank tab backgrounds the page (breaks `getCurrentPosition`) and navigating an already-open tab to a `twitter.com/intent` URL stops the mobile Twitter app from deep-linking. Open directly after the awaits (`window.open(url, '_blank', 'noopener')`)
- **Google Maps link always appended**: both the resolved street address (in `{indirizzo}`) and the maps link are kept. Twitter counts every URL as a fixed 23 chars (t.co), so there is no real 280-char risk for normal templates

### 4. Message Templates

Template messages in [src/data/templates.yml](src/data/templates.yml):

```yaml
templates:
  - contextSlug: "nettezza_urbana"           # Must match pa.yml
    channelKey: "palermo-rap-twitter"        # Must match channel key
    channelType: "social"
    templates:
      - id: "cestino_pieno"
        label: "Cestino stradale pieno"
        description: "Per cestini stradali..."
        message: "Buongiorno @RapPalermo, segnalo cestino stradale pieno in {indirizzo}"
```

For `channelType: "email"`, add a `subject` field per template (used as the `mailto` subject; `message` becomes the body):

```yaml
    channelType: "email"
    templates:
      - id: "diserbo_verde"
        label: "Richiesta diserbo"
        subject: "Segnalazione erba alta in {indirizzo}"
        message: "Buongiorno, segnalo la necessità di diserbo in {indirizzo}..."
```

**Important:**
- `#PaMiSenti` hashtag is auto-appended by code (social only) - DO NOT include manually
- Use placeholders like `{indirizzo}` or `{piazza}` for user customization

## Adding Content

### Add a New Theme (Context)

1. Edit [src/data/pa.yml](src/data/pa.yml) under municipality's `contexts` array
2. Choose emoji and color from safelist
3. Add optional `helpfulLinks` (theme-specific, not city-wide)
4. Define `channels` array
5. Add templates in [src/data/templates.yml](src/data/templates.yml) if social channel exists
6. Test: `npm run dev` → verify theme appears with correct styling
7. Build test: `npm run build && npm run preview`

### Add a New City

1. Add municipality to `municipalities` array in [src/data/pa.yml](src/data/pa.yml)
2. Use ISTAT code as unique identifier
3. Add at least one context with channels
4. Optionally add message templates in [src/data/templates.yml](src/data/templates.yml)

## TypeScript Types

When adding YAML fields, update [src/lib/types.ts](src/lib/types.ts) first:

- `Municipality` - city data
- `ContextEntry` - theme/category
- `ContactChannel` - communication channel
- `MessageTemplateGroup` - template group bound to a `channelKey`/`channelType`
- `MessageTemplateItem` - individual template (`message`, optional `subject` for email)

## Deployment

GitHub Actions workflow [.github/workflows/deploy.yml](.github/workflows/deploy.yml) runs on every push to `main`:
1. Runs `npm run build`
2. Deploys to GitHub Pages from `dist/` folder

Site URL: https://aborruso.github.io/pa_mi_senti/

## External Integrations

- **Twitter/X**: `buildTwitterIntentUrl()` in [src/lib/social.ts](src/lib/social.ts) constructs intent links
- **Google Maps**: `buildGoogleMapsLink()` formats coordinates as `https://www.google.com/maps/place/{lat},{lng}`
- **Geolocation API**: `navigator.geolocation.getCurrentPosition()` with 10s timeout, high accuracy
- **Nominatim (OSM)**: `reverseGeocode()` in [src/lib/location.ts](src/lib/location.ts) — reverse geocoding (coords → street), no API key, no backend; receives only the coordinates the user chooses to attach

## Documentation References

- [README.md](README.md) - Project overview and quick start
- [TECHNICAL.md](TECHNICAL.md) - Full technical guide for developers
- [CONTRIBUIRE.md](CONTRIBUIRE.md) - Contributor guide (Italian) for adding cities/themes via YAML
- [PRD.md](PRD.md) - Product requirements document
- [ACCESSIBILITY.md](ACCESSIBILITY.md) - Accessibility improvements
- [LOG.md](LOG.md) - Running changelog (most recent entry on top, `YYYY-MM-DD` headings)
- [.github/copilot-instructions.md](.github/copilot-instructions.md) - Additional architecture details
- [openspec/AGENTS.md](openspec/AGENTS.md) - OpenSpec workflow for change proposals/specs
