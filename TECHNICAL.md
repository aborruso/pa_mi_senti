# Guida per Contributori

Questa guida è rivolta a sviluppatori e curatori che vogliono contribuire al progetto **PA Mi Senti**.

## Stack Tecnico

- **Astro 4.x** — generazione sito statico con routing file-based
- **React 18** — componenti interattivi (con idratazione selettiva)
- **TypeScript** — type safety per tutto il codebase
- **Tailwind CSS 3** — utility-first styling
- **YAML** — configurazione dati (città, temi, template)

## Requisiti di Sistema

- Node.js 20+
- npm 10+

## Setup Locale

```bash
# Clona il repository
git clone https://github.com/aborruso/pa_mi_senti.git
cd pa_mi_senti

# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev
```

Apri `http://localhost:4321` per la versione locale. Tutti i permalink (`/citta/{istat}/{tema}/...`) sono generati staticamente durante la build.

## Comandi Principali

- `npm run dev` — avvia Astro in modalità sviluppo con HMR
- `npm run build` — genera la versione statica in `dist/` (pronta per GitHub Pages)
- `npm run preview` — avvia un server che serve la build prodotta
- `npm run lint` — esegue ESLint sui file TypeScript/TSX
- `npm run format` — verifica la formattazione con Prettier

## Struttura del Progetto

```
pa_mi_senti/
├── src/
│   ├── components/      # Componenti Astro e React
│   │   ├── react/       # Componenti React idratati
│   │   └── ui/          # Componenti UI riutilizzabili
│   ├── data/            # Dati YAML
│   │   ├── pa.yml       # Città, temi e canali
│   │   └── templates.yml # Template messaggi social
│   ├── layouts/         # Layout Astro
│   ├── lib/             # Utility e funzioni helper
│   │   ├── data.ts      # Caricamento dati YAML
│   │   ├── paths.ts     # Generazione URL con base path
│   │   ├── location.ts  # Geolocalizzazione
│   │   └── social.ts    # Integrazione Twitter/X
│   ├── pages/           # Rotte (generazione statica)
│   └── styles/          # Stili globali
├── public/              # Asset statici
├── AGENTS.md            # Linee guida per AI agents
└── PRD.md               # Product Requirements Document
```

## Dati e Routing

I dati principali risiedono in:

- `src/data/pa.yml` — elenco municipalità, contesti e canali
- `src/data/templates.yml` — modelli precompilati per i canali (es. Twitter/X)

Ogni modifica ai file YAML rigenera automaticamente le rotte statiche:

- `/` — home con lista città
- `/citta/{istat}/` — elenco dei temi di una città
- `/citta/{istat}/{tema}/` — dettagli e canali per un tema
- `/citta/{istat}/{tema}/messaggi/{channelKey}/` — pagina di scelta messaggi con geolocalizzazione opzionale
- `/info/` — pagina informativa

## Come Aggiungere un Nuovo Tema

Quando aggiungi un nuovo tema di segnalazione (es. "Verde pubblico", "Trasporti", ecc.), segui questi passi:

### 1. Aggiungi il tema in `src/data/pa.yml`

Aggiungi un nuovo oggetto nell'array `contexts` della città:

```yaml
municipalities:
  - istat: "082053"
    name: "Palermo"
    contexts:
      - slug: "nome_tema"           # URL-friendly (es. "verde_pubblico")
        name: "Nome visualizzato"    # Es. "Verde Pubblico"
        description: "Breve descrizione del tema"
        emoji: "🌳"                   # Emoji rappresentativa
        color: "bg-lime-50"           # Colore di sfondo (vedi sotto)
        helpfulLinks:                 # Link utili per questo tema (opzionale)
          - label: "Nome link"
            url: "https://..."
        channels:                     # Canali di contatto
          - type: "social"            # phone, email, form, social
            label: "Nome canale"
            value: "https://twitter.com/account"
```

### 2. Scegli Emoji e Colore di Sfondo

**Emoji consigliate per tema:**

- ♻️ Igiene urbana / Rifiuti
- 🚔 Polizia / Sicurezza
- 🛣️ Strade / Manutenzione
- 🌳 Verde pubblico / Parchi
- 💡 Illuminazione pubblica
- 🚰 Acquedotto / Fontane
- 🚌 Trasporti pubblici
- 🏛️ Uffici comunali
- 📋 Documenti / Certificati
- 🚗 Veicoli / Parcheggi

**Colori di sfondo disponibili:**

I colori devono essere scelti tra quelli nella "safelist" di Tailwind (`tailwind.config.cjs`):

- `bg-emerald-50` — verde tenue (rifiuti, ambiente)
- `bg-blue-50` — blu tenue (polizia, sicurezza)
- `bg-amber-50` — ambra tenue (lavori, attenzione)
- `bg-rose-50` — rosa tenue (segnalazioni urgenti)
- `bg-violet-50` — viola tenue (cultura, eventi)
- `bg-sky-50` — azzurro tenue (acqua, servizi)
- `bg-lime-50` — lime tenue (verde pubblico)
- `bg-orange-50` — arancio tenue (strade, manutenzione)
- `bg-yellow-50` — giallo tenue (illuminazione)
- `bg-red-50` — rosso tenue (emergenze)

⚠️ **Importante:** Se vuoi usare un nuovo colore, aggiungilo prima alla `safelist` in `tailwind.config.cjs`:

