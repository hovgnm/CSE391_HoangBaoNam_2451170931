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
