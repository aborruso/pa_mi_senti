# Tasks: add-legal-pages

## Implementation Order

1. **Aggiungi helper path per pagine legali**
   - Apri `src/lib/paths.ts`
   - Aggiungi `buildPrivacyPath()` e `buildDisclaimerPath()` seguendo pattern `buildInfoPath()`
   - Verifica: import e chiamata funzionano in test locale

2. **Crea pagina Privacy Policy**
   - Crea `src/pages/privacy.md` con frontmatter `layout: ../layouts/MarkdownLayout.astro`
   - Sezioni: Cos'è, Niente tracking, Geolocalizzazione GPS/mappa, Link esterni, Hosting GitHub Pages
   - Linguaggio: diretto, conciso, evita gergo legale
   - Verifica: build genera `/privacy/index.html`, rendering corretto

3. **Crea pagina Disclaimer**
   - Crea `src/pages/disclaimer.md` con frontmatter `layout: ../layouts/MarkdownLayout.astro`
   - Sezioni: Responsabilità contenuti, Verifica contatti PA, Nessuna garanzia accuratezza
   - Linguaggio: chiaro, nessuna ambiguità
   - Verifica: build genera `/disclaimer/index.html`, rendering corretto

4. **Aggiungi link footer in BaseLayout**
   - Apri `src/layouts/BaseLayout.astro`
   - Modifica `<footer>` aggiungendo link "Privacy" e "Disclaimer" separati da pipe
   - Usa helper `buildPrivacyPath()` e `buildDisclaimerPath()`
   - Styling: coerente con link esistenti (testo piccolo, colore slate-500, hover/focus)
   - Verifica: link visibili in footer di tutte le pagine (home, città, temi, messaggi)

5. **Test integrazione completa**
   - Run `npm run build` verifica successo
   - Verifica permalink generati: `/privacy/`, `/disclaimer/`
   - Naviga manualmente a tutte le pagine e clicca link footer
   - Verifica accessibilità: focus visibile, screen reader annuncia link
   - Verifica mobile: footer leggibile, link tappabili

## Validation

- [x] Build completa senza errori
- [x] Footer mostra "Privacy | Disclaimer" su tutte le pagine
- [x] Link portano a pagine corrette con contenuto leggibile
- [x] Path helper in `paths.ts` seguono convenzioni esistenti
- [x] Focus states applicati a nuovi link
- [x] Contenuto Privacy menziona: geolocalizzazione, niente tracking, link esterni
- [x] Contenuto Disclaimer menziona: verifica contatti, nessuna garanzia

## Notes

- Nessun design.md necessario: pattern già consolidato (vedi `info.md`)
- Nessuna breaking change: aggiunta pura, niente modifica routing esistente
- Footer layout mantiene semplicità: una riga, centrato, link + testo esistente
