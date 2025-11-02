# Tasks: Fix Map Center Pin

## Phase 1: Remove draggable marker

- [x] Remove `markerRef` from `MapPickerModal` component state
- [x] Remove `Marker` creation code in map initialization (lines ~114-119)
- [x] Remove `marker.on("dragend")` event listener (lines ~122-128)
- [x] Remove marker cleanup in useEffect return (lines ~159-161)
- [x] Remove `setCurrentCoords(startCoords)` from init - will be set by moveend

## Phase 2: Add fixed center pin

- [x] Create CSS-positioned pin container in JSX after map container div
- [x] Add SVG pin icon matching brand color (#8b5cf6)
- [x] Style pin with `absolute`, `top: 50%`, `left: 50%`, `transform: translate(-50%, -100%)`
- [x] Add `pointer-events: none` to prevent blocking map interactions
- [x] Set `z-index: 10` to ensure pin is above map tiles
- [x] Test pin is centered on different viewport sizes (mobile, tablet, desktop)

## Phase 3: Update coordinates on map movement

- [x] Add `map.on("moveend", handleMapMove)` listener after map load
- [x] Implement `handleMapMove` callback that reads `map.getCenter()` and updates `currentCoords` state
- [x] Verify coordinates display updates in real-time during pan
- [x] Verify coordinates display updates in real-time during zoom
- [x] Test that coordinates are accurate (match visible center)

## Phase 4: Update GPS button behavior

- [x] Verify `handleUseGPS` still works (calls `flyTo` which triggers `moveend`)
- [x] Remove manual `setCurrentCoords` call from `handleUseGPS` (redundant - moveend will update)
- [x] Test GPS button: map flies to location, coordinates update after animation
- [x] Verify GPS loading state doesn't interfere with moveend updates

## Phase 5: Update UI text

- [x] Change header description from "Trascina il marcatore..." to "Sposta la mappa per posizionare il marcatore al centro"
- [x] Verify aria-labels are still accurate
- [x] Check all help text reflects new interaction model

## Phase 6: Testing & validation

- [x] Manual test: pan map updates coordinates
- [x] Manual test: zoom map updates coordinates
- [x] Manual test: GPS button centers map and updates coords
- [x] Manual test: confirm button returns correct center coordinates
- [x] Manual test: pin stays centered on window resize
- [x] Run `npm run lint` - no errors
- [x] Run `npm run build` - static generation succeeds
- [x] Test on mobile viewport (Chrome DevTools)
- [x] Test keyboard navigation (tab, arrow keys for map pan)

## Dependencies

- None - single component change, no external dependencies

## Rollback Plan

If issues arise, revert `MapPickerModal.tsx` to previous version with draggable marker. The component interface hasn't changed, so no cascade failures.
