# compose-channel-messages Specification

## Purpose
TBD - created by archiving change add-contact-flow-specs. Update Purpose after archive.
## Requirements
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

### Requirement: Map-based location selection uses fixed center pin

The manual map picker MUST use a fixed pin at the center of the viewport instead of a draggable marker. The user pans and zooms the map to position the desired location under the pin, and coordinates update automatically when the map stops moving.

#### Scenario: User pans map to select location

- **GIVEN** the map picker modal is open
- **WHEN** the user pans the map in any direction
- **AND** the map stops moving (pan gesture ends)
- **THEN** the coordinates display updates to show the lat/lng of the map center
- **AND** the center pin remains visually fixed at the viewport center

#### Scenario: User zooms map to refine location

- **GIVEN** the map picker modal is open with a location already selected
- **WHEN** the user zooms in or out using controls or gestures
- **AND** the zoom animation completes
- **THEN** the coordinates display updates to the new map center
- **AND** the center pin remains visually fixed at the viewport center
- **AND** the map center stays on the same geographic point during zoom

#### Scenario: User confirms location after panning

- **GIVEN** the user has panned the map to position a desired location under the center pin
- **WHEN** the user clicks "Conferma posizione"
- **THEN** the modal closes and returns the coordinates corresponding to the current map center
- **AND** the coordinates match exactly what was shown in the live display

#### Scenario: GPS button centers map under fixed pin

- **GIVEN** the user clicks "Usa posizione GPS" in the map picker
- **WHEN** the GPS resolves successfully
- **THEN** the map animates (flyTo) to center the GPS coordinates under the fixed pin
- **AND** after the animation completes, the coordinates display shows the GPS location
- **AND** the returned coordinates on confirm match the GPS location

#### Scenario: Pin visual indicator is always centered

- **GIVEN** the map picker modal is rendered on any viewport size
- **WHEN** the user interacts with the map (pan, zoom, GPS)
- **THEN** the pin icon remains visually fixed at the exact center of the map container
- **AND** the pin does not move relative to the viewport during map interactions
- **AND** the pin pointer tip indicates the precise center point

#### Scenario: Help text reflects fixed pin interaction

- **GIVEN** the map picker modal is open
- **WHEN** the user reads the header description
- **THEN** the text instructs to move the map (not the pin) to select a location
- **AND** does NOT mention dragging the marker
- **AND** clearly indicates the center pin shows the selected coordinates

