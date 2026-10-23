/** Google Apps Script: wedding RSVP collector. Deploy as a web app. */
const SHEET_NAME = 'RSVPs';
function doPost(e) {
  const p = (e && e.parameter) || {};
  const name = String(p.name || '').trim().slice(0, 100);
  const attendance = String(p.attendance || '');
  const guests = Number(p.guests || 0);
  if (!name || !['Joyfully accepts', 'Regretfully declines'].includes(attendance)) {
    return ContentService.createTextOutput('Invalid RSVP');
  }
  if (!Number.isInteger(guests) || guests < 0 || guests > 20 || (attendance === 'Joyfully accepts' && guests < 1) || (attendance === 'Regretfully declines' && guests !== 0)) {
    return ContentService.createTextOutput('Invalid guest count');
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(['Received at', 'Name', 'Attendance', 'Guest count', 'Events', 'Message', 'Bride', 'Groom', 'Client timestamp']);
      sheet.setFrozenRows(1);
    }
    sheet.appendRow([new Date(), name, attendance, guests, String(p.events || '').slice(0, 500), String(p.note || '').slice(0, 500), String(p.bride || '').slice(0, 100), String(p.groom || '').slice(0, 100), String(p.submittedAt || '').slice(0, 40)]);
    return ContentService.createTextOutput('OK');
  } finally {
    lock.releaseLock();
  }
}
function doGet() {
  return ContentService.createTextOutput('Wedding RSVP endpoint is ready. Submit responses using the invitation form.');
}
