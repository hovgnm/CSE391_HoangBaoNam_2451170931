# PHẦN A — KIỂM TRA ĐỌC HIỂU

## Câu A1 — var / let / const

| Đoạn | Dự đoán            | Kết quả thực tế                           | Đúng không |
| ---- | ------------------ | ----------------------------------------- | ---------- |
| 1    | `undefined`        | `undefined`                               | ✅         |
| 2    | lỗi ReferenceError | `Cannot access 'y' before initialization` | ✅         |
| 3    | lỗi TypeError      | `Assignment to constant variable.`        | ✅         |
| 4    | `[1, 2, 3, 4]`     | `[1, 2, 3, 4]`                            | ✅         |
| 5    | trong: 2, ngoài: 1 | trong: 2, ngoài: 1                        | ✅         |

**Giải thích kết quả bất ngờ:**

- **Đoạn 1**: `var` bị hoist lên đầu hàm/file nên JS "biết" x tồn tại, nhưng giá trị chưa gán nên ra `undefined`. Lúc đầu mình tưởng sẽ bị lỗi.

- **Đoạn 2**: `let` không bị hoist như `var`, nó có "Temporal Dead Zone" (TDZ) - tức là từ đầu block cho đến dòng khai báo thì không dùng được, đọc vào là lỗi ngay.

- **Đoạn 4**: Cái này mình thấy bất ngờ nhất. `const` không cho gán lại biến (`arr = something` thì lỗi), nhưng **nội dung bên trong** array/object vẫn sửa được. `push()` không gán lại biến arr, chỉ thêm phần tử vào mảng thôi nên ok.

---

## Câu A2 — Data Types & Coercion

| Câu                | Dự đoán     | Kết quả                    |
| ------------------ | ----------- | -------------------------- |
| `typeof null`      | "null"      | "object" ❌ (bất ngờ!)     |
| `typeof undefined` | "undefined" | "undefined" ✅             |
| `typeof NaN`       | "NaN"       | "number" ❌ (bất ngờ!)     |
| `"5" + 3`          | "53"        | "53" ✅                    |
| `"5" - 3`          | 2           | 2 ✅                       |
| `"5" * "3"`        | 15          | 15 ✅                      |
| `true + true`      | 2           | 2 ✅                       |
| `[] + []`          | không biết  | ""                         |
| `[] + {}`          | không biết  | "[object Object]"          |
| `{} + []`          | không biết  | 0 (khi chạy ngoài console) |

**Tại sao `"5" + 3` khác `"5" - 3`?**

Vì toán tử `+` trong JS có 2 nhiệm vụ: cộng số VÀ nối chuỗi. Khi có ít nhất 1 string thì nó ưu tiên nối chuỗi → `"5" + 3 = "53"`.

Còn `-` chỉ có 1 nhiệm vụ là trừ số, không nối chuỗi được, nên JS tự ép `"5"` thành số 5 rồi tính → `5 - 3 = 2`.

---

## Câu A3 — == vs ===

| Câu                  | Dự đoán | Kết quả             |
| -------------------- | ------- | ------------------- |
| `5 == "5"`           | true    | true                |
| `5 === "5"`          | false   | false               |
| `null == undefined`  | false   | true ❌             |
| `null === undefined` | false   | false ✅            |
| `NaN == NaN`         | true    | false ❌ (bất ngờ!) |
| `0 == false`         | true    | true ✅             |
| `0 === false`        | false   | false ✅            |
| `"" == false`        | true    | true ✅             |

**Nên dùng `===` hay `==`?**

Nên dùng `===` (strict equality). Vì `==` tự ép kiểu nên ra kết quả khó đoán, dễ gây bug. Ví dụ `null == undefined` ra `true` là khá kỳ lạ. Dùng `===` thì an toàn hơn vì so sánh cả kiểu dữ liệu lẫn giá trị.

---

## Câu A4 — Truthy & Falsy

**Tất cả giá trị Falsy trong JS:**

- `false`
- `0` (và `-0`)
- `""` (chuỗi rỗng)
- `null`
- `undefined`
- `NaN`

**Dự đoán kết quả:**

