// --- Data ---
const products = [
    { id: 1, name: "iPhone 16", price: 25990000, category: "phone", image: "https://placehold.co/400x300/4f46e5/fff?text=iPhone+16", rating: 4.5, inStock: true },
    { id: 2, name: "Samsung S24", price: 22990000, category: "phone", image: "https://placehold.co/400x300/16a34a/fff?text=Samsung+S24", rating: 4.3, inStock: true },
    { id: 3, name: "Xiaomi 14", price: 15990000, category: "phone", image: "https://placehold.co/400x300/dc2626/fff?text=Xiaomi+14", rating: 4.0, inStock: false },
    { id: 4, name: "Oppo Reno 12", price: 9990000, category: "phone", image: "https://placehold.co/400x300/d97706/fff?text=Oppo+Reno", rating: 3.8, inStock: true },
    { id: 5, name: "MacBook Pro M3", price: 49990000, category: "laptop", image: "https://placehold.co/400x300/7c3aed/fff?text=MacBook+Pro", rating: 4.9, inStock: true },
    { id: 6, name: "Dell XPS 15", price: 38990000, category: "laptop", image: "https://placehold.co/400x300/0891b2/fff?text=Dell+XPS", rating: 4.6, inStock: true },
    { id: 7, name: "Asus ROG G15", price: 29990000, category: "laptop", image: "https://placehold.co/400x300/be185d/fff?text=Asus+ROG", rating: 4.4, inStock: false },
    { id: 8, name: "iPad Pro M4", price: 28990000, category: "tablet", image: "https://placehold.co/400x300/0284c7/fff?text=iPad+Pro", rating: 4.7, inStock: true },
    { id: 9, name: "Samsung Tab S9", price: 18990000, category: "tablet", image: "https://placehold.co/400x300/15803d/fff?text=Tab+S9", rating: 4.2, inStock: true },
    { id: 10, name: "Xiaomi Pad 6", price: 8990000, category: "tablet", image: "https://placehold.co/400x300/b45309/fff?text=Pad+6", rating: 3.9, inStock: true },
    { id: 11, name: "Sony WH-1000XM5", price: 8490000, category: "audio", image: "https://placehold.co/400x300/6d28d9/fff?text=Sony+WH", rating: 4.8, inStock: true },
    { id: 12, name: "AirPods Pro 2", price: 6990000, category: "audio", image: "https://placehold.co/400x300/1d4ed8/fff?text=AirPods+Pro", rating: 4.6, inStock: true },
    { id: 13, name: "JBL Charge 5", price: 3490000, category: "audio", image: "https://placehold.co/400x300/047857/fff?text=JBL+Charge", rating: 4.1, inStock: false },
];

// --- State ---
let cartCount = 0;
let activeCategory = "all";
let searchQuery = "";
let sortValue = "default";

// --- Build UI skeleton ---
const app = document.querySelector("#app");

// Header
const header = document.createElement("div");
header.className = "header";
header.innerHTML = `
    <h1>🛒 Shop Online</h1>
    <div class="header-right">
        <div class="cart-wrap" aria-label="Giỏ hàng">
            🛒 <span class="cart-badge hidden" id="cartBadge">0</span>
        </div>
        <button id="darkToggle">🌙 Dark</button>
    </div>
`;
app.appendChild(header);

// Controls
const controls = document.createElement("div");
controls.className = "controls";

const searchInput = document.createElement("input");
searchInput.id = "searchInput";
searchInput.type = "text";
searchInput.placeholder = "🔍 Tìm sản phẩm...";
searchInput.setAttribute("aria-label", "Tìm kiếm");

const categories = ["all", "phone", "laptop", "tablet", "audio"];
const catNames = { all: "Tất cả", phone: "Điện thoại", laptop: "Laptop", tablet: "Tablet", audio: "Âm thanh" };

categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "cat-btn" + (cat === "all" ? " active" : "");
    btn.dataset.cat = cat;
    btn.textContent = catNames[cat];
    controls.appendChild(btn);
});

const sortSelect = document.createElement("select");
sortSelect.id = "sortSelect";
sortSelect.setAttribute("aria-label", "Sắp xếp");
[
    ["default", "Mặc định"],
    ["price-asc", "Giá tăng dần"],
    ["price-desc", "Giá giảm dần"],
    ["name-az", "Tên A-Z"],
    ["rating", "Đánh giá cao nhất"]
].forEach(([val, label]) => {
    const opt = document.createElement("option");
    opt.value = val;
    opt.textContent = label;
    sortSelect.appendChild(opt);
});

controls.prepend(searchInput);
controls.appendChild(sortSelect);
app.appendChild(controls);

// Grid
const grid = document.createElement("div");
grid.className = "grid";
grid.id = "productGrid";
app.appendChild(grid);

