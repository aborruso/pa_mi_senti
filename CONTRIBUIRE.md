# Come Contribuire a PA Mi Senti

Questo documento spiega la logica del progetto, la struttura dei dati e come proporre aggiunte.

## Sommario

- [La Filosofia del Progetto](#la-filosofia-del-progetto)
- [Come Funziona](#come-funziona)
- [Struttura dei Dati](#struttura-dei-dati)
- [Geolocalizzazione](#geolocalizzazione)
- [Come Proporre un'Aggiunta](#come-proporre-unaggiunta)

---

## La Filosofia del Progetto

**PA Mi Senti** è costruito su questi principi:

- Non devi creare account o autenticarti. Ti identifichi solo quando contatti la PA attraverso il canale che scegli (tweet dal tuo account, email, telefonata).
- Vuoi allegare foto, video o documenti? Lo fai direttamente nella piattaforma che usi (Twitter/X, email, ecc.). Il servizio non gestisce contenuti multimediali.
- Template precompilati per le segnalazioni più comuni (es. a Palermo la RAP risponde ai tweet, quindi trovi messaggi già pronti per cestini pieni, abbandoni, mancato spazzamento).
- Se usi Twitter/X o email con template, puoi scegliere di includere la tua posizione nel messaggio, rendendo più facile l'intervento. È sempre una tua scelta.
- Aggiungere nuove città, temi o canali richiede solo la modifica di file di configurazione YAML. Chiunque può contribuire.
- PA Mi Senti non raccoglie dati personali. Non ci sono registrazioni, cookie di tracciamento o database. La localizzazione è facoltativa e richiede il tuo consenso esplicito ogni volta.

---

## Come Funziona

### Flusso utente

1. **Scegli la città** (al momento solo Palermo)
2. **Scegli un tema** (es. Igiene urbana, Polizia Municipale, Manutenzione strade)
3. **Scegli un canale** (es. Twitter/X, email, telefono)
4. **Se il canale ha messaggi precompilati**:
   - Scegli un template o scrivi un messaggio libero
   - **Ti viene SEMPRE chiesto** se vuoi aggiungere la tua posizione attuale
   - Se accetti, viene aggiunto un link a Google Maps con le coordinate GPS
   - Il messaggio si apre in Twitter/X o nel tuo client email, pronto da personalizzare e inviare

### Flusso tecnico

Il sito è **completamente statico** (generato con Astro). Non c'è backend, non ci sono API, non ci sono database.

1. I dati provengono da due file YAML:
   - `src/data/pa.yml` - città, temi, canali di contatto
   - `src/data/templates.yml` - messaggi precompilati per social e email

2. Al build time, Astro legge questi file e genera tutte le pagine HTML statiche

3. L'unica interattività JavaScript è nel componente React `TemplatePicker.tsx` che:
   - Mostra i template disponibili
   - Gestisce il dialog di consenso per la geolocalizzazione
   - Apre Twitter/X o l'email con il messaggio compilato

---

## Struttura dei Dati

### File `src/data/pa.yml`

Questo file contiene le informazioni su città, temi e canali di contatto.

#### Struttura base

```yaml
updatedAt: "2024-08-01"  # Data ultimo aggiornamento
municipalities:           # Lista delle città
  - istat: "082053"      # Codice ISTAT univoco
    name: "Palermo"      # Nome visualizzato
    region: "Sicilia"    # Regione
    population: 637885   # Abitanti
    contexts:            # Temi/categorie per questa città
      - slug: "nettezza_urbana"           # URL slug (snake_case)
        name: "Igiene urbana"             # Nome visualizzato
        description: "Segnala rifiuti..." # Descrizione breve
        emoji: "♻️"                        # Emoji rappresentativa
        color: "bg-emerald-50"            # Colore Tailwind (deve essere in safelist)
        helpfulLinks:                     # Link utili per questo tema
          - label: "Sito RAP Palermo"
            url: "https://www.rapspa.it/"
        channels:                         # Canali di contatto per questo tema
          - type: "social"                # Tipo: social, email, phone, form
            key: "palermo-rap-twitter"    # Chiave univoca (auto-generata se omessa)
            platform: "twitter"           # Solo per social
            label: "Twitter/X RAP Palermo"
            value: "https://twitter.com/RapPalermo"  # URL profilo o indirizzo
            notes: "Account ufficiale di RAP S.p.A."
```

#### Campi obbligatori per `municipality`

- `istat` - Codice ISTAT univoco (6 cifre)
- `name` - Nome del comune
- `region` - Regione di appartenenza
- `population` - Numero abitanti
- `contexts` - Almeno un tema

#### Campi obbligatori per `context`

- `slug` - URL slug in `snake_case` (es. `nettezza_urbana`)
- `name` - Nome visualizzato (es. "Igiene urbana")
- `description` - Descrizione breve
- `emoji` - Emoji rappresentativa
- `color` - Colore Tailwind (es. `bg-emerald-50`) **deve essere in safelist**
- `channels` - Almeno un canale

#### Campi obbligatori per `channel`

- `type` - Uno tra: `social`, `email`, `phone`, `form`
- `label` - Nome visualizzato
- `value` - URL (per social/form), indirizzo email, numero di telefono

#### Campi opzionali per `channel`

- `key` - Chiave univoca (se omessa viene auto-generata da città+tema+type)
- `platform` - Solo per `type: social` (es. `twitter`, `facebook`)
- `notes` - Note aggiuntive visualizzate all'utente

#### Colori disponibili (safelist Tailwind)

Se aggiungi un nuovo colore per un tema, **devi aggiungerlo alla safelist** in `tailwind.config.cjs`:

```javascript
safelist: [
  'bg-emerald-50',  // ambiente, rifiuti
  'bg-blue-50',     // polizia, sicurezza
  'bg-yellow-50',   // manutenzione strade
  'bg-orange-50',   // illuminazione
  'bg-red-50',      // veicoli abbandonati, urgenze
  'bg-sky-50',      // acqua, fognature
  // ... aggiungi nuovi colori qui
]
```

---

### File `src/data/templates.yml`

Questo file contiene i **messaggi precompilati** per canali social ed email.

#### Struttura base

```yaml
templates:
  - contextSlug: "nettezza_urbana"           # Deve corrispondere allo slug in pa.yml
    channelKey: "palermo-rap-twitter"        # Deve corrispondere alla key del channel
    channelType: "social"                    # Deve corrispondere al type del channel
    templates:                               # Lista di template per questo canale
      - id: "rifiuti_abbandonati"            # ID univoco (snake_case)
        label: "Abbandono di rifiuti"        # Nome visualizzato
        description: "Per cumuli di rifiuti in strada..."
        message: "Buongiorno @RapPalermo, segnalo un abbandono di rifiuti in {indirizzo}. Potete intervenire? Grazie!"
```

#### Campi obbligatori per `template` (social)

- `id` - ID univoco in `snake_case`
- `label` - Nome visualizzato
- `description` - Quando usare questo template
- `message` - Testo del messaggio

#### Campi obbligatori per `template` (email)

- `id` - ID univoco in `snake_case`
- `label` - Nome visualizzato
- `description` - Quando usare questo template
- `subject` - Oggetto dell'email
- `message` - Corpo dell'email (può essere multilinea con `|`)

#### Placeholder nei messaggi

Puoi usare placeholder nel messaggio per personalizzazione:
- `{indirizzo}` - L'utente deve sostituire con l'indirizzo
- `{piazza}` - L'utente deve sostituire con il nome della piazza
- `{descrizione}` - L'utente deve sostituire con una descrizione

**IMPORTANTE**: L'hashtag `#PaMiSenti` viene aggiunto **automaticamente** dal codice ai messaggi social precompilati. **Non includerlo manualmente** nel template.

#### Esempio template email

```yaml
- contextSlug: "acqua_e_fognature"
  channelKey: "palermo-acqua-email"
  channelType: "email"
  templates:
    - id: "tombino_otturato"
      label: "Tombino otturato"
      description: "Per segnalare tombini o caditoie bloccati."
      subject: "Segnalazione tombino otturato in {indirizzo}"
      message: |
        Questo tombino è otturato, allego coordinate geografiche e foto.
        Intervenire gentilmente prima che arrivi la prossima bomba d'acqua.

        Grazie.
```

---

## Geolocalizzazione

### Quando viene richiesta

**SEMPRE** quando l'utente clicca su un template (sia social che email).

### Come funziona

1. L'utente clicca su "Usa questo messaggio" o "Scrivi email"
2. **Si apre un dialog personalizzato** con la domanda:
   > "Vuoi aggiungere un link con la tua posizione?"
3. L'utente può scegliere:
   - **"Sì, aggiungi posizione"** → Viene richiesto il permesso GPS al browser
   - **"No, grazie"** → Il messaggio viene aperto senza coordinate

### Privacy e consenso

- Il consenso è **esplicito** ogni volta (non viene memorizzato)
- Non usiamo il dialog nativo del browser (`confirm()`), ma un **dialog React personalizzato**
- Il permesso GPS viene richiesto dal browser **solo se** l'utente clicca "Sì, aggiungi posizione"
- La posizione **non viene mai memorizzata** o inviata a server
- Il link a Google Maps viene aggiunto solo al messaggio che l'utente sta per inviare

### Formato coordinate

Se l'utente accetta, viene aggiunto al messaggio:

```
https://www.google.com/maps/place/38.115688,13.361267
```

Per le email, il link viene separato dal corpo con una riga vuota per leggibilità.

---

## Come Proporre un'Aggiunta

### 1

**Requisiti**:
- Almeno un tema (context) con almeno un canale
- Codice ISTAT corretto
- Verifica che i canali di contatto siano ufficiali e funzionanti

**Procedura**:
1. Apri una [issue su GitHub](https://github.com/aborruso/pa_mi_senti/issues) con il titolo: `Nuova città: [Nome]`
2. Nel corpo dell'issue, fornisci:
   - Codice ISTAT
   - Nome città e regione
   - Numero abitanti (approssimativo va bene)
   - Almeno un tema con i canali di contatto ufficiali
   - (Opzionale) Link ai siti istituzionali per verifica

**Esempio issue**:
```markdown
## Città: Catania
- ISTAT: 087015
- Regione: Sicilia
- Abitanti: ~310.000

### Tema proposto: Igiene urbana
- Canale: Email a servizi.ambientali@comune.catania.it
- Fonte: https://www.comune.catania.it/servizi/

### Tema proposto: Polizia Municipale
- Canale: Twitter @PoliziaCatania
- Canale: Telefono 095 XXX XXX
```

### 2

**Requisiti**:
- Almeno un canale di contatto ufficiale e funzionante
- Verificare che il canale risponda effettivamente alle segnalazioni

**Procedura**:
1. Apri una [issue su GitHub](https://github.com/aborruso/pa_mi_senti/issues) con il titolo: `Nuovo tema per [Città]: [Nome tema]`
2. Nel corpo dell'issue, fornisci:
   - Slug del tema (es. `verde_pubblico`)
   - Nome visualizzato (es. "Verde pubblico e parchi")
   - Descrizione breve
   - Emoji suggerita
   - Colore Tailwind suggerito (vedi safelist)
   - Canali di contatto con URL/email/telefono
   - (Opzionale) Link utili correlati al tema

**Esempio issue**:
```markdown
## Nuovo tema per Palermo: Verde pubblico

- Slug: `verde_pubblico`
- Nome: "Verde pubblico e parchi"
- Descrizione: "Per segnalare problemi con aiuole, alberi, parchi e aree verdi"
- Emoji: 🌳
- Colore: `bg-green-50`

### Canali:
- Email: verde.pubblico@comune.palermo.it
- Telefono: 091 XXX XXX

### Link utili:
- https://www.comune.palermo.it/verde-pubblico
```

### 3

**Requisiti**:
- Devono esistere già il tema e il canale in `pa.yml`
- Il canale deve essere di tipo `social` o `email`
- Il messaggio deve essere cortese, chiaro e sintetico

**Procedura**:
1. Apri una [issue su GitHub](https://github.com/aborruso/pa_mi_senti/issues) con il titolo: `Nuovi template per [Città] - [Tema]`
2. Nel corpo dell'issue, fornisci:
   - `contextSlug` e `channelKey` a cui si riferiscono
   - Tipo di canale (`social` o `email`)
   - Per ogni template: id, label, description, message (e subject se email)

**Esempio issue**:
```markdown
## Nuovi template per Palermo - Polizia Municipale

- Context: `polizia_municipale`
- Channel: `palermo-vigili-twitter`
- Type: `social`

### Template 1: Auto in doppia fila
- ID: `auto_doppia_fila`
- Label: "Auto in doppia fila"
- Description: "Per segnalare autoveicoli in sosta vietata in doppia fila"
- Message: "Buongiorno @PALERMOPM, segnalo auto in doppia fila in {indirizzo} che blocca la circolazione. Potete intervenire? Grazie!"

### Template 2: Semaforo guasto
- ID: `semaforo_guasto`
- Label: "Semaforo non funzionante"
- Description: "Per segnalare semafori spenti o malfunzionanti"
- Message: "Buongiorno @PALERMOPM, segnalo semaforo non funzionante in {incrocio}. Potete verificare? Grazie!"
```

**NON includere `#PaMiSenti` nei template** - viene aggiunto automaticamente dal codice.

### 4

**Requisiti**:
- Il tema deve esistere in `pa.yml`
- Il canale deve essere ufficiale e verificato

**Procedura**:
1. Apri una [issue su GitHub](https://github.com/aborruso/pa_mi_senti/issues) con il titolo: `Nuovo canale per [Città] - [Tema]`
2. Nel corpo dell'issue, fornisci:
   - Slug del tema esistente
   - Tipo di canale (`social`, `email`, `phone`, `form`)
   - Label e value (URL, email, telefono)
   - Note opzionali

**Esempio issue**:
```markdown
## Nuovo canale per Palermo - Igiene urbana

- Tema: `nettezza_urbana`
- Tipo: `phone`
- Label: "RAP Whatsapp"
- Value: "+39 091 XXX XXXX"
- Note: "Servizio attivo dal lunedì al venerdì, 9-18"
```

---

## Verifica prima di proporre

Prima di aprire una issue, verifica:

1. **Ufficialità**: I canali devono essere ufficiali della PA o di società partecipate
2. **Funzionamento**: Il canale risponde effettivamente alle segnalazioni
3. **Duplicati**: Cerca nelle issue esistenti se qualcuno ha già proposto la stessa aggiunta
4. **Completezza**: Fornisci tutte le informazioni richieste nella sezione corrispondente

---

## Tempistiche

Una volta aperta la issue:
1. Verrà valutata la proposta (verifiche su ufficialità e funzionamento)
2. Se approvata, verrà integrata nel codice
3. Il sito viene aggiornato automaticamente ad ogni push su `main`

**Grazie per contribuire a PA Mi Senti!** 🚀
