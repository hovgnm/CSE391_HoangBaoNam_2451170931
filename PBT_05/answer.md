# PHẦN A — KIỂM TRA ĐỌC HIỂU

## Câu A1 — Viewport & Mobile-First

_(Tham chiếu: `13_creating_responsive_layouts.md` — mục 3 "Bước 0: Viewport Meta Tag" và "Mobile-First vs Desktop-First")_

**1. Thẻ `<meta viewport>` chuẩn:**

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

Giải thích từng thuộc tính:

- `name="viewport"` — chỉ định đây là thẻ điều khiển viewport (khung nhìn) của trình duyệt di động
- `width=device-width` — bảo trình duyệt dùng **chiều rộng thật của màn hình thiết bị** thay vì giả định 980px như desktop
- `initial-scale=1.0` — tỉ lệ zoom ban đầu là 100%, không phóng to cũng không thu nhỏ khi trang mới load

**2. Nếu thiếu thẻ này, iPhone sẽ hiển thị thế nào?**

iPhone sẽ giả định trang rộng khoảng **980px** (như desktop), sau đó **thu nhỏ toàn bộ trang** để vừa màn hình điện thoại. Kết quả: chữ bé xíu, không đọc được, người dùng phải zoom in để xem — UX rất tệ. Đây là lý do thẻ viewport là bắt buộc cho mọi trang responsive.

**3. Mobile-First vs Desktop-First:**

_Mobile-First (khuyến nghị):_

```css
/* CSS mặc định = mobile, không cần @media */
.product-grid {
  grid-template-columns: 1fr; /* 1 cột — mobile */
}

/* Thêm complexity khi màn hình rộng hơn */
@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr); /* tablet */
  }
}
```

_Desktop-First (cách cũ):_

```css
/* CSS mặc định = desktop */
.product-grid {
  grid-template-columns: repeat(4, 1fr); /* 4 cột — desktop */
}

/* Rút gọn khi màn hình nhỏ hơn */
@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: 1fr; /* mobile */
  }
}
```

**Tại sao Mobile-First tốt hơn:** Mobile tải ít CSS hơn vì chỉ nhận styles cần thiết, không download cả desktop styles. Google Mobile-First Indexing cũng ưu tiên phiên bản mobile khi crawl. Ngoài ra, buộc dev phải nghĩ đến nội dung quan trọng nhất trước — tốt cho UX.

---

## Câu A2 — Breakpoints Chuẩn

_(Tham chiếu: `13_creating_responsive_layouts.md` — mục 3 "Breakpoints chuẩn")_

| Tên        | Min-width | Thiết bị đại diện             | Lưới sản phẩm nên có |
| ---------- | --------- | ----------------------------- | -------------------- |
| Mobile     | < 576px   | iPhone SE, điện thoại nhỏ     | 1 cột                |
| Mobile L   | ≥ 576px   | iPhone Plus, điện thoại ngang | 2 cột                |
| Tablet     | ≥ 768px   | iPad dọc, tablet              | 2–3 cột              |
| Desktop    | ≥ 992px   | Laptop nhỏ                    | 3–4 cột              |
| Desktop L  | ≥ 1200px  | Desktop, laptop lớn           | 4 cột                |
| Desktop XL | ≥ 1400px  | Màn hình 4K, ultrawide        | 4–6 cột              |

---

## Câu A3 — Đọc Media Queries

_(Tham chiếu: `13_creating_responsive_layouts.md` — mục 3 "Media Queries" và "Breakpoints chuẩn")_

Quy tắc áp dụng: CSS đọc từ trên xuống, `@media (min-width: X)` chỉ kích hoạt khi màn hình **rộng bằng hoặc hơn X**. Rule nào khớp **sau cùng** sẽ thắng (cascade).

