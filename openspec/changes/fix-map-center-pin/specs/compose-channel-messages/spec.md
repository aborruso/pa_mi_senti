# Spec: Compose Channel Messages - Map Center Pin

## MODIFIED Requirements

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

## Implementation Notes

**Technical approach:**

- Remove MapLibre `Marker` with `draggable: true`
- Add CSS-positioned DOM element for the center pin (SVG)
- Listen to map `moveend` event instead of marker `dragend`
- Read `map.getCenter()` to update coordinates state
- Pin styling: `position: absolute; top: 50%; left: 50%; transform: translate(-50%, -100%);`

**Files affected:**

- `src/components/react/MapPickerModal.tsx` - main component logic and JSX
- No changes to `src/lib/map-loader.ts`, `src/lib/location.ts`, or parent components

**No breaking changes:**

- Modal props interface unchanged
- `onConfirm(coords)` callback signature unchanged
- GPS flow unchanged (still calls `requestCurrentPosition` and `flyTo`)