| Câu             | In ra không | Giải thích                                 |
| --------------- | ----------- | ------------------------------------------ |
| `if ("0")` → A  | **Có in**   | "0" là chuỗi có ký tự, không rỗng → truthy |
| `if ("")` → B   | Không in    | chuỗi rỗng → falsy                         |
| `if ([])` → C   | **Có in**   | array rỗng vẫn là object → truthy          |
| `if ({})` → D   | **Có in**   | object rỗng vẫn là object → truthy         |
| `if (null)` → E | Không in    | null → falsy                               |
| `if (0)` → F    | Không in    | 0 → falsy                                  |
| `if (-1)` → G   | **Có in**   | -1 khác 0 → truthy                         |
| `if (" ")` → H  | **Có in**   | space không phải chuỗi rỗng → truthy       |

Cái `"0"` và `[]` lúc đầu mình đoán sai, cứ nghĩ là falsy.

---

## Câu A5 — Template Literals

```javascript
// Cách 1:
let greeting = `Xin chào ${name}! Bạn ${age} tuổi.`;

// Cách 2:
let url = `https://api.example.com/users/${userId}/orders?page=${page}`;

// Cách 3:
let html = `<div class="card">
    <h2>${title}</h2>
    <p>${description}</p>
    <span>Giá: ${price}đ</span>
</div>`;
```

Template literal tiện hơn nhiều, không cần dùng dấu `+` liên tục và không cần escape dấu `"` bên trong nữa.

---

# PHẦN C — SUY LUẬN

## Câu C1 — Debug JavaScript

**Liệt kê các lỗi tìm được:**

**Lỗi 1:** `if (giaSauGiam = 0)` — dùng `=` (gán) thay vì `==` hoặc `===` (so sánh)

```javascript
// sai
if (giaSauGiam = 0)
// đúng
if (giaSauGiam === 0)
```

**Lỗi 2:** `tinhGiaGiamGia("100000", 20)` — truyền giá là string `"100000"` thay vì số `100000`. Hàm không check kiểu dữ liệu của `giaBan` nên tính sai (`"100000" * 20 / 100` JS sẽ ép kiểu nhưng vẫn là lỗi tiềm ẩn)

**Lỗi 3:** Hàm không validate `giaBan` — chỉ check `phanTramGiam` thôi, chưa check xem `giaBan` có phải số không

**Lỗi 4:** Thiếu dấu chấm phẩy `;` ở nhiều dòng (không bắt buộc trong JS nhưng nên có cho nhất quán)

**Lỗi 5:** Lỗi ẩn với `var i` trong vòng lặp + `setTimeout`:

```javascript
// lỗi - dùng var
for (var i = 0; i < 5; i++) {
  setTimeout(function () {
    console.log("Item " + i); // in ra 5 lần "Item 5" thay vì 0,1,2,3,4
  }, 1000);
}
```

Giải thích: `var` không có block scope, chỉ có function scope. Khi setTimeout chạy sau 1 giây thì vòng for đã chạy xong, `i` lúc đó = 5 rồi. Nên cả 5 lần đều in "Item 5".

Sửa bằng `let`:

```javascript
// đúng - dùng let
for (let i = 0; i < 5; i++) {
  setTimeout(function () {
    console.log("Item " + i); // mỗi lần có i riêng: 0,1,2,3,4
  }, 1000);
}
```

`let` có block scope nên mỗi lần lặp tạo ra một `i` riêng, setTimeout giữ đúng giá trị đó.

**Lỗi 6:** Thiếu xử lý trường hợp `giaBan` âm — gia bán không thể là số âm nhưng hàm không check.

**Code đã sửa:**

```javascript
function tinhGiaGiamGia(giaBan, phanTramGiam) {
  // them check cho giaBan
  if (isNaN(giaBan) || giaBan < 0) {
    return "Giá bán không hợp lệ";
  }
  giaBan = Number(giaBan); // chuyen thanh so neu la string

  if (phanTramGiam < 0 || phanTramGiam > 100) {
    return "Phần trăm giảm không hợp lệ";
  }

  var giamGia = (giaBan * phanTramGiam) / 100;
  let giaSauGiam = giaBan - giamGia;

  if (giaSauGiam === 0) {
    // sua = thanh ===
    console.log("Sản phẩm miễn phí!");
  }

  return giaSauGiam;
}

// sua var i thanh let i
for (let i = 0; i < 5; i++) {
  setTimeout(function () {
    console.log("Item " + i);
  }, 1000);
}
```
