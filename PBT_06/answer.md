# PHẦN A — ĐỌC HIỂU

---

## Câu A1 (10đ) — Utility Classes

**Đoạn HTML phân tích:**

```html
<div
  class="flex items-center justify-between p-4 bg-white shadow-md rounded-lg 
            hover:shadow-xl transition-shadow duration-300"
>
  <img
    class="w-16 h-16 rounded-full object-cover"
    src="avatar.jpg"
    alt="User"
  />
  <div class="ml-4 flex-1">
    <h3 class="text-lg font-semibold text-gray-800 truncate">Nguyễn Văn A</h3>
    <p class="text-sm text-gray-500">Frontend Developer</p>
  </div>
  <button
    class="px-4 py-2 bg-blue-500 text-white rounded-md 
                   hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
  >
    Follow
  </button>
</div>
```

**Giải thích từng class:**

```
Phần div ngoài:
- flex              → display: flex
- items-center      → align-items: center
- justify-between   → justify-content: space-between
- p-4               → padding: 1rem (16px)
- bg-white          → background-color: white
- shadow-md         → box-shadow mức trung bình
- rounded-lg        → border-radius: 0.5rem (8px)
- hover:shadow-xl   → khi hover thì shadow to hơn
- transition-shadow → hiệu ứng chuyển đổi shadow mượt
- duration-300      → thời gian transition là 300ms

Phần img:
- w-16              → width: 4rem (64px)
- h-16              → height: 4rem (64px)
- rounded-full      → border-radius: 9999px → hình tròn
- object-cover      → object-fit: cover

Phần div con:
- ml-4              → margin-left: 1rem (16px)
- flex-1            → flex: 1 → chiếm hết không gian còn lại

Phần h3:
- text-lg           → font-size: 1.125rem (18px)
- font-semibold     → font-weight: 600
- text-gray-800     → color: #1f2937 (xám đậm)
- truncate          → text-overflow: ellipsis, tràn thì cắt ...

Phần p:
- text-sm           → font-size: 0.875rem (14px)
- text-gray-500     → color: #6b7280 (xám nhạt)

Phần button:
- px-4              → padding-left/right: 1rem (16px)
- py-2              → padding-top/bottom: 0.5rem (8px)
- bg-blue-500       → background-color: #3b82f6
- text-white        → color: white
- rounded-md        → border-radius: 0.375rem (6px)
- hover:bg-blue-600 → khi hover đổi màu tối hơn một chút
- focus:ring-2      → khi focus thêm ring dày 2px
- focus:ring-blue-300 → ring màu xanh nhạt
```

---

## Câu A2 (10đ) — Responsive & States

**1. Giải thích prefix responsive: `md:`, `lg:`, `xl:`**

Tailwind dùng Mobile-First, nghĩa là mặc định là mobile, prefix chỉ áp dụng từ breakpoint đó trở lên:

| Prefix | Breakpoint | Ý nghĩa            |
| ------ | ---------- | ------------------ |
| `md:`  | ≥ 768px    | Từ tablet trở lên  |
| `lg:`  | ≥ 1024px   | Từ desktop trở lên |
| `xl:`  | ≥ 1280px   | Màn hình lớn       |

**Ví dụ:** `md:grid-cols-2 lg:grid-cols-4` nghĩa là:

- Mobile (< 768px): dùng mặc định (không có prefix) → thường là `grid-cols-1`
- Tablet (≥ 768px): 2 cột
- Desktop (≥ 1024px): 4 cột

**2. Giải thích state modifiers**

| State modifier | Khi nào áp dụng                                           |
| -------------- | --------------------------------------------------------- |
| `hover:`       | Khi di chuột vào element                                  |
| `focus:`       | Khi element đang được focus (click vào input, tab vào...) |
| `active:`      | Khi đang giữ chuột / nhấn vào                             |
| `group-hover:` | Khi hover vào phần tử cha có class `group`                |

Ví dụ `group-hover:` hay dùng: hover vào card → đổi màu chữ bên trong.

**3. Ẩn trên mobile, hiện dạng flex trên tablet trở lên**

