# PHIẾU BÀI TẬP 09 — DOM MANIPULATION & EVENTS

## File trả lời — Phần A và C

> Tài liệu tham chiếu: `tuan_5_javascript_dom_async/19_dom_manipulation.md`

---

## PHẦN A — KIỂM TRA ĐỌC HIỂU

---

### Câu A1 (5đ) — DOM Tree

**1. Sơ đồ DOM tree:**

```
document
└── html
    └── body
        └── div#app
            ├── header
            │   ├── h1  →  "Todo App"
            │   └── nav
            │       ├── a.active  →  "All"
            │       ├── a  →  "Active"
            │       └── a  →  "Completed"
            └── main
                ├── form#todoForm
                │   ├── input#todoInput
                │   └── button  →  "Add"
                └── ul#todoList
                    ├── li.todo-item  →  "Learn HTML"
                    └── li.todo-item.completed  →  "Learn CSS"
```

**2. querySelector cho từng yêu cầu:**

```javascript
// Chọn thẻ <h1>
document.querySelector("h1");

// Chọn input trong form
document.querySelector("#todoForm input");
// hoặc
document.querySelector("#todoInput");

// Chọn tất cả .todo-item
document.querySelectorAll(".todo-item");

// Chọn link đang active
document.querySelector("a.active");
// hoặc
document.querySelector(".active");

// Chọn <li> đầu tiên trong #todoList
document.querySelector("#todoList li");

// Chọn tất cả <a> bên trong <nav>
document.querySelectorAll("nav a");
```

---

### Câu A2 (5đ) — innerHTML vs textContent

**Sự khác nhau:**

- `textContent` chỉ lấy/ghi **text thuần túy**, không đọc hoặc parse HTML. Nếu gán một chuỗi có thẻ HTML vào thì nó sẽ hiện ra như text bình thường chứ không render ra thẻ.
- `innerHTML` đọc và ghi **cả HTML**, nó sẽ parse chuỗi truyền vào thành các node HTML thật sự trên trang.

**Khi nào dùng cái nào:**

- Dùng `textContent` khi chỉ cần hiển thị text bình thường, đặc biệt là khi nội dung đó đến từ người dùng nhập vào — vì nó an toàn, không bị XSS.
- Dùng `innerHTML` khi cần render HTML (ví dụ render danh sách sản phẩm từ mảng data) nhưng nội dung phải là trusted, không phải do user gõ trực tiếp.

Ví dụ:

```javascript
// Dùng textContent — hiển thị tên user
document.querySelector(".username").textContent = user.name;

// Dùng innerHTML — render card sản phẩm (dữ liệu từ server, đã kiểm soát)
document.querySelector(".card").innerHTML =
  `<h2>${product.name}</h2><p>${product.desc}</p>`;
```

**Câu hỏi bảo mật — XSS:**

`innerHTML` nguy hiểm vì khi gán một chuỗi HTML vào, trình duyệt sẽ parse và thực thi nó. Nếu chuỗi đó chứa code JS (ví dụ qua thuộc tính `onerror`, `onload`...) thì đoạn code đó sẽ chạy luôn trên trang — đây là lỗ hổng XSS (Cross-Site Scripting).

```javascript
// ❌ Nguy hiểm — user nhập: <img src=x onerror="alert('Hacked!')">
const userInput = document.querySelector("#search").value;
document.querySelector("#result").innerHTML = userInput;
// → Trình duyệt render <img>, src=x lỗi → chạy onerror → alert hiện ra
// Kẻ tấn công có thể thay alert bằng code đánh cắp cookie

// ✅ Cách sửa — dùng textContent thay vì innerHTML
document.querySelector("#result").textContent = userInput;
// → Hiển thị đúng text "<img src=x onerror=...>" chứ không render thành HTML
```

---

### Câu A3 (5đ) — Event Bubbling

**Khi click vào button (không có stopPropagation):**

Event sẽ xảy ra ở `#btn` trước, rồi "nổi bọt" (bubble) lên các phần tử cha. Thứ tự output:

