# PHẦN A — KIỂM TRA ĐỌC HIỂU

## Câu A1 (10đ) — 5 Loại Positioning

| Position   | Vẫn chiếm chỗ trong flow? | Tham chiếu vị trí                                | Cuộn theo trang?                       | Use case                                                          |
| ---------- | ------------------------- | ------------------------------------------------ | -------------------------------------- | ----------------------------------------------------------------- |
| `static`   | Có                        | Không dùng top/left                              | Có                                     | Mặc định, không cần viết, dùng cho mọi element bình thường        |
| `relative` | Có                        | Vị trí gốc của chính nó                          | Có                                     | Dịch element nhẹ một chút, hoặc làm anchor cho thằng con absolute |
| `absolute` | Không                     | Cha `relative` gần nhất (hoặc html nếu không có) | Có (theo cha)                          | Badge, dropdown menu, tooltip                                     |
| `fixed`    | Không                     | Viewport (màn hình)                              | Không, luôn dính                       | Chat button góc màn hình, cookie banner, header cố định           |
| `sticky`   | Có (lúc đầu)              | Viewport (chỉ khi đã dính)                       | Theo flow → dính khi scroll tới ngưỡng | Sticky header, table header dính khi scroll                       |

**Câu hỏi thêm — Nearest Positioned Ancestor:**

`absolute` sẽ tham chiếu vào **cha gần nhất có position khác static** (tức là relative, absolute, fixed, hoặc sticky). Ví dụ:

```
body
  └── div.wrapper (position: relative)  ← đây là "nearest positioned ancestor"
        └── div.card (position: static)
              └── span.badge (position: absolute) ← tính tọa độ từ .wrapper
```

Nếu `.card` cũng có `position: relative` thì badge sẽ tính từ `.card` vì nó gần hơn.

**Khi nào absolute tham chiếu body?**
Khi đi ngược cây DOM lên không tìm thấy cha nào có `position != static` thì nó leo lên tận `<html>` luôn. Lúc đó badge hay dropdown sẽ bay lung tung trên trang, không bám vào component mình muốn nữa.

---

## Câu A2 (10đ) — Dự đoán Layout Flexbox & Grid

**Trường hợp 1:**

```
.container { display: flex; }
.item { flex: 1; }
// 4 items
```

Bố cục dự đoán: 4 cột đều nhau trên 1 hàng duy nhất, mỗi cái chiếm 25% chiều rộng

```
[  Item 1  ][  Item 2  ][  Item 3  ][  Item 4  ]
```

**Trường hợp 2:**

```
.container { display: flex; flex-wrap: wrap; }
.item { width: 45%; margin: 2.5%; }
// 6 items
```

Mỗi item chiếm 45% + margin 2 bên = khoảng 50%, nên 1 hàng chứa được 2 cái. 6 items → 3 hàng, 2 cột

```
[ Item 1 ][ Item 2 ]
[ Item 3 ][ Item 4 ]
[ Item 5 ][ Item 6 ]
```

**Trường hợp 3:**

```
.container { display: flex; justify-content: space-between; align-items: center; }
// 3 items
```

3 item trải đều từ trái sang phải, item 1 dính trái, item 3 dính phải, item 2 ở giữa. Tất cả căn dọc chính giữa container

```
[Item 1]        [Item 2]        [Item 3]
```

**Trường hợp 4:**

```
.container { display: grid; grid-template-columns: 200px 1fr 200px; gap: 20px; }
// 3 items
```

3 cột: cột trái cố định 200px, cột giữa lấy hết không gian còn lại, cột phải cố định 200px. Layout kiểu sidebar-content-ads

```
[200px][    1fr (co giãn)    ][200px]
```

**Trường hợp 5:**

```
.container { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
// 7 items
```

3 cột đều nhau. 7 items → hàng 1 có 3 item, hàng 2 có 3 item, hàng 3 chỉ có 1 item (nằm ở cột đầu tiên, 2 cột còn lại trống)

```
[Item 1][Item 2][Item 3]
[Item 4][Item 5][Item 6]
[Item 7][      ][      ]
```

---

# PHẦN C — SUY LUẬN

