# PA Mi Senti (Astro)

Sito statico generato con Astro che aiuta i cittadini a trovare rapidamente il canale giusto per contattare la Pubblica Amministrazione in base al tema della segnalazione. Ogni rotta viene pre-renderizzata per funzionare anche con URL condivisi direttamente (es. `https://aborruso.github.io/citta/082053/...`).

## Requisiti

- Node.js 20+
- npm 10+

## Avvio rapido

```bash
npm install
npm run dev
```

Apri `http://localhost:4321` per la versione locale. Tutti i permalink (`/citta/{istat}/{tema}/...`) sono generati staticamente durante la build.

## Comandi principali

- `npm run dev` — avvia Astro in modalità sviluppo con HMR.
- `npm run build` — genera la versione statica in `dist/` (pronta per GitHub Pages).
- `npm run preview` — avvia un server che serve la build prodotta.
- `npm run lint` — esegue ESLint sui file TypeScript/TSX.
- `npm run format` — verifica la formattazione con Prettier.

## Dati e modelli

I dati principali risiedono in:

- `src/data/pa.yml` — elenco municipalità, contesti e canali.
- `src/data/templates.yml` — modelli precompilati per i canali (es. Twitter/X).

Ogni modifica ai file YAML rigenera automaticamente le rotte statiche:

- `/citta/{istat}/` — elenco dei temi di una città.
- `/citta/{istat}/{tema}/` — dettagli e canali per un tema.
- `/citta/{istat}/{tema}/messaggi/{channelKey}/` — pagina di scelta dei messaggi con possibilità di allegare la posizione corrente.

## Deploy su GitHub Pages

Il workflow `/.github/workflows/deploy.yml` effettua build e deploy automatico a ogni push su `main`. Assicurati che le GitHub Pages siano configurate su "GitHub Actions" e che il sito sia pubblicato da `dist/`.

## Guida per curatori del sito

### Come aggiungere un nuovo tema (contesto)

Quando aggiungi un nuovo tema di segnalazione (es. "Strade", "Verde pubblico", ecc.), segui questi passi:

#### 1. Aggiungi il tema in `src/data/pa.yml`

Aggiungi un nuovo oggetto nell'array `contexts` della città:

```yaml
municipalities:
  - istat: "082053"
    name: "Palermo"
    contexts:
      - slug: "nome_tema"           # URL-friendly (es. "strade_buche")
        name: "Nome visualizzato"    # Es. "Strade e buche"
        description: "Breve descrizione del tema"
        emoji: "🚧"                   # Emoji rappresentativa
        color: "bg-orange-50"         # Colore di sfondo (vedi sotto)
        helpfulLinks:                 # Link utili per questo tema (opzionale)
          - label: "Nome link"
            url: "https://..."
        channels:                     # Canali di contatto
          - type: "social"            # phone, email, form, social
            label: "Nome canale"
            value: "..."
```

#### 2. Scegli emoji e colore di sfondo

**Emoji consigliate per tema:**

- ♻️ Igiene urbana / Rifiuti
- 🚔 Polizia / Sicurezza
- 🚧 Strade / Lavori
- 🌳 Verde pubblico / Parchi
- 💡 Illuminazione pubblica
- 🚰 Acquedotto / Fontane
- 🚌 Trasporti pubblici
- 🏛️ Uffici comunali
- 📋 Documenti / Certificati

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

⚠️ **Importante:** Se vuoi usare un nuovo colore, aggiungilo prima alla `safelist` in `tailwind.config.cjs`:

```javascript
safelist: [
  'bg-emerald-50',
  'bg-blue-50',
  // ... aggiungi qui il tuo nuovo colore
  'bg-teal-50'  // esempio
],
```

#### 3. Aggiungi template messaggi (opzionale)

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

#### 4. Testa in locale

```bash
npm run dev
```

Verifica che:

- Il nuovo tema appaia nella lista con emoji e colore corretto
- I link utili siano visibili nella pagina del tema
- I canali funzionino correttamente

#### 5. Commit e push

```bash
git add .
git commit -m "feat: aggiungi tema [nome]"
git push
```

GitHub Actions genererà automaticamente il sito aggiornato!

### Note tecniche

- Gli **emoji** vengono mostrati accanto al titolo del tema
- I **colori di sfondo** rendono le card visivamente distinguibili
- Gli **helpfulLinks** sono specifici per tema, non per città
- Lo **slug** deve essere unico all'interno della stessa città
