// Lấy các elements
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("confirmPassword");
const phoneInput = document.getElementById("phone");
const submitBtn = document.getElementById("submitBtn");
const form = document.getElementById("registerForm");

// Lưu trạng thái valid của từng field
const valid = {
  name: false,
  email: false,
  password: false,
  confirm: false,
  phone: false,
};

// Hàm hiển thị thông báo
function showMsg(id, text, isOk) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.className = "msg " + (isOk ? "ok" : "err");
}

// Kiểm tra tên
nameInput.addEventListener("input", function () {
  const val = this.value.trim();
  if (val.length < 2) {
    showMsg("nameMsg", "❌ Tên phải có ít nhất 2 ký tự", false);
    valid.name = false;
  } else if (val.length > 50) {
    showMsg("nameMsg", "❌ Tên quá dài (tối đa 50 ký tự)", false);
    valid.name = false;
  } else {
    showMsg("nameMsg", "✅ Hợp lệ", true);
    valid.name = true;
  }
  checkAll();
});

// Kiểm tra email
emailInput.addEventListener("input", function () {
  const val = this.value.trim();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (val === "") {
    showMsg("emailMsg", "❌ Email không được để trống", false);
    valid.email = false;
  } else if (!regex.test(val)) {
    showMsg("emailMsg", "❌ Email không đúng định dạng", false);
    valid.email = false;
  } else {
    showMsg("emailMsg", "✅ Email hợp lệ", true);
    valid.email = true;
  }
  checkAll();
});

// Kiểm tra password + strength meter
passwordInput.addEventListener("input", function () {
  const val = this.value;
  const fill = document.getElementById("strengthFill");

  if (val.length === 0) {
    fill.style.width = "0%";
    showMsg("passwordMsg", "", true);
    valid.password = false;
    checkAll();
    return;
  }

  // Tính điểm strength
  let score = 0;
  if (val.length >= 8) score++;
  if (/[a-z]/.test(val) && /[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^a-zA-Z0-9]/.test(val)) score++;

  if (score <= 1) {
    fill.style.width = "33%";
    fill.style.background = "red";
    showMsg("passwordMsg", "❌ Yếu (cần ít nhất 8 ký tự)", false);
    valid.password = false;
  } else if (score === 2 || score === 3) {
    fill.style.width = "66%";
    fill.style.background = "orange";
    showMsg("passwordMsg", "⚠️ Trung bình", true);
    valid.password = true;
  } else {
    fill.style.width = "100%";
    fill.style.background = "green";
    showMsg("passwordMsg", "✅ Mạnh", true);
    valid.password = true;
  }

  // Kiểm tra lại confirm khi password đổi
  checkConfirm();
  checkAll();
});

// Kiểm tra confirm password
function checkConfirm() {
  const val = confirmInput.value;
  if (val === "") {
    showMsg("confirmMsg", "", true);
    valid.confirm = false;
    return;
  }
  if (val !== passwordInput.value) {
    showMsg("confirmMsg", "❌ Mật khẩu không khớp", false);
    valid.confirm = false;
  } else {
    showMsg("confirmMsg", "✅ Khớp rồi", true);
    valid.confirm = true;
  }
  checkAll();
}

confirmInput.addEventListener("input", function () {
  checkConfirm();
});

// Kiểm tra phone + tự thêm dấu gạch
phoneInput.addEventListener("input", function () {
  // Chỉ giữ lại số
  let digits = this.value.replace(/\D/g, "");

  // Format: 0901-234-567
  let formatted = digits;
  if (digits.length > 4 && digits.length <= 7) {
    formatted = digits.slice(0, 4) + "-" + digits.slice(4);
  } else if (digits.length > 7) {
    formatted =
      digits.slice(0, 4) + "-" + digits.slice(4, 7) + "-" + digits.slice(7, 10);
  }

  this.value = formatted;

  if (digits.length !== 10) {
    showMsg("phoneMsg", "❌ Số điện thoại phải có 10 chữ số", false);
    valid.phone = false;
  } else {
    showMsg("phoneMsg", "✅ Hợp lệ", true);
    valid.phone = true;
  }
  checkAll();
});

// Bật/tắt nút submit
function checkAll() {
  const allValid =
    valid.name && valid.email && valid.password && valid.confirm && valid.phone;
  submitBtn.disabled = !allValid;
}

// Submit form
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const info = `Họ tên: ${nameInput.value}\nEmail: ${emailInput.value}\nSĐT: ${phoneInput.value}`;
  document.getElementById("modalInfo").textContent = info;
  document.getElementById("modal").classList.remove("hidden");
});