```
BUTTON
INNER
OUTER
```

Vì event bubbling đi từ element được click → cha → cha của cha → ... lên đến document.

**Nếu uncomment `e.stopPropagation()`:**

`stopPropagation()` ngăn event không bubble lên nữa. Event dừng lại ở `#btn`, các listener trên `#inner` và `#outer` không được gọi. Output chỉ còn:

```
BUTTON
```

---

## PHẦN C — DEBUG & PHÂN TÍCH

---

### Câu C1 (8đ) — Debug DOM Code

Tìm được **8 lỗi** trong code, liệt kê và sửa từng cái:

**Code gốc có lỗi + giải thích:**

**Lỗi 1:** Dùng `"onclick"` thay vì `"click"` trong addEventListener

```javascript
// ❌ Sai — không có event tên là "onclick"
document.querySelector("#decrementBtn").addEventListener("onclick", function() { ... });

// ✅ Sửa
document.querySelector("#decrementBtn").addEventListener("click", function() { ... });
```

**Lỗi 2:** Gán giá trị cho `countDisplay` thay vì cập nhật `.textContent`

```javascript
// ❌ Sai — countDisplay là const, không thể gán lại; và đây là DOM element
countDisplay = count;

// ✅ Sửa
countDisplay.textContent = count;
```

**Lỗi 3:** Dùng `innerHTML = null` để xóa list — không phải cách sai hẳn nhưng nên dùng `""` thay vì `null`

```javascript
// ❌ Có thể gây lỗi tùy browser
historyList.innerHTML = null;

// ✅ Sửa
historyList.innerHTML = "";
```

**Lỗi 4:** Thiếu `()` khi gọi `item.remove` — đây là method, phải gọi có ngoặc

```javascript
// ❌ Sai — chỉ tham chiếu đến method, không gọi nó
items.forEach((item) => {
  item.remove;
});

// ✅ Sửa
items.forEach((item) => {
  item.remove();
});
```

**Lỗi 5:** Khi load từ localStorage, `count` được lấy về là kiểu **string** chứ không phải number

```javascript
// ❌ Sai — localStorage.getItem trả về string, VD: "5" chứ không phải 5
count = localStorage.getItem("count");

// ✅ Sửa — parse sang số
count = parseInt(localStorage.getItem("count")) || 0;
```

**Lỗi 6:** Nút `#decrementBtn` dùng `innerHTML` để hiển thị count, nhất quán với phần increment dùng `innerHTML` — không phải lỗi nghiêm trọng nhưng nên đổi sang `textContent` để nhất quán và an toàn hơn:

```javascript
// Nên sửa cả 2 chỗ
countDisplay.textContent = count;
```

**Lỗi 7:** Phần reset không thêm lịch sử vào history list như phần increment và decrement — có thể là thiếu logic, nhưng nếu đây là intentional thì bỏ qua. Tuy nhiên nếu count xuống âm mà không có giới hạn thì cũng nên thêm check:

```javascript
// Nên thêm check nếu muốn không cho âm
document.querySelector("#decrementBtn").addEventListener("click", function () {
  if (count <= 0) return; // Tùy yêu cầu
  count--;
  countDisplay.textContent = count;
  // Thêm history như phần increment nếu cần
});
```

**Lỗi 8:** Khi load localStorage, nếu chưa có data (lần đầu mở trang) thì `localStorage.getItem("count")` trả về `null` → cần xử lý null:

```javascript
// ❌ count = null nếu chưa có gì trong localStorage
count = parseInt(localStorage.getItem("count"));

// ✅ Sửa — dùng || 0 để fallback
count = parseInt(localStorage.getItem("count")) || 0;
```

**Code đã sửa hoàn chỉnh:**

