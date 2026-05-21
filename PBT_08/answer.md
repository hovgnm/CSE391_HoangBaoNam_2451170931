# PHIẾU BÀI TẬP 08 — ANSWERS.MD

## JavaScript Functions, Arrays & Objects

> **Họ tên:** [Nguyễn Văn A]
> **MSSV:** [xxxxxxxx]
> **Lớp:** [xxx]

---

## PHẦN A — KIỂM TRA ĐỌC HIỂU (20 điểm)

---

### Câu A1 (5đ) — Function Declaration vs Expression vs Arrow

**3 cách viết hàm `tinhThueBaoHiem(luong)`:**

```javascript
// Cách 1: Function Declaration
function tinhThueBaoHiem(luong) {
  const thue = luong > 11000000 ? luong * 0.1 : 0;
  const thuc_nhan = luong - thue;
  return { thue, thuc_nhan };
}

// Cách 2: Function Expression
const tinhThueBaoHiem = function (luong) {
  const thue = luong > 11000000 ? luong * 0.1 : 0;
  const thuc_nhan = luong - thue;
  return { thue, thuc_nhan };
};

// Cách 3: Arrow Function
const tinhThueBaoHiem = (luong) => {
  const thue = luong > 11000000 ? luong * 0.1 : 0;
  const thuc_nhan = luong - thue;
  return { thue, thuc_nhan };
};
```

**Về hoisting:**

3 cách này khác nhau về hoisting. Function Declaration được hoisting hoàn toàn, tức là có thể gọi hàm trước khi khai báo trong file và vẫn chạy bình thường. Còn Function Expression và Arrow Function thì không có hoisting — nếu gọi trước khi khai báo sẽ bị lỗi `ReferenceError` hoặc `Cannot access before initialization`.

Ví dụ minh họa:

```javascript
// Function Declaration - gọi trước khai báo OK
console.log(tinhThueBaoHiem1(12000000)); // chạy được

function tinhThueBaoHiem1(luong) {
  const thue = luong > 11000000 ? luong * 0.1 : 0;
  return { thue, thuc_nhan: luong - thue };
}

// Function Expression - gọi trước khai báo LỖI
console.log(tinhThueBaoHiem2(12000000)); // ReferenceError!

const tinhThueBaoHiem2 = function (luong) {
  const thue = luong > 11000000 ? luong * 0.1 : 0;
  return { thue, thuc_nhan: luong - thue };
};
```

---

### Câu A2 (5đ) — Scope & Closure

**Đoạn 1 — Dự đoán output:**

```javascript
console.log(c.increment()); // 1
console.log(c.increment()); // 2
console.log(c.increment()); // 3
console.log(c.decrement()); // 2
console.log(c.getCount()); // 2
```

Giải thích: biến `count` được khởi tạo bằng `0` bên trong hàm `counter()`. Các methods trả về nhờ closure nên chúng nhớ và truy cập được biến `count` này dù hàm `counter()` đã chạy xong. Mỗi lần gọi `increment()` thì `count` tăng lên 1, gọi `decrement()` thì giảm xuống 1.

**Đoạn 2 — Dự đoán output (sau 200ms):**

```
var: 3
var: 3
var: 3
let: 0
let: 1
let: 2
```

**Giải thích tại sao `var` và `let` cho kết quả khác nhau:**

Với `var`: biến `i` không có block scope, nó thuộc về function scope (hoặc global). Khi vòng lặp chạy xong, `i` đã là `3`. Vì setTimeout là bất đồng bộ nên callback mãi chờ đến khi vòng lặp kết thúc rồi mới chạy, lúc đó cả 3 callback cùng đọc cùng một biến `i = 3`.

Với `let`: biến `j` có block scope — mỗi vòng lặp tạo ra một `j` riêng biệt, các callback trong closure nhớ đúng giá trị `j` của lần lặp đó (0, 1, 2).

---

### Câu A3 (5đ) — Array Methods