// --- Functions ---
function getFiltered() {
    let result = [...products];

    if (activeCategory !== "all") {
        result = result.filter(p => p.category === activeCategory);
    }

    if (searchQuery) {
        result = result.filter(p => p.name.toLowerCase().includes(searchQuery));
    }

    return result;
}

function getSorted(list) {
    if (sortValue === "price-asc") return list.sort((a, b) => a.price - b.price);
    if (sortValue === "price-desc") return list.sort((a, b) => b.price - a.price);
    if (sortValue === "name-az") return list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortValue === "rating") return list.sort((a, b) => b.rating - a.rating);
    return list;
}

function renderProducts() {
    grid.innerHTML = "";
    const list = getSorted(getFiltered());

    if (list.length === 0) {
        const msg = document.createElement("p");
        msg.className = "empty-msg";
        msg.textContent = "Không tìm thấy sản phẩm nào.";
        grid.appendChild(msg);
        return;
    }

    list.forEach(p => grid.appendChild(createCard(p)));
}

function createCard(p) {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.id = p.id;
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", p.name);

    const img = document.createElement("img");
    img.src = p.image;
    img.alt = p.name;

    const body = document.createElement("div");
    body.className = "card-body";

    const name = document.createElement("div");
    name.className = "card-name";
    name.textContent = p.name;

    const price = document.createElement("div");
    price.className = "card-price";
    price.textContent = p.price.toLocaleString("vi-VN") + " đ";

    const rating = document.createElement("div");
    rating.className = "card-rating";
    rating.textContent = "⭐ " + p.rating;

    const meta = document.createElement("div");
    meta.className = "card-meta" + (p.inStock ? "" : " out-of-stock");
    meta.textContent = p.inStock ? "Còn hàng" : "Hết hàng";

    const btn = document.createElement("button");
    btn.className = "add-cart-btn";
    btn.textContent = p.inStock ? "Thêm giỏ" : "Hết hàng";
    btn.disabled = !p.inStock;
    btn.dataset.id = p.id;

    body.append(name, price, rating, meta, btn);
    card.append(img, body);
    return card;
}

function filterByCategory(cat) {
    activeCategory = cat;
    document.querySelectorAll(".cat-btn").forEach(b => {
        b.classList.toggle("active", b.dataset.cat === cat);
    });
    renderProducts();
}

function searchProducts(query) {
    searchQuery = query.toLowerCase();
    renderProducts();
}

function sortProducts(val) {
    sortValue = val;
    renderProducts();
}

// --- Modal ---
function openModal(id) {
    const p = products.find(p => p.id === id);
    if (!p) return;

    const box = document.querySelector("#modalBox");
    box.innerHTML = "";

    const closeBtn = document.createElement("button");
    closeBtn.className = "modal-close";
    closeBtn.textContent = "✕";
    closeBtn.setAttribute("aria-label", "Đóng");
    closeBtn.addEventListener("click", closeModal);

    const img = document.createElement("img");
    img.src = p.image;
    img.alt = p.name;
    img.className = "modal-img";

    const name = document.createElement("div");
    name.className = "modal-name";
    name.textContent = p.name;

    const price = document.createElement("div");
    price.className = "modal-price";
    price.textContent = p.price.toLocaleString("vi-VN") + " đ";

    const info = document.createElement("div");
    info.className = "modal-info";
    info.textContent = `Danh mục: ${catNames[p.category]} | Đánh giá: ⭐ ${p.rating} | ${p.inStock ? "Còn hàng" : "Hết hàng"}`;

    box.append(closeBtn, img, name, price, info);
    document.querySelector("#modal").classList.remove("hidden");
}

function closeModal() {
    document.querySelector("#modal").classList.add("hidden");
}

// --- Events ---

// Category buttons (event delegation)
controls.addEventListener("click", (e) => {
    const btn = e.target.closest(".cat-btn");
    if (btn) filterByCategory(btn.dataset.cat);
});

// Search
searchInput.addEventListener("input", (e) => searchProducts(e.target.value));

// Sort
sortSelect.addEventListener("change", (e) => sortProducts(e.target.value));

// Card clicks (event delegation)
grid.addEventListener("click", (e) => {
    const cartBtn = e.target.closest(".add-cart-btn");
    if (cartBtn) {
        e.stopPropagation();
        cartCount++;
        const badge = document.querySelector("#cartBadge");
        badge.textContent = cartCount;
        badge.classList.remove("hidden");
        return;
    }

    const card = e.target.closest(".card[data-id]");
    if (card) openModal(Number(card.dataset.id));
});

// Modal backdrop click
document.querySelector("#modal").addEventListener("click", (e) => {
    if (e.target === document.querySelector("#modal")) closeModal();
});

// Dark mode
document.querySelector("#darkToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    document.querySelector("#darkToggle").textContent =
        document.body.classList.contains("dark-mode") ? "☀️ Light" : "🌙 Dark";
});

// Escape đóng modal
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
});

// Khởi động
renderProducts();