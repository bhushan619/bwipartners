# Update BWI and Partner Mobile Journeys

## Goal
Make the BWI experience start with login, add a reference-inspired BWI home screen, return there after successful swaps, and give partner users a clear banner entry into BWI.

## Build
- Rename the partner transaction label to “Naira swapped successfully” in the transaction list and status detail.
- Reorder the BWI journey to begin with login, then show a wallet-style home screen inspired by the supplied screenshot.
- Add a prominent Swap entry on BWI home that opens the existing amount and confirmation journey.
- Return the Done action on the completed transaction screen to BWI home.
- Add a banner on the partner wallet home that opens the BWI login screen.
- Keep the experience mocked and in memory, with existing partner configuration values reused.

## Technical Details
- Keep `/user-flow` as the BWI route and manage login, home, swap, and completion as internal screen states.
- Reuse existing semantic design tokens and mobile frame components.
- Update the prototype-home description to match the reordered BWI flow.
- Verify the complete partner-to-BWI journey at a mobile viewport and confirm the current build remains healthy.