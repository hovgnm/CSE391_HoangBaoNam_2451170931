# PHẦN A — KIỂM TRA ĐỌC HIỂU (15 điểm)

## Câu A1 (5đ) — Sync vs Async

**Thứ tự output dự đoán:**

```
1 - Start
4 - End
3 - Promise
6 - Promise 2
2 - Timeout 0ms
7 - Nested timeout
5 - Timeout 100ms
```

**Giải thích:**

Đầu tiên JS chạy code đồng bộ từ trên xuống dưới nên `1 - Start` và `4 - End` in ra trước.

`setTimeout` dù là 0ms vẫn bị đẩy vào **Macrotask Queue** nên không chạy ngay. `Promise.resolve().then(...)` thì được đẩy vào **Microtask Queue**.

Sau khi call stack xong (hết code sync), JS ưu tiên chạy hết Microtask Queue trước rồi mới lấy task tiếp từ Macrotask Queue.

Vì vậy `3 - Promise` và `6 - Promise 2` chạy trước `2 - Timeout 0ms`.

Bên trong callback của `Promise 2` có thêm `setTimeout` nên `7 - Nested timeout` lại bị đẩy vào Macrotask Queue, chạy sau `2 - Timeout 0ms` (vì lúc đó `2` đã ở đầu hàng).

`5 - Timeout 100ms` chạy sau cùng vì delay 100ms lâu hơn hết.

**Tóm tắt thứ tự ưu tiên:**

```
Call Stack (sync code)
  → Microtask Queue (Promise.then)
    → Macrotask Queue (setTimeout, setInterval)
```

---

## Câu A2 (5đ) — Fetch API

```javascript
async function getData() {
  try {
    const response = await fetch("https://api.example.com/data");

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed:", error.message);
    return null;
  }
}
```

**1. `await fetch(...)` — `fetch` trả về gì? Tại sao cần `await`?**

`fetch()` trả về một **Promise** (chứa đối tượng `Response`), không phải data ngay. Nếu không có `await` thì biến `response` sẽ là một Promise object chưa resolve, mình không thể dùng được. Dùng `await` để "chờ" Promise đó resolve rồi mới gán kết quả vào biến `response`.

**2. `response.ok` — Khi nào `false`? Liệt kê 3 status codes:**

`response.ok` là `false` khi status code **không nằm trong khoảng 200-299**. Ví dụ:

- `404` — Not Found (URL không tồn tại)
- `500` — Internal Server Error (server bị lỗi)
- `403` — Forbidden (không có quyền truy cập)

_Lưu ý: `fetch` chỉ tự throw error khi mất mạng hoặc CORS, còn 404/500 thì vẫn "resolve" bình thường nên phải check `response.ok` thủ công._

**3. `response.json()` — Tại sao cần `await` lần nữa?**

Vì `response.json()` cũng trả về một **Promise** nữa. Nó cần đọc và parse body của response (body được stream từng phần), nên phải async. Nếu không `await` thì `data` vẫn là Promise chưa xử lý.

**4. `try...catch` — Catch những lỗi gì?**

- **Network error**: mất mạng, sai URL, server không phản hồi → `fetch` reject → bị catch
- **404, 500...**: Theo code này thì `throw new Error(...)` thủ công trong block `if (!response.ok)` → rơi vào catch
- **JSON parse error**: Nếu server trả về HTML hoặc text không phải JSON → `response.json()` throw lỗi → bị catch

_Lưu ý: `try...catch` không tự catch HTTP 404/500 nếu không có dòng `if (!response.ok) throw...`_

---

## Câu A3 (5đ) — Promise States

**Sơ đồ 3 trạng thái của Promise:**

```
                  ┌─────────────┐
                  │   PENDING   │  ← Trạng thái ban đầu
                  │  (Đang chờ) │
                  └──────┬──────┘
                         │
          ┌──────────────┴──────────────┐
          │ resolve(value)              │ reject(reason)
          ▼                             ▼
  ┌───────────────┐            ┌────────────────┐
  │   FULFILLED   │            │    REJECTED     │
  │  (Thành công) │            │    (Thất bại)   │
  │  .then(cb)    │            │   .catch(cb)    │
  └───────────────┘            └────────────────┘
```

Một Promise chỉ chuyển từ Pending sang 1 trong 2 trạng thái còn lại, và không thể đổi lại.

---

**Callback Hell là gì?**

Callback Hell (hay "Pyramid of Doom") là khi mình lồng quá nhiều callback vào nhau, code thụt vào ngày càng sâu, rất khó đọc và debug.