```html
<div class="hidden md:flex">...</div>
```

Giải thích:

- `hidden` → `display: none` (mặc định, áp dụng cho mobile)
- `md:flex` → `display: flex` từ 768px trở lên

Tương đương với `d-none d-md-flex` trong Bootstrap.

---

# PHẦN C — PHÂN TÍCH

---

## Câu C1 (10đ) — Tailwind vs CSS thuần

Lấy ví dụ component **Product Card** đã viết ở PBT trước bằng CSS thuần, so sánh với Tailwind:

**1. HTML file size**

| Tiêu chí       | CSS thuần                      | Tailwind                                   |
| -------------- | ------------------------------ | ------------------------------------------ |
| File CSS riêng | ~60–80 dòng CSS                | Không có file CSS riêng                    |
| HTML           | Ít class hơn, class tự đặt tên | Nhiều class hơn nhưng không cần viết CSS   |
| Tổng code      | HTML + CSS = ~120 dòng         | Chỉ HTML ~50 dòng (không tính classes dài) |

Tailwind không làm file HTML nhẹ hơn, nhưng **loại bỏ hoàn toàn file CSS riêng** — tổng code ít hơn.

**2. Maintainability (dễ đọc? dễ sửa?)**

_CSS thuần:_

- Dễ đọc HTML vì class tên có nghĩa: `class="product-card"`
- Sửa style phải mở 2 file (HTML + CSS)
- Dễ bị mất đồng bộ giữa HTML và CSS

_Tailwind:_

- HTML nhìn nhiều class, hơi khó đọc lúc đầu
- Sửa trực tiếp trong HTML luôn, không cần đổi qua file CSS
- Xóa element thì style cũng xóa theo → không lo CSS thừa

**3. Reusability — dùng `@apply`**

Nếu muốn dùng lại một nhóm class nhiều lần, có thể dùng `@apply` trong file CSS:

```css
/* styles.css */
.btn-primary {
  @apply bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md;
}
```

Sau đó dùng trong HTML như bình thường:

```html
<button class="btn-primary">Click me</button>
```

Tuy nhiên cách này làm mất đi điểm mạnh của Tailwind là utility-first. Chỉ nên dùng `@apply` khi một nhóm class lặp lại quá nhiều lần.

---

## Câu C2 (10đ) — Performance

**1. Tại sao Tailwind CSS file cuối cùng nhỏ hơn Bootstrap?**

Bootstrap ship toàn bộ framework ~150KB (minified), dù bạn chỉ dùng 10% tính năng.

Tailwind sau khi build chỉ giữ lại đúng những class **thực sự được dùng** trong HTML. Nếu project chỉ dùng 50 class thì file CSS chỉ chứa 50 class đó. Kết quả thường chỉ 5–20KB.

**2. Tailwind PurgeCSS (JIT — Just-In-Time)**

Tailwind JIT (từ v3 trở đi là mặc định) hoạt động như sau:

- Quét toàn bộ file HTML/JS/JSX trong project
- Tìm tất cả class Tailwind được dùng
- Chỉ generate CSS cho những class đó
- Class nào không dùng → không có trong file CSS output

Ví dụ: Nếu HTML không có `bg-purple-700` thì class đó sẽ không xuất hiện trong file CSS cuối cùng.

Ngoài ra JIT còn cho phép viết các giá trị tùy ý như `w-[350px]` hay `text-[#E63946]` mà không cần config thêm.

**3. Khi nào KHÔNG nên dùng TailwindCSS?**

**Tình huống 1 — Project có nhiều người, không đồng nhất:**
Nếu team lớn mà không có convention rõ ràng, mỗi người viết class theo cách khác nhau. HTML sẽ rất dài và khó review code. Lúc này CSS Module hoặc CSS-in-JS dễ quản lý hơn.

**Tình huống 2 — Viết email template HTML:**
Email client (Gmail, Outlook...) không hỗ trợ đầy đủ CSS hiện đại. Tailwind dùng nhiều tính năng CSS mới mà các email client không render được. Với email nên viết CSS inline thủ công.
