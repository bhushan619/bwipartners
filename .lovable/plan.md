# Partner configuration edit modal

## Changes
- Replace inline table editing with an Edit modal for the selected partner.
- Match the reference layout: current market rate and editable withdrawal/rate/status fields on the left, rate change history on the right.
- Include Cancel, close, and Save actions; Save updates the selected configuration row in memory.
- Keep Add Partner and the existing configuration table unchanged.

## Technical details
- Keep all prototype data in React state with mock rate-history entries.
- Make the modal usable on narrower desktop screens by stacking its panels and allowing the history table to scroll.
- Verify opening, cancelling, saving, and the final build.
