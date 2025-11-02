# Spec: privacy-disclosure

## Overview
Fornisce contenuto minimale ma completo per Privacy Policy e Disclaimer, comunicando trasparenza su trattamento dati (nessuno) e responsabilità contatti PA (verificati ma non garantiti).

## ADDED Requirements

### Requirement: Privacy Policy declares zero data collection
Privacy Policy MUST dichiarare esplicitamente che il sito non raccoglie dati personali, non usa cookie di tracking, non richiede registrazione.

#### Scenario: Privacy page explains geolocation opt-in
- **Given** l'utente visita `/privacy/`
- **When** legge la sezione "Geolocalizzazione"
- **Then** il contenuto spiega che GPS è opzionale e richiede consenso esplicito
- **And** menziona che MapLibre usa tile OpenStreetMap ma nessun dato viene salvato sul server
- **And** chiarisce che coordinate vengono solo allegate a messaggio social/email, non archiviate da PA Mi Senti

#### Scenario: Privacy page lists external links and third parties
- **Given** l'utente visita `/privacy/`
- **When** legge la sezione "Link esterni"
- **Then** il contenuto menziona link a siti PA, Twitter/X intent, Google Maps, tile OpenStreetMap
- **And** spiega che dati condivisi con PA dipendono dal canale scelto (Twitter, email, telefono)
- **And** dichiara che PA Mi Senti non ha controllo su politiche privacy di terze parti

#### Scenario: Privacy page mentions GitHub Pages logging
- **Given** l'utente visita `/privacy/`
- **When** legge fino alla fine
- **Then** trova nota su hosting GitHub Pages che può loggare IP per sicurezza (fuori controllo del progetto)
- **And** link a GitHub Pages privacy policy per dettagli

### Requirement: Disclaimer clarifies verification and liability limits
Disclaimer MUST dichiarare che contatti PA sono verificati manualmente ma senza garanzie, invitando a verificare su siti ufficiali.

#### Scenario: Disclaimer explains contact verification process
- **Given** l'utente visita `/disclaimer/`
- **When** legge la sezione "Verifica contatti"
- **Then** il contenuto spiega che contatti (telefono, email, social) sono verificati manualmente da contributori
- **And** include data ultimo aggiornamento (campo `updatedAt` in `pa.yml`)
- **And** invita a verificare contatti su siti istituzionali PA in caso di dubbi

#### Scenario: Disclaimer excludes liability for inaccurate info
- **Given** l'utente visita `/disclaimer/`
- **When** legge la sezione "Responsabilità"
- **Then** il contenuto dichiara che progetto non garantisce accuratezza/completezza contatti
- **And** esclude responsabilità per eventuali errori o modifiche non aggiornate
- **And** incoraggia segnalazione errori tramite GitHub issue

### Requirement: Legal pages use simple non-legalese language
Contenuto Privacy e Disclaimer SHALL usare linguaggio diretto, conciso, evitando termini legali complessi per massima accessibilità.

#### Scenario: Privacy uses plain Italian
- **Given** l'utente con scolarità media visita `/privacy/`
- **When** legge il contenuto
- **Then** comprende immediatamente politiche senza bisogno di consulenza legale
- **And** frasi brevi (max 20-25 parole), paragrafi corti, niente clausole annidate

#### Scenario: Disclaimer avoids ambiguous terms
- **Given** l'utente visita `/disclaimer/`
- **When** legge disclaimer
- **Then** limitazioni responsabilità sono chiare e dirette
- **And** nessuna ambiguità su cosa il progetto garantisce (verifica manuale) e cosa no (accuratezza assoluta)

## Relationships
- **Depends on**: `legal-navigation` (routing e path helper)
- **Required by**: nessuna spec (terminale)