```javascript
const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// 1. Lấy các số chẵn
nums.filter((n) => n % 2 === 0);

// 2. Nhân mỗi số với 3
nums.map((n) => n * 3);

// 3. Tính tổng tất cả
nums.reduce((tong, n) => tong + n, 0);

// 4. Tìm số đầu tiên > 7
nums.find((n) => n > 7);

// 5. Kiểm tra CÓ số > 10 không
nums.some((n) => n > 10);

// 6. Kiểm tra TẤT CẢ đều > 0
nums.every((n) => n > 0);

// 7. Tạo mảng "Số X là [chẵn/lẻ]"
nums.map((n) => `Số ${n} là ${n % 2 === 0 ? "chẵn" : "lẻ"}`);

// 8. Đảo ngược mảng (không mutate gốc)
[...nums].reverse();
```

---

### Câu A4 (5đ) — Object Destructuring & Spread

**Dự đoán output:**

```javascript
const {
  name,
  price,
  specs: { ram, color },
} = product;
console.log(name, price, ram, color);
// → iPhone 16 25990000 8 Titan

console.log(specs);
// → ReferenceError: specs is not defined
// Vì khi destructure specs: { ram, color } thì chỉ lấy ram và color
// bên trong specs, biến specs không được tạo ra.

const updated = { ...product, price: 23990000, sale: true };
console.log(updated.price); // → 23990000  (bị ghi đè)
console.log(updated.sale); // → true
console.log(product.price); // → 25990000  (gốc không đổi)

const copy = { ...product };
copy.specs.ram = 16;
console.log(product.specs.ram); // → 16
```

**Giải thích câu cuối:** Spread `{ ...product }` chỉ là **shallow copy**. Object `specs` bên trong vẫn là cùng reference với bản gốc, không phải copy mới. Vì vậy khi thay đổi `copy.specs.ram` thì `product.specs.ram` cũng bị đổi theo. Để tránh điều này cần deep copy nested object: `copy.specs = { ...product.specs }`.

---

## PHẦN C — SUY LUẬN (20 điểm)

---

### Câu C1 (10đ) — Refactor Code

**Code sau khi refactor (≤ 10 dòng):**

```javascript
function processOrders(orders) {
  return orders
    .filter(({ status, total }) => status === "completed" && total > 100000)
    .map(({ id, customer, total }) => ({
      id,
      customer,
      total,
      discount: total * 0.1,
      finalTotal: total * 0.9,
    }))
    .sort((a, b) => b.finalTotal - a.finalTotal);
}
```

Code gốc dùng 2 vòng `for` lồng nhau để sort (O(n²)) rất chậm và dài. Refactor lại dùng `filter` để lọc điều kiện, `map` để tạo object mới với discount/finalTotal, `sort` để sắp xếp giảm dần — ngắn hơn nhiều và dễ đọc hơn. Destructuring trong parameter của `map` giúp code gọn hơn nữa.

---

### Câu C2 (10đ) — Thiết kế API

**Implement `miniArray`:**

```javascript
const miniArray = {
  map(arr, fn) {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      result.push(fn(arr[i], i, arr));
    }
    return result;
  },

  filter(arr, fn) {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      if (fn(arr[i], i, arr)) {
        result.push(arr[i]);
      }
    }
    return result;
  },

  reduce(arr, fn, initialValue) {
    let acc = initialValue;
    for (let i = 0; i < arr.length; i++) {
      acc = fn(acc, arr[i], i, arr);
    }
    return acc;
  },
};

// Test
console.log(miniArray.map([1, 2, 3], (x) => x * 2)); // → [2, 4, 6]
console.log(miniArray.filter([1, 2, 3, 4], (x) => x > 2)); // → [3, 4]
console.log(miniArray.reduce([1, 2, 3, 4], (a, b) => a + b, 0)); // → 10
```

**Giải thích:**

- `map`: duyệt qua từng phần tử, gọi `fn(phần_tử)` và push kết quả vào mảng mới, trả về mảng mới.
- `filter`: duyệt qua từng phần tử, chỉ push vào mảng kết quả nếu `fn(phần_tử)` trả về `true`.
- `reduce`: dùng biến `acc` (accumulator) bắt đầu từ `initialValue`, mỗi vòng lặp gọi `fn(acc, phần_tử)` và cập nhật `acc`, cuối cùng trả về `acc`.

Truyền thêm `i` và `arr` vào callback để đúng với signature của built-in (dù test không dùng đến).
