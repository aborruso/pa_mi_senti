# PA Mi Senti

**PA Mi Senti** è uno strumento che facilita la comunicazione tra cittadini e Pubblica Amministrazione, rendendo semplice e veloce trovare il canale giusto per fare segnalazioni e richieste.

> 🌐 **Sito del progetto**: [aborruso.github.io/pa_mi_senti](https://aborruso.github.io/pa_mi_senti/)

## 🎯 Cos'è e a cosa serve

Hai mai avuto bisogno di segnalare rifiuti abbandonati, un parcheggio selvaggio o una buca in strada? **PA Mi Senti** ti aiuta a:

- 🔍 **Trovare rapidamente** il canale giusto per la tua segnalazione
- 📝 **Usare messaggi precompilati** per Twitter/X (es. per segnalazioni alla RAP di Palermo)
- 📍 **Aggiungere la tua posizione** al messaggio (opzionale)
- 🔗 **Condividere link diretti** a temi specifici con amici e familiari

## 🏙️ Città Supportate

Al momento è disponibile:

- **Palermo** — con 5 temi: Igiene urbana, Polizia Municipale, Manutenzione strade, Illuminazione pubblica, Veicoli abbandonati

Vuoi aggiungere la tua città? [Apri una issue!](https://github.com/aborruso/pa_mi_senti/issues)

## 💡 Filosofia del Progetto

PA Mi Senti è costruito su principi semplici e chiari:

- **Nessuna registrazione** — non serve creare account. Ti identifichi solo quando contatti la PA attraverso il canale che scegli (tweet, email, telefonata)
- **Delega alle piattaforme** — vuoi allegare foto o video? Lo fai direttamente su Twitter/X, email, ecc. Il servizio non gestisce contenuti multimediali
- **Messaggi pronti all'uso** — template precompilati per le segnalazioni più comuni (es. cestini pieni, abbandoni rifiuti, parcheggi irregolari)
- **Geolocalizzazione opzionale** — puoi includere un link con la tua posizione per facilitare l'intervento. È sempre una tua scelta
- **Privacy first** — zero cookie di tracciamento, zero database, zero raccolta dati. Il servizio è solo un facilitatore
- **Open source e facile da estendere** — chiunque può contribuire modificando semplici file di configurazione

## 🚀 Come Funziona

1. **Scegli la tua città** (al momento solo Palermo)
2. **Seleziona il tema** della segnalazione (es. Igiene urbana, Polizia Municipale)
3. **Scegli il canale** di contatto (Twitter/X, telefono, email)
4. **Usa un template** o scrivi un messaggio libero
5. **Aggiungi la posizione** (opzionale) e invia!

Tutti i messaggi social includono automaticamente l'hashtag `#PaMiSenti` per creare una community e tracciare le segnalazioni.

## 🛠️ Per Sviluppatori e Contributori

Vuoi contribuire al progetto? Perfetto! Ecco da dove partire:

- 📖 **[TECHNICAL.md](./TECHNICAL.md)** — guida tecnica completa per sviluppatori
- 📋 **[PRD.md](./PRD.md)** — requisiti e specifiche del prodotto
- 🤖 **[AGENTS.md](./AGENTS.md)** — linee guida per AI agents che lavorano sul progetto
- ♿ **[ACCESSIBILITY.md](./ACCESSIBILITY.md)** — migliorie di accessibilità implementate

### Accessibilità

Il progetto implementa alcune buone practice di accessibilità:

- ✅ Navigazione completa da tastiera
- ✅ Supporto screen reader con ARIA labels
- ✅ Focus visibili e consistenti
- ✅ Dialog modali accessibili con focus trap
- ✅ Skip navigation link
- ✅ Struttura semantica HTML5

Leggi [ACCESSIBILITY.md](./ACCESSIBILITY.md) per i dettagli completi.

### Avvio Rapido per Sviluppatori

```bash
# Clona e installa
git clone https://github.com/aborruso/pa_mi_senti.git
cd pa_mi_senti
npm install

# Avvia in sviluppo
npm run dev

# Build per produzione
npm run build
```

### Aggiungi Contenuti Senza Codice

Puoi aggiungere nuove città, temi e template messaggi modificando solo due file YAML:

- `src/data/pa.yml` — città, temi e canali
- `src/data/templates.yml` — messaggi precompilati per social

Leggi la [guida dettagliata in TECHNICAL.md](./TECHNICAL.md#come-aggiungere-un-nuovo-tema) per tutti i passaggi!

## 🔧 Stack Tecnico

- **Astro** — sito statico ultra-veloce
- **React** — componenti interattivi
- **Tailwind CSS** — styling moderno
- **TypeScript** — type safety
- **YAML** — configurazione semplice

Tutto ospitato gratuitamente su **GitHub Pages** con deploy automatico.

## 📬 Contatti e Feedback

- 🐛 **Segnala bug o richiedi funzionalità**: [GitHub Issues](https://github.com/aborruso/pa_mi_senti/issues)
