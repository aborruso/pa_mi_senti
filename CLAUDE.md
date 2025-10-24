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

# Lint TypeScript/TSX files
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
  - Auto-appends `#PaMiSenti` hashtag to template messages (NOT to custom messages)
  - Builds Twitter/X intent URLs with optional Google Maps coordinates

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

Use `snake_case` for slugs/keys (URL-friendly):

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

- Uses **custom React dialog** with Italian labels ("Sì, aggiungi posizione" / "No, grazie")
- NEVER use browser's native `window.confirm()` which shows "OK"/"Cancel"
- Implementation: [src/lib/location.ts](src/lib/location.ts) + state in [TemplatePicker.tsx](src/components/react/TemplatePicker.tsx)
- Timeout: 10 seconds, high accuracy enabled

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

**Important:**
- `#PaMiSenti` hashtag is auto-appended by code - DO NOT include manually
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
- `MessageTemplateGroup` - social message templates
- `MessageTemplateItem` - individual template

## Deployment

GitHub Actions workflow [.github/workflows/deploy.yml](.github/workflows/deploy.yml) runs on every push to `main`:
1. Runs `npm run build`
2. Deploys to GitHub Pages from `dist/` folder

Site URL: https://aborruso.github.io/pa_mi_senti/

## External Integrations

- **Twitter/X**: `buildTwitterIntentUrl()` in [src/lib/social.ts](src/lib/social.ts) constructs intent links
- **Google Maps**: `buildGoogleMapsLink()` formats coordinates as `https://www.google.com/maps/place/{lat},{lng}`
- **Geolocation API**: `navigator.geolocation.getCurrentPosition()` with 10s timeout, high accuracy

## Documentation References

- [README.md](README.md) - Project overview and quick start
- [TECHNICAL.md](TECHNICAL.md) - Full technical guide for developers
- [PRD.md](PRD.md) - Product requirements document
- [ACCESSIBILITY.md](ACCESSIBILITY.md) - Accessibility improvements
- [.github/copilot-instructions.md](.github/copilot-instructions.md) - Additional architecture details
