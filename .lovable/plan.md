# BWI Clickable Prototype

## Goal
Replace the existing Cobit demo with a neutral, professional BWI prototype that demonstrates the end-user flow and both sides of partner configuration.

## Build
- Create a new home screen with three clear entry cards: User Flow, BWI Admin, and SaaS Business Module.
- Build the four-step mobile user journey: wallet, swap, partner login, and transaction completion.
- Build the desktop BWI Admin journey: create partner, success state, rates editing, sidebar navigation, transaction history, withdrawal management, and risk management views.
- Build the desktop SaaS journey: matrix app list, BWI connection configuration, save confirmation, and connection overview.
- Keep partner name, partner code, currency, branding, status, and SaaS connection state in shared React memory so changes on one side appear on the other.
- Use mock rows and local interactions only; no backend or browser persistence.

## Visual Direction
- Deep navy primary, green action color, light grey surfaces, crisp white panels, sans-serif typography.
- Mobile device presentation for the user journey and full-width desktop workspaces for admin journeys.
- Restrained rounded corners, generous spacing, concise labels, clear status badges, and responsive layouts.

## Technical Details
- Consolidate shared prototype state in a React context provider.
- Use TanStack routes and links for all major screens; use local state for inline table edits and form interactions.
- Replace outdated Cobit routes and metadata so every BWI content route has unique title, description, Open Graph, and Twitter metadata.
- Verify the build and walk the key flows in desktop and mobile viewport sizes.
