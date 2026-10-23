# Ananya & Rohan — Wedding Invitation (GitHub Pages)

This is a single-file wedding invitation: **all HTML, styling, interactions, Creator Tools, and the default wedding settings are inside `index.html`**. It is designed to be uploaded once to a GitHub repository and then edited from the secret Creator Tools panel on your phone.

## One-time publishing

1. Create a **public** GitHub repository (for example, `wedding-invitation`).
2. Upload only `index.html` to the repository root and commit it.
3. Open **Settings → Pages**. Choose **Deploy from a branch**, select `main` and `/(root)`, then save.
4. Wait for GitHub to show the Pages URL. That is the stable invitation link to share with guests.

## One-time editor authorization on your phone

The browser editor updates the existing `index.html` through GitHub's Contents API. You will not need to download or upload a new file for each change.

1. In GitHub, open **Settings → Developer settings → Personal access tokens → Fine-grained tokens** and create a token restricted to **only this invitation repository**.
2. Give it **Contents: Read and write** permission. Set an expiration date. Do not grant other permissions.
3. Open the live invitation on the phone/browser you will use for editing.
4. Tap the small star (✦) **five times quickly**, enter the Creator Tools PIN `2468`, and open the **Records** tab.
5. Enter the GitHub owner/username, repository name, branch (`main`), token, and file path (`index.html`). Tap **Save & publish to GitHub**.
6. For future edits on that same phone/browser, open Creator Tools, edit the details/events/style, then tap **Save & publish to GitHub**. The page URL stays the same; GitHub Pages may take a short time to deploy the update.

## Important security notes

- The Creator Tools PIN is a convenience lock, **not real security**; frontend code is public and a determined visitor can inspect it.
- The GitHub token is stored in that browser's local storage, not embedded in the public `index.html`. Anyone with access to that browser profile or scripts running on the page could potentially access it. Use a fine-grained token limited to this one repository, set an expiry, and revoke it in GitHub if the phone/browser is lost or you no longer need editing. Do not share the token.
- If you use a shared/public device, do not save the token there. You can revoke the token in GitHub at any time.
- Keep a backup of `index.html` before major changes.

## Features included

- Elegant Indian wedding invitation with envelope intro, countdown, family message, event cards, closing section, and optional music.
- Creator Tools for names, date, venue, family details, event visibility and details, dress-code toggles, reveal method per event (scratch/rub, heart trace, or dhol five-tap), style toggles, and RSVP settings.
- Event details stay hidden until the interaction is completed. Heart mode uses a gesture to trace; scratch mode uses rubbing/scratching; dhol mode requires five taps.
- WhatsApp RSVP fallback and local export tools.

## Static-site limitations

- Changes published through Creator Tools update the repository file and are shared with guests after GitHub Pages deploys.
- RSVP replies are opened in WhatsApp and are **not collected into a central dashboard** by GitHub Pages. Local RSVP/visit records only exist in the browser that created them.
- Public GitHub Pages content is public. Do not put private guest information or secrets in the invitation.
