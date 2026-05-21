function calculate(num1, operator, num2) {
  // kiem tra xem co phai so khong
  if (isNaN(num1) || isNaN(num2)) {
    return "Lỗi: Input không phải số";
  }

  // chuyen thanh so cho chac
  num1 = Number(num1);
  num2 = Number(num2);

  if (operator == "+") {
    return num1 + num2;
  } else if (operator == "-") {
    return num1 - num2;
  } else if (operator == "*") {
    return num1 * num2;
  } else if (operator == "/") {
    if (num2 == 0) {
      return "Lỗi: Không thể chia cho 0";
    }
    return num1 / num2;
  } else if (operator == "%") {
    return num1 % num2;
  } else if (operator == "**") {
    return num1 ** num2;
  } else {
    return `Lỗi: Operator '${operator}' không hợp lệ`;
  }
}

// test thu
console.log(calculate(10, "+", 5));
console.log(calculate(10, "/", 0));
console.log(calculate(10, "^", 5));
console.log(calculate("abc", "+", 5));
console.log(calculate(2, "**", 10));
