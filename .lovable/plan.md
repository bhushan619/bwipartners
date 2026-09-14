# Simplify BWI Partner Configurations

## Goal
Reduce BWI Admin to the active Partner Configurations workspace and align its layout and exchange table with the supplied admin reference.

## Build
- Remove the unused Transaction History, Withdrawal Management, and Risk Management views and navigation.
- Keep a compact Accounts Management sidebar with Partner Configurations as the single active page.
- Replace the parameter list with a partner exchange table containing serial number, app name, exchange pair, market rate, user rate, minimum and maximum withdrawal amounts, maximum daily withdrawals, status, and actions.
- Seed the table with representative Cardmax, Cardgoal, and Tbay rows based on the reference.
- Keep an Add Partner button above the table and open the existing form in a modal.
- Add a newly saved partner to the exchange table and retain inline editing for each row.

## Technical Details
- Keep all data mocked in React memory with no backend or persistence.
- Preserve shared partner values used by the SaaS and mobile flows.
- Reuse the existing BWI design tokens, admin shell, and button component.
- Verify the page, modal, saved row, and edit interaction at desktop size.