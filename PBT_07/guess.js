let soCanDoan = Math.floor(Math.random() * 100) + 1;
let soLuot = 7;
let daDoan = [];
let gameOver = false;

function doan() {
  if (gameOver) {
    alert("Game đã kết thúc! Bấm Chơi lại");
    return;
  }

  let input = document.getElementById("input").value;
  let so = Number(input);

  // validate
  if (input == "" || isNaN(so)) {
    alert("Vui lòng nhập một số!");
    return;
  }
  if (so < 1 || so > 100) {
    alert("Chỉ nhập số từ 1 đến 100 thôi!");
    return;
  }
  so = Math.floor(so); // bo phan thap phan neu co

  // kiem tra da doan chua
  if (daDoan.includes(so)) {
    alert("Bạn đã đoán số này rồi!");
    return;
  }

  daDoan.push(so);
  soLuot--;

  document.getElementById("history").textContent =
    "Đã đoán: " + daDoan.join(", ");

  if (so == soCanDoan) {
    let lanDoan = 7 - soLuot;
    document.getElementById("message").textContent =
      `🎉 Đúng rồi! Số cần đoán là ${soCanDoan}`;
    alert(`Bạn đoán đúng sau ${lanDoan} lần!`);
    gameOver = true;
  } else if (soLuot == 0) {
    document.getElementById("message").textContent =
      `😢 Hết lượt! Số cần đoán là ${soCanDoan}`;
    document.getElementById("luot").textContent = 0;
    gameOver = true;
  } else {
    if (so < soCanDoan) {
      document.getElementById("message").textContent =
        `📈 Cao hơn! (${so} < ${soCanDoan})`;
    } else {
      document.getElementById("message").textContent =
        `📉 Thấp hơn! (${so} > ${soCanDoan})`;
    }
    document.getElementById("luot").textContent = soLuot;
  }

  document.getElementById("input").value = "";
}

function choimoi() {
  soCanDoan = Math.floor(Math.random() * 100) + 1;
  soLuot = 7;
  daDoan = [];
  gameOver = false;
  document.getElementById("message").textContent = "Nhập số để bắt đầu!";
  document.getElementById("luot").textContent = 7;
  document.getElementById("history").textContent = "";
  document.getElementById("input").value = "";
}

// cho bam enter cung duoc
document.addEventListener("keydown", function (e) {
  if (e.key == "Enter") doan();
});