```javascript
const countDisplay = document.querySelector(".count");
const historyList = document.getElementById("history");

let count = 0;

document.querySelector("#incrementBtn").addEventListener("click", function () {
  count++;
  countDisplay.textContent = count; // Sửa: dùng textContent thay innerHTML

  const li = document.createElement("li");
  li.textContent = "Count changed to " + count;
  li.addEventListener("click", function () {
    deleteHistory(this);
  });
  historyList.append(li);
});

// Lỗi 1 đã sửa: "onclick" → "click"
document.querySelector("#decrementBtn").addEventListener("click", function () {
  count--;
  countDisplay.textContent = count; // Sửa: textContent
});

document.querySelector("#resetBtn").addEventListener("click", () => {
  count = 0;
  countDisplay.textContent = count; // Lỗi 2 đã sửa
  historyList.innerHTML = ""; // Lỗi 3 đã sửa: null → ""
});

function deleteHistory(element) {
  element.parentNode.removeChild(element);
}

document.querySelector("#clearHistory").addEventListener("click", () => {
  const items = historyList.querySelectorAll("li");
  items.forEach((item) => {
    item.remove(); // Lỗi 4 đã sửa: remove → remove()
  });
});

window.addEventListener("beforeunload", () => {
  localStorage.setItem("count", count);
  localStorage.setItem("history", historyList.innerHTML);
});

window.addEventListener("load", () => {
  count = parseInt(localStorage.getItem("count")) || 0; // Lỗi 5, 8 đã sửa
  countDisplay.textContent = count;
});
```

---

### Câu C2 (7đ) — Performance

**1. Tại sao bind event lên 1000 elements riêng lẻ là bad practice?**

Khi gán event listener cho từng element một:

- Tốn **bộ nhớ** vì mỗi listener là 1 object trong bộ nhớ. 1000 elements = 1000 listeners.
- Khi **thêm element mới** vào list (ví dụ thêm todo mới), element mới đó **không có listener** vì listener chỉ gán cho những element đã có lúc chạy `querySelectorAll`. Phải gán lại sau mỗi lần render.
- Khi **xóa element** thì listener vẫn còn "treo" trong bộ nhớ nếu không remove cẩn thận → memory leak.

**Event Delegation giải quyết thế nào:**

Thay vì gán cho từng `<li>`, gán **1 listener duy nhất** lên phần tử cha `<ul>`. Khi user click vào bất kỳ `<li>` con nào, event sẽ bubble lên `<ul>` và listener của cha sẽ bắt được. Dùng `e.target` để biết cụ thể element nào được click.

```javascript
// ❌ Tệ — 1000 listeners
document.querySelectorAll(".item").forEach((item) => {
  item.addEventListener("click", handleClick);
});

// ✅ Tốt — 1 listener duy nhất
document.querySelector("#list").addEventListener("click", (e) => {
  if (e.target.classList.contains("item")) {
    handleClick(e);
  }
});
```

Ưu điểm: tiết kiệm memory, tự động hoạt động với elements thêm sau, không lo memory leak.

**2. Refactor dùng DocumentFragment:**

```javascript
// ❌ Code cũ — 1000 lần reflow vì mỗi appendChild đều trigger render lại
for (let i = 0; i < 1000; i++) {
  const div = document.createElement("div");
  div.textContent = `Item ${i}`;
  document.body.appendChild(div); // 1000 lần reflow!
}

// ✅ Refactor dùng DocumentFragment — chỉ 1 lần reflow
const fragment = document.createDocumentFragment();

for (let i = 0; i < 1000; i++) {
  const div = document.createElement("div");
  div.textContent = `Item ${i}`;
  fragment.appendChild(div); // Thêm vào fragment — không ảnh hưởng DOM thật
}

document.body.appendChild(fragment); // Chỉ 1 lần duy nhất đụng vào DOM thật
```

**Tại sao nhanh hơn:**

`DocumentFragment` là một node "ảo" tồn tại trong memory, **không gắn vào DOM thật**. Khi append elements vào fragment, trình duyệt không cần tính toán lại layout (reflow) vì trang chưa thay đổi. Chỉ khi `appendChild(fragment)` vào body thì browser mới render 1 lần duy nhất. Với 1000 phần tử, từ 1000 lần reflow giảm xuống còn 1 lần — nhanh hơn rất nhiều.
