# Proposal: add-legal-pages

## Summary
Aggiunge pagine legali (Privacy Policy e Disclaimer) accessibili tramite footer del sito per comunicare trasparenza su trattamento dati e responsabilità sui contatti PA.

## Motivation
Prima del lancio pubblico serve dichiarazione esplicita su:
- Privacy: nessun tracking, geolocalizzazione opzionale, niente cookie
- Disclaimer: contatti PA verificati ma non garantiti, nessuna responsabilità su accuratezza

Anche senza raccolta dati, trasparenza esplicita migliora fiducia utenti e conformità normativa.

## User Impact
- Cittadini possono consultare politiche privacy/disclaimer prima di usare il sito
- Link visibili in footer di ogni pagina
- Contenuto minimale ma completo: "zero tracking, GPS opzionale, verifica contatti PA"

## Technical Approach
1. Due file Markdown (`privacy.md`, `disclaimer.md`) in `src/pages/` con layout `MarkdownLayout.astro`
2. Helper `buildPrivacyPath()` e `buildDisclaimerPath()` in `src/lib/paths.ts`
3. Footer in `BaseLayout.astro` aggiunge link separati: "Privacy | Disclaimer"
4. Contenuto Privacy copre: geolocalizzazione GPS/mappa, niente cookie/tracking, link esterni (PA, Twitter/X, MapLibre tiles)
5. Contenuto Disclaimer: contatti verificati manualmente, nessuna garanzia, verificare su siti PA ufficiali

## Dependencies
Nessuna dipendenza esterna. Modifica solo:
- `src/pages/privacy.md` (nuovo)
- `src/pages/disclaimer.md` (nuovo)
- `src/lib/paths.ts` (2 helper)
- `src/layouts/BaseLayout.astro` (footer links)

## Alternatives Considered
- **Pagina unica "Termini e Privacy"**: respinto, preferiti link separati per chiarezza
- **File Astro invece di Markdown**: respinto, markdown più semplice da manutenere
- **Footer inline con testo esistente**: respinto, link separati più visibili

## Open Questions
Nessuna. Scelte confermate:
- Link separati nel footer
- File Markdown
- Privacy include solo geolocalizzazione dettagliata
