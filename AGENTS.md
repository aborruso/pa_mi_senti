# Repository Guidelines

Questo progetto usa Astro per generare un sito statico con permalink tematici per la Pubblica Amministrazione. Ogni contributo deve preservare la generazione statica delle rotte (`/citta/{istat}/...`) e l’esperienza di invio rapido dei messaggi social con modello e geolocalizzazione opzionale.

## Project Structure & Module Organization
- Configurazioni principali nella root: `astro.config.mjs`, `package.json`, `tailwind.config.cjs`, `postcss.config.cjs`.
- I dati YAML risiedono in `src/data/` e vengono caricati tramite helper in `src/lib/data.ts`.
- Le pagine Astro sono in `src/pages/`; le rotte dinamiche (`[istat]`, `[context]`, `[channelKey]`) generano HTML statico via `getStaticPaths`.
- Componenti React idratati solo quando servono (es. `TemplatePicker.tsx`) vivono in `src/components/react/`.
- Utility condivise (tipi, path builder, geolocalizzazione) in `src/lib/`.

## Build, Test, and Development Commands
- `npm run dev` avvia Astro con HMR su `localhost:4321`.
- `npm run build` esegue `astro build` e genera `dist/`.
- `npm run preview` serve la build statica.
- `npm run lint` (ESLint + @typescript-eslint) e `npm run format` (Prettier) per garantire consistenza.

## Coding Style & Naming Conventions
- TypeScript/TSX con ESLint `plugin:@typescript-eslint/recommended`.
- Astro files `.astro` organizzati con frontmatter minimale; preferisci `client:load` solo per componenti interattivi.
- Tailwind CSS per lo styling; mantieni palette brand in `tailwind.config.cjs`.
- Slug e chiavi in YAML restano `snake_case` per coerenza con i permalink.

## Testing Guidelines
- Non è configurata una suite automatica; quando aggiungi logica complessa, valuta test end-to-end o unitari in un branch separato prima del merge.
- Verifica manuale delle rotte generate (`npm run build && npm run preview`) quando modifichi la generazione dei path o i dati YAML.

## Commit & Pull Request Guidelines
- Usa Conventional Commits (`feat:`, `fix:`, `chore:`) per mantenere lo storico leggibile.
- PR brevi con descrizione di cosa è cambiato, link ai ticket rilevanti e screenshot/recording se impatti UI.
- Conferma di aver eseguito `npm run lint` e `npm run build` nelle note della PR.
