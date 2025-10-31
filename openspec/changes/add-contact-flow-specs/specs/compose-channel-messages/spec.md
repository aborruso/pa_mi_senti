## ADDED Requirements
### Requirement: Display template options with channel context
The template picker MUST show all configured templates plus any default option needed for the channel type, including labels, descriptions, and recipients.

#### Scenario: Social channel exposes custom free-text option
- **GIVEN** the `palermo-rap-twitter` channel is of type social
- **WHEN** the template picker renders
- **THEN** it lists the YAML-defined templates for `nettezza_urbana`
- **AND** appends a "Scrivi un messaggio libero" option prefilled with `@RapPalermo `

#### Scenario: Email channel lists individual recipients
- **GIVEN** the `palermo-acqua-email` channel includes three comma-separated addresses
- **WHEN** the template picker renders
- **THEN** the template card shows each recipient badge with the trimmed email address

### Requirement: Launch the correct compose action with prefilled content
Selecting a template MUST open the appropriate client (Twitter intent or mailto) with the correct subject/body and the `#PaMiSenti` hashtag for predefined social templates.

#### Scenario: Social template opens Twitter intent
- **GIVEN** the user chooses the "Abbandono di rifiuti" template for RAP Palermo
- **WHEN** they confirm without adding location
- **THEN** a new browser tab opens at `https://twitter.com/intent/tweet`
- **AND** the text parameter contains the template message plus `#PaMiSenti`

#### Scenario: Email template opens mail client
- **GIVEN** the user chooses the "Tombino otturato" template for AMAP
- **WHEN** they confirm without location
- **THEN** the browser launches a `mailto:` URL targeting all configured recipients
- **AND** the query string includes `subject=Segnalazione%20tombino%20otturato%20in%20{indirizzo}`
- **AND** the body preserves original newlines using CRLF encoding

### Requirement: Offer optional location link before sending
Before finalizing a message, the picker MUST ask whether to attach a Google Maps link using GPS or manual map selection, and must allow opting out.

#### Scenario: User adds GPS location
- **GIVEN** the user selects a social template and accepts "GPS automatico"
- **WHEN** the browser resolves coordinates
- **THEN** the message appends a `https://www.google.com/maps/place/<lat>,<lng>` link after the template text
- **AND** the compose action proceeds automatically after the coordinates load

#### Scenario: User chooses map selection
- **GIVEN** the user selects "Scegli su mappa"
- **WHEN** they confirm a point on MapLibre
- **THEN** the picker closes both dialogs
- **AND** the compose action appends the chosen coordinates as a Google Maps link before opening the client

#### Scenario: User declines location
- **GIVEN** the location dialog is shown for a template
- **WHEN** the user clicks "No, grazie"
- **THEN** the compose action runs with the original template text and no maps link
