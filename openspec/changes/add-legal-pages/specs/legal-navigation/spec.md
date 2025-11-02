# Spec: legal-navigation

## Overview
Espone pagine Privacy Policy e Disclaimer tramite link statici in footer, utilizzando path helper coerenti con navigazione esistente.

## ADDED Requirements

### Requirement: Expose privacy and disclaimer static routes
Il sistema SHALL generare rotte statiche `/privacy/` e `/disclaimer/` accessibili da footer di ogni pagina.

#### Scenario: Build generates legal page routes
- **Given** i file `src/pages/privacy.md` e `src/pages/disclaimer.md` esistono con frontmatter `layout: ../layouts/MarkdownLayout.astro`
- **When** viene eseguito `npm run build`
- **Then** vengono generate le pagine `/privacy/index.html` e `/disclaimer/index.html` in `dist/`
- **And** le pagine usano `MarkdownLayout` come `info.md`

#### Scenario: Footer displays legal links on all pages
- **Given** l'utente visita una qualsiasi pagina del sito (home, città, tema, messaggi)
- **When** scrolla fino al footer
- **Then** vede link "Privacy" e "Disclaimer" separati da pipe o spazio
- **And** i link sono stilizzati coerentemente con il footer esistente (text-xs, text-slate-500, hover/focus)

### Requirement: Path helpers follow existing conventions
Path helper per pagine legali MUST seguire pattern `buildInfoPath()` e gestire base path dinamico.

#### Scenario: buildPrivacyPath returns correct path
- **Given** `ASTRO_BASE=/pa_mi_senti/` in produzione
- **When** `buildPrivacyPath()` viene chiamato
- **Then** ritorna `/pa_mi_senti/privacy/`
- **And** in sviluppo (`ASTRO_BASE=/`) ritorna `/privacy/`

#### Scenario: buildDisclaimerPath returns correct path
- **Given** `ASTRO_BASE=/pa_mi_senti/` in produzione
- **When** `buildDisclaimerPath()` viene chiamato
- **Then** ritorna `/pa_mi_senti/disclaimer/`
- **And** in sviluppo (`ASTRO_BASE=/`) ritorna `/disclaimer/`

## Relationships
- **Depends on**: nessuna spec (usa infrastruttura esistente)
- **Required by**: `privacy-disclosure` (contenuto pagine)