## Câu C1 (10đ) — Flexbox vs Grid: Khi nào dùng gì?

**1. Navigation bar ngang (logo + menu + buttons)**

→ Dùng **Flexbox**

Navbar là bố cục 1 chiều (ngang), `display: flex; justify-content: space-between` là đủ để logo nằm trái, menu giữa, nút đăng nhập phải. Không cần Grid vì không phải 2 chiều.

---

**2. Lưới ảnh Instagram (3 cột đều nhau, số ảnh không biết trước)**

→ Dùng **Grid**

Đây là bố cục 2 chiều rõ ràng. `grid-template-columns: repeat(3, 1fr)` là xong, Grid sẽ tự xếp ảnh vào hàng mới khi cần. Flexbox cũng làm được nhưng phải chỉnh `width` và `flex-wrap` phức tạp hơn, dễ bị lệch nếu số ảnh lẻ.

---

**3. Layout blog: main content + sidebar**

→ Dùng **Grid** (hoặc kết hợp)

Grid dễ định nghĩa vùng rõ ràng hơn: `grid-template-columns: 1fr 300px`. Sidebar có chiều rộng cố định, main co giãn. Bên trong mỗi vùng có thể dùng Flexbox thêm để xếp các thành phần nhỏ.

---

**4. Footer với 4 cột thông tin**

→ Dùng **Flexbox** hoặc **Grid** đều được, mình chọn **Grid**

`grid-template-columns: repeat(4, 1fr)` gọn hơn. Nếu responsive muốn về 2 cột trên tablet hay 1 cột trên mobile cũng dễ chỉnh. Flexbox cũng ổn nhưng phải set `flex: 1` hoặc `width: 25%` thủ công hơn.

---

**5. Card sản phẩm (ảnh trên, text giữa, nút dưới — nút luôn dính đáy)**

→ Dùng **Flexbox** (bên trong card)

Bên trong card dùng `display: flex; flex-direction: column; height: 100%`. Phần text ở giữa dùng `flex: 1` để chiếm hết không gian còn lại. Nút dưới dùng `margin-top: auto` → nút luôn bị đẩy xuống đáy card dù text ngắn hay dài.

---

## Câu C2 (10đ) — Debug Flexbox

**Lỗi 1: Cards không đều chiều cao — nút "Mua" bị nhảy lên/xuống**

**Nguyên nhân:** Card chưa dùng `flex-direction: column` và nút "Mua" không có `margin-top: auto`. Khi tên sản phẩm có độ dài khác nhau thì nút bị trôi vị trí tùy theo chiều cao text.

**Code sửa:**

```css
.card-container {
  display: flex;
  flex-wrap: wrap;
}
.card {
  width: 30%;
  margin: 1.5%;
  display: flex; /* thêm */
  flex-direction: column; /* thêm */
}
.card img {
  width: 100%;
}
.card h3 {
  font-size: 18px;
}
.card .btn {
  padding: 10px;
  margin-top: auto; /* thêm — đẩy nút xuống đáy */
}
```

---

**Lỗi 2: Items vẫn dính góc trái trên dù muốn căn giữa**

**Nguyên nhân:** `.hero` có `display: flex` nhưng thiếu `justify-content: center` và `align-items: center`. Flexbox mặc định căn về góc trái trên (`flex-start`), không tự căn giữa.

**Code sửa:**

```css
.hero {
  height: 100vh;
  display: flex;
  justify-content: center; /* thêm — căn giữa theo chiều ngang */
  align-items: center; /* thêm — căn giữa theo chiều dọc */
}
.hero-content {
  text-align: center;
}
```

---

**Lỗi 3: Sidebar bị co lại khi content quá dài**

**Nguyên nhân:** Flexbox mặc định có `flex-shrink: 1` nghĩa là cho phép item co lại khi container bị chật. Sidebar không được khai báo `flex-shrink: 0` nên khi `.content` có nhiều nội dung, sidebar bị ép co theo.

**Code sửa:**

```css
.layout {
  display: flex;
}
.sidebar {
  width: 250px;
  flex-shrink: 0; /* thêm — không cho sidebar co lại */
}
.content {
  flex: 1;
}
```