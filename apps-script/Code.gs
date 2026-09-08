// Apps Script เสริม (รันด้วยเมลส่วนตัว Owner ได้)
// ใช้แค่: รับ webhook สรุปงาน -> ลง Google Sheet สำรอง + ส่งเมลแจ้ง Owner
// ฐานจริงยังอยู่ใน Supabase ไม่ใช่ Sheet

const SHEET_ID = 'PASTE_SHEET_ID_HERE'; // ชีตสำรองของ Owner
const OWNER_EMAIL = 'kiatisaktonpoo2526@gmail.com';

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  // data = { module: 'repairs'|'documents'|'vehicle', action, payload }
  const sh = SpreadsheetApp.openById(SHEET_ID).getSheetByName(data.module)
    || SpreadsheetApp.openById(SHEET_ID).insertSheet(data.module);
  sh.appendRow([new Date(), data.action, JSON.stringify(data.payload)]);
  MailApp.sendEmail(OWNER_EMAIL, '[HAMS] ' + data.module + ' ' + data.action, JSON.stringify(data.payload, null, 2));
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
}