| Chiều rộng màn hình | `.container` width | Giải thích                                                                 |
| ------------------- | ------------------ | -------------------------------------------------------------------------- |
| 375px (iPhone SE)   | `100%`             | Nhỏ hơn 576px → không có @media nào kích hoạt → dùng rule mặc định         |
| 600px               | `540px`            | ≥ 576px → rule đầu tiên kích hoạt. Chưa đến 768px → chỉ rule 576px áp dụng |
| 800px               | `720px`            | ≥ 768px → rule thứ hai ghi đè rule đầu. Chưa đến 992px                     |
| 1000px              | `960px`            | ≥ 992px → rule thứ ba ghi đè. Chưa đến 1200px                              |
| 1400px              | `1140px`           | ≥ 1200px → rule cuối cùng kích hoạt và thắng                               |

---

## Câu A4 — SCSS Basics

_(Tham chiếu: `16_sass_scss.md` — mục 3 "Core Technical Truth")_

**1. Variables — Khai báo bằng `$`, sửa 1 chỗ tất cả đổi theo**

```scss
$color-primary: #7c3aed;
$radius-md: 12px;

.btn {
  background: $color-primary;
  border-radius: $radius-md;
}
.badge {
  background: $color-primary;
}
// Đổi $color-primary → cả .btn và .badge tự đổi
```

**2. Nesting — Viết CSS lồng theo cấu trúc HTML, dùng `&` cho selector cha**

```scss
.card {
  background: white;
  border-radius: $radius-md;

  &__title {
    font-size: 18px;
  } // → .card__title
  &__body {
    padding: 16px;
  } // → .card__body

  &:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  } // → .card:hover
  &--featured {
    border: 2px solid $color-primary;
  } // → .card--featured
}
```

> ⚠️ Không lồng quá 3 cấp — selector quá dài, khó override.

**3. Mixins — Tái sử dụng khối CSS như một hàm, có thể nhận tham số**

```scss
// Định nghĩa
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

@mixin respond-to($bp) {
  @if $bp == tablet {
    @media (min-width: 768px) {
      @content;
    }
  } @else if $bp == desktop {
    @media (min-width: 1024px) {
      @content;
    }
  }
}

// Sử dụng
.modal {
  @include flex-center;
  position: fixed;
  inset: 0;
}
.spinner {
  @include flex-center;
}

.grid {
  grid-template-columns: 1fr;
  @include respond-to(tablet) {
    grid-template-columns: repeat(2, 1fr);
  }
  @include respond-to(desktop) {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

**4. `@extend` / Inheritance — Một selector kế thừa toàn bộ style của selector khác**

```scss
%btn-base {
  // placeholder (dùng % — không compile thành class riêng)
  padding: 10px 24px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
}

