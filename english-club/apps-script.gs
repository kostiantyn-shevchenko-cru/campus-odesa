/**
 * Англійський клуб · Campus Odesa — прийом анкет із сайту в Google-таблицю.
 *
 * Як підключити:
 * 1. Створи Google-таблицю → скопіюй її ID з адреси:
 *    docs.google.com/spreadsheets/d/ЦЕЙ_ID/edit
 * 2. Устав ID нижче в SHEET_ID.
 * 3. Розширення → Apps Script → встав цей файл → Зберегти.
 * 4. Розгорнути → Новий розгорток → тип «Веб-додаток»:
 *       Виконувати як: Я
 *       Хто має доступ: Усі (Anyone)
 * 5. Скопіюй посилання виду https://script.google.com/macros/s/..../exec
 *    і встав його в index.html у рядок SHEET_ENDPOINT.
 */

const SHEET_ID   = 'ВСТАВ_ID_ТАБЛИЦІ';
const SHEET_NAME = 'Заявки';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const d  = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sh   = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    if (sh.getLastRow() === 0) {
      sh.appendRow(['Дата', 'Ім\'я', 'Телефон', 'Telegram', 'Вік', 'Курс', 'Клас (після співбесіди)',
                    'Навчальний заклад', 'Самооцінка рівня', 'Чи був раніше',
                    'Звідки дізнався', 'Ставлення до дискусій', 'Коментар', 'Сторінка']);
      sh.setFrozenRows(1);
    }

    sh.appendRow([
      new Date(),
      d.name      || '',
      d.phone     || '',
      d.telegram  || '',
      d.age       || '',
      d.course    || '',
      '',   // клас заповнює команда після співбесіди
      d.school    || '',
      d.selflevel || '',
      d.first     || '',
      d.source    || '',
      d.attitude  || '',
      d.note      || '',
      d.page      || ''
    ]);

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json({ ok: true, info: 'English Club form endpoint' });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
