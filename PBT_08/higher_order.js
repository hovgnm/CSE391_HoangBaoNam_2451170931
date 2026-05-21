// 1. pipe() — Nối chuỗi functions
function pipe(...fns) {
  return (value) => fns.reduce((v, fn) => fn(v), value);
}

const process = pipe(
  (x) => x * 2,
  (x) => x + 10,
  (x) => x.toString(),
  (x) => "Kết quả: " + x,
);
console.log(process(5)); // → "Kết quả: 20"

// 2. memoize() — Cache kết quả
function memoize(fn) {
  const cache = {};
  return function (...args) {
    const key = JSON.stringify(args);
    if (key in cache) return cache[key];
    cache[key] = fn(...args);
    return cache[key];
  };
}

const expensiveCalc = memoize((n) => {
  console.log("Đang tính...");
  let result = 0;
  for (let i = 0; i < n; i++) result += i;
  return result;
});
console.log(expensiveCalc(1000000)); // In "Đang tính..." → 499999500000
console.log(expensiveCalc(1000000)); // Không in "Đang tính...", lấy cache

// 3. debounce() — Chờ user ngừng gõ mới thực hiện
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const search = debounce((query) => {
  console.log("Searching:", query);
}, 500);

// Gọi liên tục, chỉ lần cuối mới thực sự chạy sau 500ms
search("i");
search("ip");
search("iph");
search("ipho");
search("iphon");
search("iphone"); // → chỉ cái này được log sau 500ms

// 4. retry() — Thử lại nếu lỗi
async function retry(fn, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await fn();
      return result;
    } catch (err) {
      console.log(`Lần ${attempt} thất bại: ${err.message}`);
      if (attempt === maxAttempts)
        throw new Error("Đã thử " + maxAttempts + " lần, vẫn lỗi!");
    }
  }
}

// Test retry với hàm giả lập lỗi
let count = 0;
const unstableApi = () =>
  new Promise((resolve, reject) => {
    count++;
    if (count < 3) reject(new Error("Server lỗi"));
    else resolve("Thành công!");
  });

retry(unstableApi, 3).then((res) => console.log(res)); // → thử 2 lần lỗi, lần 3 thành công
