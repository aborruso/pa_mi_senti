# Migliorie di Accessibilità Implementate

Questo documento descrive le migliorie di accessibilità applicate al progetto PA Mi Senti per migliorare l'esperienza utente per persone con disabilità e garantire la conformità alle linee guida WCAG.

## 1. Skip to Content Link ✅

**Cosa**: Link "Salta al contenuto principale" all'inizio di ogni pagina.

**Perché**: Permette agli utenti di tastiera e screen reader di saltare l'header e la navigazione ripetitiva.

**Implementazione**:
- Aggiunto in `BaseLayout.astro`
- Visibile solo quando riceve il focus (classe `.sr-only` con override su `:focus`)
- Salta direttamente a `#main-content`
- Styling accessibile con anello di focus visibile

```html
<a href="#main-content" class="sr-only focus:not-sr-only...">
  Salta al contenuto principale
</a>
```

## 2. Landmark Semantici HTML5 ✅

**Cosa**: Uso corretto di elementi HTML5 semantici.

**Perché**: Screen reader possono navigare per landmark (header, main, nav, footer, article, aside).

**Implementazione**:
- `<header>` per l'intestazione del sito
- `<main id="main-content">` per il contenuto principale
- `<nav aria-label="Menu principale">` per la navigazione
- `<footer>` per il footer
- `<article>` per card di città e temi
- `<aside>` per informazioni collaterali
- `<nav aria-label="Percorso">` per breadcrumb (già presente)
- `<nav aria-label="Link utili">` per link utili nei contesti

## 3. ARIA Labels su Link e Pulsanti ✅

**Cosa**: Aggiunta di `aria-label` descrittivi su link generici o ambigui.

**Perché**: Screen reader annunciano descrizioni significative invece di "link" o "pulsante".

**Implementazione**:
- Link città: `aria-label="Seleziona {città} - {n} temi disponibili"`
- Link temi: `aria-label="Seleziona il tema {tema} - {n} canali disponibili"`
- Link canali: `aria-label="Scrivi un messaggio su Twitter/X a {canale}"`
- Link email: `aria-label="Invia email a {canale}"`
- Link telefono: `aria-label="Chiama {canale}"`
- Link esterni: `aria-label="{testo} (si apre in una nuova scheda)"`
- Pulsanti back: `aria-label="Torna alla lista dei temi di {città}"`
- Pulsante template: `aria-label="Usa il messaggio: {template}"`

## 4. Focus States Migliorati ✅

**Cosa**: Indicatori di focus visibili e consistenti su tutti gli elementi interattivi.

**Perché**: Gli utenti che navigano con tastiera devono vedere chiaramente dove si trova il focus.

**Implementazione**:
- `focus:outline-none` + `focus-visible:ring-4 focus-visible:ring-brand/50` su link e pulsanti principali
- `focus-visible:ring-2 focus-visible:ring-brand/50` su link inline e secondari
- `focus-visible:rounded` per mantenere coerenza con il design
- Anello di focus brand color (azzurro) con 50% opacità
- Funziona solo con `:focus-visible` (non si attiva su click mouse)

**Esempi**:
```html
<!-- Link principale -->
<a class="... focus:outline-none focus-visible:ring-4 focus-visible:ring-brand/50">

<!-- Link secondario -->
<a class="... focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50">

<!-- Pulsante -->
<button class="... focus:outline-none focus-visible:ring-4 focus-visible:ring-brand/50">
```

## 5. Dialog Modale Accessibile ✅

**Cosa**: Dialog per consenso geolocalizzazione conforme alle best practice ARIA.

**Perché**: Le modali devono intrappolare il focus e essere annunciate correttamente dagli screen reader.

**Implementazione** in `TemplatePicker.tsx`:

### Attributi ARIA:
- `role="dialog"` - identifica il dialog
- `aria-modal="true"` - comunica che è una modale
- `aria-labelledby="location-dialog-title"` - collega al titolo

### Focus Management:
- Focus automatico sul primo pulsante all'apertura
- Focus trap: TAB cicla solo tra elementi nel dialog
- ESC chiude il dialog (se non in caricamento)
- Focus torna all'elemento che ha aperto il dialog alla chiusura

### Stati di Caricamento:
- Spinner con `role="status"` e `aria-label="Caricamento in corso"`
- Pulsanti disabilitati durante il caricamento
- `aria-busy="true"` sui pulsanti durante l'operazione

### Codice implementato:
```typescript
// Focus trap con ESC key
useEffect(() => {
  if (!showLocationDialog) return;
  
  yesButtonRef.current?.focus(); // Focus iniziale
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && !isLoadingLocation) {
      // Chiudi con ESC
    }
    
    if (e.key === "Tab" && dialogRef.current) {
      // Focus trap logic
    }
  };
  
  document.addEventListener("keydown", handleKeyDown);
  return () => document.removeEventListener("keydown", handleKeyDown);
}, [showLocationDialog, isLoadingLocation]);
```

## 6. Link Esterni con Avviso ✅

**Cosa**: Comunicazione esplicita quando un link apre una nuova scheda.

**Perché**: Gli utenti devono sapere quando lasciano la pagina corrente, specialmente con screen reader.

**Implementazione**:
- Tutti i link con `target="_blank"` hanno `aria-label` con "(si apre in una nuova scheda)"
- Esempi:
  - Link utili: `aria-label="{testo} (si apre in una nuova scheda)"`
  - Profilo Twitter/X: `aria-label="Apri il profilo su Twitter/X (si apre in una nuova scheda)"`

## 7. Miglioramenti Aggiuntivi

### Role List/Listitem
Aggiunto `role="list"` e `role="listitem"` dove appropriato:
- Griglia città
- Griglia temi
- Lista canali
- Lista template messaggi

### Role Img con Aria-Label
Emoji con significato semantico hanno `role="img"` e `aria-label`:
```html
<span role="img" aria-label="Icona Nettezza urbana">♻️</span>
```

### Aria-Hidden
Elementi decorativi marcati con `aria-hidden="true"`:
- Frecce "→" e "←"
- Icone "↗"
- Emoji puramente decorative

## Test di Accessibilità

### Come Testare

**Navigazione Tastiera**:
1. Usa TAB per navigare tra elementi
2. SHIFT+TAB per tornare indietro
3. ENTER/SPACE per attivare link e pulsanti
4. ESC per chiudere il dialog

**Screen Reader**:
- NVDA (Windows): gratuito
- JAWS (Windows): commerciale
- VoiceOver (Mac/iOS): integrato
- TalkBack (Android): integrato

**Strumenti Automatici**:
- axe DevTools (browser extension)
- Lighthouse (Chrome DevTools)
- WAVE (browser extension)

### Checklist Conformità

- ✅ Struttura semantica HTML5
- ✅ Tutti gli elementi interattivi sono raggiungibili da tastiera
- ✅ Focus visibile su tutti gli elementi interattivi
- ✅ Modalità accessibile con focus trap
- ✅ Link descrittivi (no "clicca qui")
- ✅ Immagini e icone con testo alternativo appropriato
- ✅ Skip navigation link
- ✅ Lingua della pagina dichiarata (`lang="it"`)
- ⚠️ Contrasto colori (da verificare con strumenti)

## Prossimi Passi Raccomandati

1. **Test manuali**: Verificare navigazione con tastiera e screen reader su pagine reali
2. **Contrasto colori**: Usare strumento come [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) per validare i colori brand
3. **Test utenti**: Far testare il sito a persone con disabilità reali
4. **Documentazione**: Aggiornare README con nota sull'accessibilità

## Risorse

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM Articles](https://webaim.org/articles/)
