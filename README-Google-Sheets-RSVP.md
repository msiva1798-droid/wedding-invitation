# Ananya & Rohan — Wedding invitation + Google Sheets RSVP

## What is included
- `index.html`: the existing invitation, with **Send RSVP** as the main button and a smaller, subtle WhatsApp alternative.
- `Code.gs`: Google Apps Script endpoint that appends web RSVP submissions to a Google Sheet.

## Part A — Create the private RSVP spreadsheet
1. Sign in to the Google account where you want to keep the responses.
2. Create a new Google Sheet named `Ananya & Rohan Wedding RSVPs`.
3. Keep the spreadsheet's sharing setting **Restricted**. Do not share the sheet publicly or with guests.
4. In the Sheet, choose **Extensions → Apps Script**.
5. Replace the starter code in `Code.gs` with the contents of the supplied `Code.gs` file, then click **Save**.

## Part B — Deploy the endpoint
1. In Apps Script, click **Deploy → New deployment**.
2. Click the gear/type selector and choose **Web app**.
3. Set **Execute as** to **Me**.
4. Set **Who has access** to **Anyone** (the endpoint must accept guests who are not signed into your Google account). This makes the endpoint public; do not put secrets in it. The script only accepts validated RSVP fields and does not provide a way to read the sheet.
5. Click **Deploy** and complete Google's authorization prompts.
6. Copy the Web app URL. It should begin `https://script.google.com/macros/s/` and end `/exec`. Do not use the editor URL.

## Part C — Connect it to the invitation
1. Open `index.html` in a text editor.
2. Find this line near the start of the JavaScript:
   `const RSVP_SCRIPT_URL='PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';`
3. Replace the placeholder with the Web app URL you copied, keeping the single quotes around the URL.
4. Save `index.html` and upload/commit the updated file to the root of the same GitHub repository that hosts your invitation. This is a one-time code update; your invitation URL stays the same.
5. Wait for GitHub Pages to deploy, then test a response with a name you can recognize. Confirm the row appears in the private `RSVPs` sheet. Delete the test row afterward.

## How guests use it
- The main **Send RSVP** button submits to the Google Sheet.
- The small **Prefer WhatsApp? Send there** link opens WhatsApp with the response prepared; the guest must press Send.
- Accepted guests must enter 1–20 guests; declined guests must enter 0.

## Important limitations and privacy
- Because the endpoint is public, anyone who knows the URL could submit junk responses. Google Apps Script is suitable for a small wedding RSVP workflow, but it is not a hardened public API and has quotas. Review the sheet periodically.
- The browser uses a no-CORS POST to avoid cross-origin response restrictions. The page cannot verify Google's response body, so its success message means the request was sent, not independently confirmed by the server. Always perform the test above before sharing the RSVP feature.
- Do not make the spreadsheet public. Guests must never receive a link that lets them view all RSVP responses.
- If you change the Apps Script deployment, update the URL in `index.html` and publish that file to GitHub Pages.
- This setup does not require or use your GitHub token for RSVP submissions.