.btn-primary {
  @extend %btn-base;
  background: $color-primary;
  color: white;
}
.btn-danger {
  @extend %btn-base;
  background: #dc2626;
  color: white;
}
// Cả hai đều có padding, border-radius... không cần viết lại
```

**Tại sao browser không đọc được `.scss`?**

Browser chỉ hiểu CSS thuần. SCSS là ngôn ngữ mở rộng cần được **compile (biên dịch)** thành CSS trước khi deploy. Bước compile: dùng VS Code extension "Live Sass Compiler" → click "Watch Sass" → tự động tạo file `.css` mỗi khi lưu file `.scss`. Hoặc dùng lệnh `npx sass style.scss style.css --watch` trong terminal.

---

---

# PHẦN C — PHÂN TÍCH

## Câu C1 — Phân tích trang Shopee

_(Tham chiếu: `13_creating_responsive_layouts.md` — mục 5 "Real-world Layer: Tại sao Shopee load nhanh trên mobile?" và mục 6 "Test responsive NHANH")_

**Trang phân tích:** shopee.vn (mở bằng DevTools — Ctrl+Shift+M → Toggle Device Toolbar)

**1. Navigation thay đổi thế nào?**

| Kích thước       | Trạng thái navigation                                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Mobile (375px)   | Ẩn menu ngang. Hiện thanh tìm kiếm full-width ở trên, 5 icon tab bar (Home, Mall, Thông báo, Chat, Tôi) cố định ở đáy màn hình |
| Tablet (768px)   | Logo + thanh search + giỏ hàng. Menu danh mục chuyển thành dạng cuộn ngang                                                     |
| Desktop (1440px) | Header đầy đủ: logo, thanh search, đăng nhập/đăng ký, giỏ hàng. Dưới đó là navbar danh mục ngang                               |

**2. Lưới content thay đổi mấy cột?**

| Kích thước | Số cột lưới sản phẩm                  |
| ---------- | ------------------------------------- |
| 375px      | 2 cột (compact — tối ưu cho ngón tay) |
| 768px      | 3–4 cột                               |
| 1440px     | 5–6 cột                               |

**3. Elements bị ẩn trên mobile:**

- Sidebar danh mục bên trái (ẩn hoàn toàn)
- Banner quảng cáo dạng nhiều cột (thu về 1 banner full-width)
- Flash sale countdown bar thu nhỏ lại
- Footer với 4 cột thông tin → ẩn hoặc thu về accordion

**4. Font size có thay đổi không?**

Có — tiêu đề sản phẩm nhỏ hơn trên mobile (khoảng 12–13px so với 14–15px trên desktop), giá sản phẩm cũng thu nhỏ nhưng vẫn in đậm để dễ nhìn.

**5. Media queries tìm được trong DevTools (DevTools → Elements → Styles → tìm @media):**

```css
/* Shopee dùng max-width (Desktop-First approach) */
@media (max-width: 767px) {
  .shopee-header__logo {
    width: 80px;
  }
  .shopee-searchbar {
    width: 100%;
  }
}

