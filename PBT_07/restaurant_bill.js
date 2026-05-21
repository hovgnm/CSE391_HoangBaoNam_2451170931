// Câu C2 - Tính hóa đơn nhà hàng

const monAn = [
  { ten: "Phở bò", gia: 65000, soLuong: 2 },
  { ten: "Trà đá", gia: 5000, soLuong: 3 },
  { ten: "Bún chả", gia: 55000, soLuong: 1 },
];

const coTip = true; // true nếu muốn tính tip, false nếu không

// lay ngay trong tuan hom nay
const homNay = new Date();
const thuTrongTuan = homNay.getDay(); // 0=CN, 1=T2, ... 3=T4(wednesday), ...

// tinh tong cong
let tongCong = 0;
for (let i = 0; i < monAn.length; i++) {
  tongCong += monAn[i].gia * monAn[i].soLuong;
}

// tinh giam gia
let phanTramGiam = 0;
if (tongCong > 1000000) {
  phanTramGiam = 15;
} else if (tongCong > 500000) {
  phanTramGiam = 10;
}

// kiem tra thu 4 (wednesday) giam them 5%
let giamThu4 = 0;
if (thuTrongTuan == 3) {
  giamThu4 = 5;
}

let tongGiam = phanTramGiam + giamThu4;
let soTienGiam = (tongCong * tongGiam) / 100;
let sauGiam = tongCong - soTienGiam;

// tinh VAT
let vat = (sauGiam * 8) / 100;

// tinh tip
let tip = 0;
if (coTip) {
  tip = (sauGiam * 5) / 100;
}

let thanhToan = sauGiam + vat + tip;

// ham format so cho dep
function formatTien(so) {
  return so.toLocaleString("vi-VN") + "đ";
}

// in hoa don
console.log("╔══════════════════════════════════════╗");
console.log("║        HÓA ĐƠN NHÀ HÀNG             ║");
console.log("╠══════════════════════════════════════╣");

for (let i = 0; i < monAn.length; i++) {
  let mon = monAn[i];
  let thanhtien = mon.gia * mon.soLuong;
  let dongIn = `║ ${i + 1}. ${mon.ten} x${mon.soLuong} @${mon.gia / 1000}k = ${thanhtien / 1000}k`;
  // them khoang trang cho du 40 ky tu
  while (dongIn.length < 40) dongIn += " ";
  console.log(dongIn + "║");
}

console.log("╠══════════════════════════════════════╣");
console.log(`║ Tổng cộng:          ${formatTien(tongCong).padStart(14)} ║`);

if (tongGiam > 0) {
  console.log(
    `║ Giảm giá (${tongGiam}%):      ${formatTien(soTienGiam).padStart(14)} ║`,
  );
} else {
  console.log(`║ Giảm giá (0%):      ${formatTien(0).padStart(14)} ║`);
}

console.log(`║ VAT (8%):           ${formatTien(vat).padStart(14)} ║`);

if (coTip) {
  console.log(`║ Tip (5%):           ${formatTien(tip).padStart(14)} ║`);
}

console.log("╠══════════════════════════════════════╣");
console.log(`║ THANH TOÁN:         ${formatTien(thanhToan).padStart(14)} ║`);
console.log("╚══════════════════════════════════════╝");

if (thuTrongTuan == 3) {
  console.log("(Hôm nay thứ 4 nên được giảm thêm 5%!)");
}
