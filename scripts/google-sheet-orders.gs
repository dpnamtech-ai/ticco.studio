/**
 * Tíc Cơ — nhận đơn hàng từ website vào Google Sheet.
 *
 * Cài đặt (1 lần, ~5 phút):
 *  1. Tạo Google Sheet mới → Tiện ích mở rộng → Apps Script → xoá code mẫu, dán toàn bộ file này.
 *  2. Đổi SECRET bên dưới thành một chuỗi bất kỳ khó đoán (giống ORDER_SHEET_SECRET trên Vercel).
 *  3. Triển khai → Tác vụ triển khai mới → loại "Ứng dụng web":
 *       Thực thi với tư cách: Tôi · Người có quyền truy cập: Bất kỳ ai → Triển khai → cấp quyền.
 *  4. Copy "URL ứng dụng web" (…/exec) → đặt vào Vercel env ORDER_SHEET_URL.
 * Sửa code sau này: Triển khai → Quản lý → sửa → Phiên bản mới (URL giữ nguyên).
 */
const SECRET = "doi-chuoi-nay";
const SHEET = "Đơn hàng";
const TZ = "Asia/Ho_Chi_Minh";

const STATUSES = ["Chờ chuyển khoản", "COD - chờ gửi hàng", "Đã thanh toán", "Đã gửi hàng", "Hoàn tất", "Huỷ"];
const STATUS_COLORS = { "Chờ chuyển khoản": "#fff4cc", "COD - chờ gửi hàng": "#ffe2c4", "Đã thanh toán": "#d9f2e3", "Đã gửi hàng": "#dbe8ff", "Hoàn tất": "#e6e6e6", "Huỷ": "#fde0e0" };
// [header, width px]
const COLUMNS = [
  ["Thời gian", 130], ["Mã đơn", 115], ["Trạng thái", 150], ["Khách hàng", 150], ["SĐT", 110], ["Email", 170],
  ["Địa chỉ giao", 300], ["Sản phẩm", 340], ["SL", 45], ["Tạm tính", 100], ["Ship", 80], ["Tổng tiền", 110],
  ["Khách ghi chú", 200], ["Mã vận đơn", 120], ["Shop ghi chú", 200],
];
const MONEY = '#,##0" ₫"';

// Chạy tay trong trình soạn Apps Script (chọn hàm testOrder → Chạy) để xem thử 1 đơn mẫu.
function testOrder() {
  doPost({ postData: { contents: JSON.stringify({
    secret: SECRET, code: "TCTEST001", subtotal: 150000, shipping: 30000, total: 180000,
    customer: { name: "Nguyễn Văn A", phone: "0912345678", email: "a@example.com", province: "Hà Nội", district: "Ba Đình", ward: "Điện Biên", address: "12 Phố Mẫu", note: "Giao giờ hành chính" },
    items: [{ name: "BST Postcard Triết Lý Sống Đần", variant: "Lao động", qty: 2, price: 30000 }, { name: "Set sticker 07: Đần Nói", variant: "", qty: 1, price: 90000 }],
  }) } });
}

function doPost(e) {
  const o = JSON.parse(e.postData.contents);
  if (o.secret !== SECRET) return json({ ok: false, error: "forbidden" });

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    // Order code = "TICCO" + 6 random digits (client rule 08/10). Drawn here, under the lock, and re-drawn while the
    // sheet already has it, so two orders never share a code.
    const sh = sheet_();
    do {
      o.code = "TICCO" + String(Math.floor(Math.random() * 1e6)).padStart(6, "0");
    } while (sh.createTextFinder(o.code).matchEntireCell(true).findNext());
    const c = o.customer;
    const items = o.items.map((l) => `${l.qty} × ${l.name}${l.variant ? ` (${l.variant})` : ""} — ${fmt_(l.price * l.qty)}`).join("\n");
    const row = [
      new Date(), o.code, c.payment === "cod" ? STATUSES[1] : STATUSES[0], c.name, `'${c.phone}`, c.email || "",
      [c.address, c.ward, c.district, c.province].filter(String).join(", "), items,
      o.items.reduce((s, l) => s + l.qty, 0), o.subtotal, o.shipping, o.total, c.note || "", "", "",
    ];
    sh.insertRowAfter(1); // newest order on top, right under the header
    sh.getRange(2, 1, 1, row.length).setValues([row]).setVerticalAlignment("top").setBackground(null).setFontWeight(null).setFontColor("#222222");
    sh.getRange(2, 12).setFontWeight("bold");
    return json({ ok: true, code: o.code });
  } finally {
    lock.releaseLock();
  }
}

// Shop types a Giao Hàng Nhanh tracking code into "Mã vận đơn" → the cell becomes a link to GHN's tracking page.
// Simple trigger: runs on manual edits only, no deploy needed.
const TRACKING_COL = COLUMNS.findIndex((c) => c[0] === "Mã vận đơn") + 1;
function onEdit(e) {
  const r = e.range;
  if (r.getSheet().getName() !== SHEET || r.getColumn() !== TRACKING_COL || r.getRow() < 2 || r.getNumColumns() > 1) return;
  const code = String(r.getValue()).trim();
  if (!code) return;
  r.setRichTextValue(SpreadsheetApp.newRichTextValue().setText(code)
    .setLinkUrl("https://donhang.ghn.vn/?order_code=" + encodeURIComponent(code)).build());
}

// Creates + styles the sheet the first time an order arrives; later calls just return it.
function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET);
  if (sh) return sh;
  sh = ss.insertSheet(SHEET, 0);
  const n = COLUMNS.length;
  sh.getRange(1, 1, 1, n).setValues([COLUMNS.map((c) => c[0])])
    .setBackground("#53129e").setFontColor("#ffffff").setFontWeight("bold").setVerticalAlignment("middle").setHorizontalAlignment("center");
  sh.setRowHeight(1, 36);
  sh.setFrozenRows(1);
  sh.setFrozenColumns(2);
  COLUMNS.forEach((c, i) => sh.setColumnWidth(i + 1, c[1]));

  const body = (col) => sh.getRange(2, col, sh.getMaxRows() - 1, 1);
  body(1).setNumberFormat("dd/MM/yyyy HH:mm");
  body(2).setFontFamily("Roboto Mono");
  [10, 11, 12].forEach((col) => body(col).setNumberFormat(MONEY));
  [7, 8, 13, 15].forEach((col) => body(col).setWrap(true));
  body(3).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).build());

  const rows = sh.getRange(2, 1, sh.getMaxRows() - 1, n);
  sh.setConditionalFormatRules(STATUSES.map((s) =>
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied(`=$C2="${s}"`).setBackground(STATUS_COLORS[s]).setRanges([rows]).build()));
  sh.getRange(1, 1, sh.getMaxRows(), n).setBorder(true, true, true, true, true, true, "#dddddd", SpreadsheetApp.BorderStyle.SOLID);

  const blank = ss.getSheetByName("Sheet1") || ss.getSheetByName("Trang tính1");
  if (blank && blank.getLastRow() === 0) ss.deleteSheet(blank);
  ss.setSpreadsheetTimeZone(TZ);
  return sh;
}

const fmt_ = (n) => `${Number(n).toLocaleString("vi-VN")}đ`;
const json = (o) => ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