@media (max-width: 1199px) {
  .shopee-product-list {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

> 📝 Nhận xét: Shopee dùng Desktop-First (max-width) — đây là dự án cũ được viết trước khi Mobile-First trở thành tiêu chuẩn. Dự án mới ngày nay hầu hết dùng Mobile-First (min-width).

---

## Câu C2 — Thiết kế Responsive Strategy: Trang Đặt Bàn Nhà Hàng

_(Tham chiếu: `13_creating_responsive_layouts.md` — mục 3 "Mobile-First" và mục 6 "Bài tập: Todo App → Responsive")_

**Wireframe 3 kích thước:**

_Mobile (< 768px):_

```
┌──────────────────────────┐
│  ☰  LOGO      📞 Gọi    │  ← Header: hamburger + số điện thoại
├──────────────────────────┤
│                          │
│    HERO IMAGE (full)     │  ← Ảnh full-width, cao 50vh
│   "Đặt bàn ngay hôm nay"│
│                          │
├──────────────────────────┤
│  📸 Ảnh 1   📸 Ảnh 2   │
│  📸 Ảnh 3   📸 Ảnh 4   │  ← Grid ảnh món ăn: 2 cột
│  📸 Ảnh 5   📸 Ảnh 6   │
├──────────────────────────┤
│       FORM ĐẶT BÀN       │  ← Form full-width, 1 cột
│  Ngày: [________]        │
│  Giờ:  [________]        │
│  Số người: [____]        │
│  Ghi chú: [________]     │
│       [ Đặt bàn ]        │
├──────────────────────────┤
│    BẢN ĐỒ (ẩn trên       │
│    mobile — không đủ     │  ← Ẩn để tiết kiệm không gian
│    không gian)           │
├──────────────────────────┤
│         FOOTER           │
└──────────────────────────┘
```

_Tablet (768px – 1023px):_

```
┌──────────────────────────────────────────┐
│  LOGO          Home  Menu  Về chúng tôi  │  ← Nav ngang đủ
├──────────────────────────────────────────┤
│         HERO IMAGE (full-width, 60vh)    │
├──────────────────────────────────────────┤
│  📸 Ảnh 1  │  📸 Ảnh 2  │  📸 Ảnh 3   │
│  📸 Ảnh 4  │  📸 Ảnh 5  │  📸 Ảnh 6   │  ← 3 cột ảnh
├────────────────────────┬─────────────────┤
│    FORM ĐẶT BÀN        │   BẢN ĐỒ       │  ← Form + Map ngang nhau
│  Ngày: [_______]       │   [Google Map]  │
│  Giờ:  [_______]       │                 │
│  Số người: [___]       │                 │
│  Ghi chú: [_______]    │                 │
│    [ Đặt bàn ngay ]    │                 │
└────────────────────────┴─────────────────┘
│               FOOTER                     │
└──────────────────────────────────────────┘
```

_Desktop (≥ 1024px):_

```
┌──────────────────────────────────────────────────────┐
│  LOGO    Home  Thực đơn  Về chúng tôi    📞 Liên hệ │
├──────────────────────────────────────────────────────┤
│              HERO IMAGE (full-width, 70vh)            │
│         "Trải nghiệm ẩm thực đỉnh cao"               │
│              [ Đặt bàn ngay ]                         │
├──────────────────────────────────────────────────────┤
│  📸 Ảnh 1 │ 📸 Ảnh 2 │ 📸 Ảnh 3 │ 📸 Ảnh 4 │...  │  ← 3 cột (2 ảnh đầu span 2 cột)
├───────────────────────────┬──────────────────────────┤
│      FORM ĐẶT BÀN         │                          │
│  Ngày:     [__________]   │                          │
│  Giờ:      [__________]   │      BẢN ĐỒ GOOGLE       │
│  Số người: [__________]   │      (chiếm 50% width)   │
│  Ghi chú:  [__________]   │                          │
│       [ Đặt bàn ngay ]    │                          │
├───────────────────────────┴──────────────────────────┤
│  Về chúng tôi │ Thực đơn │ Chính sách │ Liên hệ     │  ← Footer 4 cột
└──────────────────────────────────────────────────────┘
```

**CSS skeleton — Mobile-First với Grid:**

```css
/* ===== BASE: MOBILE ===== */
.page-layout {
  display: grid;
  grid-template-areas:
    "header"
    "hero"
    "gallery"
    "form"
    "footer";
  grid-template-columns: 1fr;
}

.header {
  grid-area: header;
}
.hero {
  grid-area: hero;
  height: 50vh;
}
.gallery {
  grid-area: gallery;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}
.form {
  grid-area: form;
}
.map {
  display: none;
} /* Ẩn bản đồ trên mobile */
.footer {
  grid-area: footer;
}

/* ===== TABLET (≥ 768px) ===== */
@media (min-width: 768px) {
  .page-layout {
    grid-template-areas:
      "header"
      "hero"
      "gallery"
      "form map"
      "footer";
    grid-template-columns: 1fr 1fr;
  }

  .gallery {
    grid-template-columns: repeat(3, 1fr);
  }
  .map {
    display: block;
    grid-area: map;
  } /* Hiện lại bản đồ */
  .form {
    grid-area: form;
  }
}

/* ===== DESKTOP (≥ 1024px) ===== */
@media (min-width: 1024px) {
  .page-layout {
    max-width: 1200px;
    margin: 0 auto;
    grid-template-areas:
      "header header"
      "hero   hero"
      "gallery gallery"
      "form   map"
      "footer footer";
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }

  .hero {
    height: 70vh;
  }
  .gallery {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

**Trả lời câu hỏi phân tích:**

- **Mobile — những gì bị ẩn?** Bản đồ Google Maps ẩn (`display: none`) để tránh chiếm không gian. Navigation thu về hamburger menu. Footer thu về 1 cột.
- **Tablet — Grid ảnh mấy cột? Bản đồ nằm đâu?** Grid ảnh 3 cột. Bản đồ hiện lại, nằm cạnh phải form đặt bàn theo layout 2 cột ngang.
- **Desktop — bao nhiêu cột? Sidebar có không?** Layout 2 cột (form | bản đồ), phần gallery 3 cột. Không cần sidebar riêng vì trang này đơn giản — nav nằm trong header là đủ.
