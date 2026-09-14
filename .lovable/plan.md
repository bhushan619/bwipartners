# SaaS Admin Partner Linking Update

## Goal
Update the SaaS Admin to match the supplied management-console format and simplify how matrix apps are linked to BWI.

## Build
- Rework the SaaS Admin into a desktop console with a dark left navigation and a compact top header inspired by the reference.
- Add **Partner Linking** as the active navigation item and rename the current **Connection overview** view to **Partner Linking**.
- Keep the matrix-app table as the main content, with connection status and Manage actions.
- Change **Manage connection** from a separate page into a modal opened over the table or Partner Linking view.
- In the modal, keep the BWI connection toggle and partner code, remove local currency and wallet entry-point placement, and add a **Deeplink URL** field.
- Preserve the existing in-memory connection state and success confirmation.

## Verification
- Check the new navigation and Partner Linking view.
- Confirm Manage opens and closes the modal, saves partner code and deeplink URL, and updates the status badge.
- Verify the desktop layout and mobile fallback build without errors.
