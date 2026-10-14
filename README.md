# Wedding Invitation Website (GitHub Pages)

A responsive Indian wedding invitation starter inspired by the reference screenshots. Includes event toggles, countdown, team selection, directions, calendar links, optional music, WhatsApp RSVP fallback, a three-tap creator panel, config import/export, and local CSV export.

## Publish on GitHub Pages

1. Create a new repository on GitHub, e.g. `wedding-invitation`.
2. Upload **all files in this folder** to the repository root (`index.html`, `style.css`, `script.js`, `wedding-config.json`, and this README).
3. In the repository, open **Settings → Pages**.
4. Under Build and deployment, choose **Deploy from a branch**.
5. Select `main` and `/ (root)`, then Save.
6. Wait for the Pages URL shown in Settings → Pages. Anyone with the link can open the invitation.

For the public invitation to work, the published Pages site must be publicly accessible. `noindex` discourages search engines but does not make the URL private.

## Change wedding details

- Open the site and tap the small ✦ at bottom-right **three times quickly**.
- Demo PIN: `2468`.
- Edit details and events, then click **Save in this browser**.
- Under Records, choose **Download wedding-config.json**.
- Upload/replace `wedding-config.json` in your GitHub repository and commit it to publish changes to all guests.

You can also edit `wedding-config.json` directly in GitHub. Use valid JSON syntax. The event's `enabled` field controls whether it appears.

## RSVP and data limitations (important)

GitHub Pages serves static files; it cannot receive a form POST and write the response back to the repository. This starter therefore:
- Opens WhatsApp with a prefilled RSVP message when a WhatsApp number is configured.
- Saves a copy of a submitted RSVP in the current browser's local storage and allows a CSV export from that browser.
- Does **not** automatically gather all guests' RSVPs into a shared list. WhatsApp replies are not automatically imported.
- Tracks a first-time visit in that browser's local storage only. It is not a cross-device, server-wide unique visitor count.
- Stores customisations locally until you export and commit the JSON file.

If you need automatic central RSVP collection and cross-device visitor analytics, a server-side write endpoint or hosted form/database is required. Do not treat the demo PIN as secure: the frontend code is public and the PIN can be discovered. Do not store sensitive information in public files.

## Customize WhatsApp

Edit the `whatsapp` value in `wedding-config.json` to your number in international format with digits only, including country code, e.g. `919876543210`. Replace all sample details before sharing.

## Optional music

Place an audio file you have permission to use in the repository (for example `assets/music.mp3`) and set `musicUrl` to `assets/music.mp3` in `wedding-config.json`. Browsers generally require a user click before audio can play.

## Notes

- `robots` noindex is only a request to search engines, not access control.
- Do not commit secrets, private phone numbers, or private guest records into a public repository.
- Keep backups of your exported RSVP CSV and config.


### RSVP guest-count validation
- Declining automatically sets the guest count to 0.
- Accepting requires a whole-number guest count from 1 to 20.
- This is client-side validation; static GitHub Pages still does not collect responses centrally.