**Ví dụ 4 cấp Callback Hell:**

```javascript
// Lấy user → lấy orders của user → lấy chi tiết order → lấy sản phẩm
getUser(userId, function (user) {
  getOrders(user.id, function (orders) {
    getOrderDetail(orders[0].id, function (detail) {
      getProduct(detail.productId, function (product) {
        console.log("Sản phẩm:", product.name);
        // Code thụt vào cực sâu, khó đọc
      });
    });
  });
});
```

**Refactor thành async/await:**

```javascript
async function getProductFromUser(userId) {
  try {
    const user = await getUser(userId);
    const orders = await getOrders(user.id);
    const detail = await getOrderDetail(orders[0].id);
    const product = await getProduct(detail.productId);
    console.log("Sản phẩm:", product.name);
  } catch (error) {
    console.error("Lỗi:", error.message);
  }
}
```

Code async/await đọc như code thường, từ trên xuống dưới, dễ hiểu và dễ debug hơn nhiều.

---

# PHẦN C — PHÂN TÍCH (20 điểm)

---

## Câu C1 (10đ) — Error Handling Strategy

Giả sử đang xây app E-Commerce, chiến lược xử lý lỗi cho từng tình huống:

---

**1. Network errors (mất mạng giữa chừng)**

Khi mất mạng, `fetch` sẽ reject với `TypeError: Failed to fetch`. Cần bắt và hiển thị thông báo rõ ràng cho user.

```javascript
async function fetchData(url) {
  try {
    const response = await fetch(url);
    return response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      // Lỗi mạng
      showToast("❌ Mất kết nối mạng. Vui lòng kiểm tra lại.");
    }
    return null;
  }
}
```

---

**2. API errors (server trả 500, 404, 429)**

Mỗi loại status code cần xử lý khác nhau:

```javascript
async function fetchWithStatusCheck(url) {
  const response = await fetch(url);

  if (response.ok) return response.json();

  switch (response.status) {
    case 404:
      showToast("Không tìm thấy tài nguyên này.");
      break;
    case 429:
      // Too Many Requests — đợi rồi thử lại
      showToast("Bạn gọi API quá nhiều. Vui lòng chờ...");
      await delay(2000);
      return fetchWithStatusCheck(url); // thử lại 1 lần
    case 500:
      showToast("Server đang gặp sự cố. Thử lại sau.");
      break;
    default:
      showToast(`Lỗi: HTTP ${response.status}`);
  }

  return null;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```

---

**3. Timeout (API chậm > 10 giây)**

`fetch` mặc định không có timeout, phải tự implement bằng `AbortController` kết hợp `Promise.race`:

```javascript
async function fetchWithTimeout(url, ms = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ms);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      console.error("Request bị hủy do timeout sau", ms, "ms");
      showToast("⏱️ Server phản hồi quá chậm. Vui lòng thử lại.");
    } else {
      console.error("Lỗi fetch:", error.message);
    }
    return null;
  }
}

// Dùng:
const data = await fetchWithTimeout("https://api.example.com/products", 10000);
```

_Giải thích: `AbortController` tạo một signal. Sau `ms` milliseconds, `controller.abort()` được gọi, làm cho fetch bị hủy và throw `AbortError`._

---

**4. Retry logic (thử lại 3 lần nếu lỗi network)**

```javascript
async function fetchWithRetry(url, maxRetries = 3) {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const response = await fetch(url);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      attempt++;
      console.warn(`Lần thử ${attempt} thất bại: ${error.message}`);

      if (attempt >= maxRetries) {
        console.error("Đã thử tối đa", maxRetries, "lần, vẫn lỗi.");
        showToast("❌ Không thể tải dữ liệu sau nhiều lần thử.");
        return null;
      }

      // Đợi trước khi thử lại (exponential backoff đơn giản)
      await delay(1000 * attempt); // lần 1: 1s, lần 2: 2s
    }
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Dùng:
const users = await fetchWithRetry(
  "https://jsonplaceholder.typicode.com/users",
  3,
);
```

_Giải thích: Mỗi lần thất bại thì `attempt` tăng lên. Nếu chưa đến giới hạn thì đợi một chút rồi vòng lặp `while` chạy lại. Dùng "exponential backoff" đơn giản (đợi lâu hơn mỗi lần) để tránh làm server bị quá tải._

---

## Câu C2 (10đ) — Promise.all vs Promise.allSettled vs Promise.race

**Bảng so sánh:**

