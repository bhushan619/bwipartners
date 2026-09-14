# Separate BWI and Partner User Flows

## Goal
Separate the partner-app wallet experience from the BWI swap experience, update both from the supplied mobile references, and make partner creation a modal inside BWI Partner Configurations.

## Build
- Add a dedicated Partner App User Flow with a wallet balance card, withdraw entry point, transaction records, and transaction-status detail inspired by the partner screenshots.
- Rework the BWI User Flow as its own mobile journey: secure swap introduction, swap amount and history, partner login, and transaction completion, following the supplied BWI references.
- Update the prototype home so Partner App User Flow and BWI User Flow are separate entry cards alongside both admin areas.
- Rename Rates Management to Partner Configurations throughout BWI Admin.
- Make Partner Configurations the main admin view, add an “Add Partner” button, and open the existing partner form in a modal.
- Keep partner name, code, currency, and connection state shared in React memory across the flows.

## Technical Details
- Add a new TanStack route for the partner flow and retain `/user-flow` for the BWI flow.
- Reuse the existing design tokens and shared button primitives while adapting mobile layout, color emphasis, and information hierarchy to the references.
- Keep all data mocked and in memory; no backend or persistence.
- Add unique metadata for the new route and verify mobile/desktop flows plus modal interactions.