```javascript
safelist: [
  'bg-emerald-50',
  'bg-blue-50',
  // ... aggiungi qui il tuo nuovo colore
  'bg-teal-50'  // esempio
],
```

### 3. Aggiungi Template Messaggi (Opzionale)

Se il tema ha un canale social con messaggi predefiniti, aggiungi i template in `src/data/templates.yml`:

```yaml
templates:
  - contextSlug: "nome_tema"          # Deve corrispondere allo slug nel pa.yml
    channelKey: "citta-servizio-twitter"
    channelType: "social"
    templates:
      - id: "problema_x"
        label: "Titolo breve"
        description: "Quando usarlo"
        message: "Buongiorno @Account, segnalo... {indirizzo}"
```

**Note sui template:**
- L'hashtag `#PaMiSenti` viene aggiunto automaticamente via codice
- I messaggi devono includere placeholder come `{indirizzo}` per indicare dove l'utente deve personalizzare
- Il campo `description` aiuta l'utente a capire quando usare quel template

### 4. Testa in Locale

```bash
npm run dev
```

Verifica che:

- Il nuovo tema appaia nella lista con emoji e colore corretto
- I link utili siano visibili nella pagina del tema
- I canali funzionino correttamente
- I template messaggi (se presenti) si aprano correttamente su Twitter/X
- La geolocalizzazione funzioni quando richiesta

### 5. Esegui Build di Test

```bash
npm run build
npm run preview
```

Controlla che:
- La build completi senza errori
- Tutte le rotte siano generate correttamente
- I permalink funzionino

### 6. Commit e Push

```bash
git add .
git commit -m "feat: aggiungi tema [nome]"
git push
```

GitHub Actions genererà automaticamente il sito aggiornato!

## Come Aggiungere una Nuova Città

Per aggiungere una nuova città oltre a Palermo:

1. Aggiungi un nuovo oggetto nell'array `municipalities` in `src/data/pa.yml`
2. Usa il codice ISTAT come identificativo unico
3. Aggiungi almeno un contesto (tema) con i relativi canali
4. Opzionalmente, aggiungi template messaggi in `templates.yml`

```yaml
municipalities:
  - istat: "058091"              # Codice ISTAT
    name: "Roma"
    contexts:
      - slug: "ama_roma"
        name: "AMA - Rifiuti"
        # ... resto della configurazione
```

## Deploy su GitHub Pages

Il workflow `/.github/workflows/deploy.yml` effettua build e deploy automatico a ogni push su `main`.

Assicurati che:
- Le GitHub Pages siano configurate su "GitHub Actions"
- Il sito sia pubblicato dalla cartella `dist/`
- La variabile `base` in `astro.config.mjs` sia corretta per il tuo repository

## Architettura Tecnica

### Generazione Statica

Astro genera tutte le rotte in fase di build tramite `getStaticPaths()`:

- Le città vengono caricate da `pa.yml`
- Per ogni città, vengono generate le pagine dei temi
- Per ogni tema, vengono generate le pagine dei canali
- Tutti i permalink sono navigabili e condivisibili

### Geolocalizzazione

Il sistema offre 3 opzioni per aggiungere coordinate al messaggio:

**1. GPS Automatico**
- Usa `requestCurrentPosition()` da `src/lib/location.ts`
- API `navigator.geolocation` con timeout 10s e alta precisione
- Appende link Google Maps con `appendLocationLinkFromCoords()`

**2. Scegli su Mappa** (Release 2)
- Componente `MapPickerModal.tsx` con MapLibre GL (~260KB gzipped)
- Tiles OpenStreetMap (no API key, privacy-first)
- Lazy loading via `src/lib/map-loader.ts` (caricato solo se richiesto)
- Marker draggable, button GPS integrato, display coordinate live
- All'apertura richiede automaticamente GPS per centrare mappa (fallback: centro Italia)

**3. Nessuna Posizione**
- Invia messaggio senza coordinate

Implementazione:
- Dialog personalizzato React (NOT browser `confirm()`)
- `flushSync()` per commit immediato state prima di aprire Twitter
- Link formato: `https://www.google.com/maps/place/{lat},{lng}`

### Hashtag Automatico

L'hashtag `#PaMiSenti` viene aggiunto automaticamente dal componente `TemplatePicker.tsx` solo ai template precompilati (non ai messaggi liberi).

## Linee Guida per il Codice

- **TypeScript**: usa i tipi definiti in `src/lib/types.ts`
- **Componenti React**: usa idratazione selettiva (`client:load` solo quando necessario)
- **Path helper**: usa sempre le funzioni in `src/lib/paths.ts` per i link (compatibilità dev/prod)
- **Tailwind**: usa le utility CSS, aggiungi nuovi colori alla safelist se necessario
- **YAML**: mantieni coerenza con gli esempi esistenti

## Note Tecniche

- Gli **emoji** vengono mostrati accanto al titolo del tema
- I **colori di sfondo** rendono le card visivamente distinguibili
- Gli **helpfulLinks** sono specifici per tema, non per città
- Lo **slug** deve essere unico all'interno della stessa città
- Il **base path** è configurabile via `ASTRO_BASE` env var (dev: `/`, prod: `/pa_mi_senti/`)

## Domande?

Apri una [issue su GitHub](https://github.com/aborruso/pa_mi_senti/issues) per qualsiasi domanda o suggerimento!