| Method          | Khi nào resolve?                                              | Khi nào reject?                           | Use case                                                |
| --------------- | ------------------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------- |
| `.all()`        | Khi **tất cả** promises fulfilled                             | Ngay khi **1 promise** reject (fail-fast) | Gọi nhiều API mà tất cả đều bắt buộc phải thành công    |
| `.allSettled()` | Khi **tất cả** promises kết thúc (dù pass hay fail)           | **Không bao giờ** reject                  | Dashboard nhiều widget — 1 lỗi không ảnh hưởng cái khác |
| `.race()`       | Khi **promise đầu tiên** kết thúc (dù fulfilled hay rejected) | Khi **promise đầu tiên** reject           | Implement timeout; lấy kết quả từ server nhanh nhất     |
| `.any()`        | Khi **1 promise bất kỳ** fulfilled                            | Khi **tất cả** reject (AggregateError)    | Fallback: thử nhiều nguồn, lấy cái nào thành công trước |

---

**Ví dụ code thực tế cho từng method:**

**`Promise.all()` — Load trang profile user (cần đủ hết):**

```javascript
// Trang profile cần cả 3: nếu thiếu 1 thì không hiển thị được
async function loadUserProfile(userId) {
  try {
    const [userInfo, userPosts, userFollowers] = await Promise.all([
      fetch(`/api/users/${userId}`).then((r) => r.json()),
      fetch(`/api/users/${userId}/posts`).then((r) => r.json()),
      fetch(`/api/users/${userId}/followers`).then((r) => r.json()),
    ]);

    renderProfile(userInfo, userPosts, userFollowers);
  } catch (error) {
    // 1 trong 3 API lỗi → vào catch ngay
    showError("Không thể tải trang profile, thử lại sau.");
  }
}
```

---

**`Promise.allSettled()` — Dashboard nhiều widget độc lập:**

```javascript
// Dashboard gồm: thời tiết, tỷ giá, tin tức — 1 cái lỗi vẫn hiện 2 cái kia
async function loadDashboard() {
  const results = await Promise.allSettled([
    fetch("https://api.open-meteo.com/v1/forecast?...").then((r) => r.json()),
    fetch("https://api.exchangerate.host/latest").then((r) => r.json()),
    fetch("https://jsonplaceholder.typicode.com/posts?_limit=5").then((r) =>
      r.json(),
    ),
  ]);

  const [weather, exchange, news] = results;

  if (weather.status === "fulfilled") {
    renderWeatherWidget(weather.value);
  } else {
    renderWidgetError("weather", "Không tải được thời tiết");
  }

  if (exchange.status === "fulfilled") {
    renderExchangeWidget(exchange.value);
  } else {
    renderWidgetError("exchange", "Không tải được tỷ giá");
  }

  if (news.status === "fulfilled") {
    renderNewsWidget(news.value);
  } else {
    renderWidgetError("news", "Không tải được tin tức");
  }
}
```

---

**`Promise.race()` — Implement timeout cho fetch:**

```javascript
// Nếu API không trả lời trong 5 giây thì báo lỗi
function timeout(ms) {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out")), ms),
  );
}

async function fetchWithRaceTimeout(url) {
  try {
    const data = await Promise.race([
      fetch(url).then((r) => r.json()),
      timeout(5000),
    ]);
    return data;
  } catch (error) {
    if (error.message === "Request timed out") {
      showToast("⏱️ API phản hồi quá chậm.");
    }
    return null;
  }
}

// Dùng:
const product = await fetchWithRaceTimeout(
  "https://api.example.com/products/1",
);
```

---

**`Promise.any()` — Fallback CDN, lấy nguồn nào trả lời trước:**

```javascript
// Thử tải file từ nhiều CDN — cái nào xong trước thì dùng
async function loadScriptFromCDN() {
  try {
    const scriptContent = await Promise.any([
      fetch("https://cdn1.example.com/lib.js").then((r) => r.text()),
      fetch("https://cdn2.example.com/lib.js").then((r) => r.text()),
      fetch("https://cdn3.example.com/lib.js").then((r) => r.text()),
    ]);

    console.log("Tải thành công từ CDN nhanh nhất!");
    evalScript(scriptContent);
  } catch (error) {
    // AggregateError — tất cả 3 CDN đều lỗi
    console.error("Tất cả CDN đều không phản hồi:", error);
    showError("Không tải được thư viện.");
  }
}
```

---

_Tóm lại: dùng `Promise.all` khi cần tất cả, `Promise.allSettled` khi muốn xử lý từng cái dù lỗi, `Promise.race` khi muốn lấy cái nhanh nhất hoặc làm timeout, `Promise.any` khi chỉ cần 1 cái thành công là đủ._
