let currentPage = 1;
const LIMIT = 20;
let isLoading = false;
let hasMore = true;

// Lấy ảnh từ JSONPlaceholder
async function fetchPhotos(page) {
  const url = `https://jsonplaceholder.typicode.com/photos?_page=${page}&_limit=${LIMIT}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Không tải được ảnh");
  return res.json();
}

async function loadMorePhotos() {
  if (isLoading || !hasMore) return;
  isLoading = true;

  const trigger = document.getElementById("load-trigger");
  trigger.innerHTML = '<span class="dots">⏳</span> Đang tải thêm ảnh...';

  try {
    const photos = await fetchPhotos(currentPage);

    if (photos.length === 0 || currentPage > 25) {
      // Giới hạn 25 trang cho demo
      hasMore = false;
      trigger.style.display = "none";
      document.getElementById("end-message").style.display = "block";
      return;
    }

    renderPhotos(photos);
    currentPage++;
  } catch (error) {
    trigger.innerHTML =
      "❌ Lỗi tải ảnh. " +
      '<span style="cursor:pointer;color:#3498db" onclick="loadMorePhotos()">Thử lại</span>';
  } finally {
    isLoading = false;
  }
}

// Dùng IntersectionObserver để lazy load từng ảnh
const imgObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src; // Gán src thật khi ảnh vào viewport
        img.addEventListener("load", () => img.classList.add("loaded"));
        imgObserver.unobserve(img); // Xong rồi thì bỏ observe
      }
    });
  },
  { rootMargin: "200px" },
); // Load trước 200px

function renderPhotos(photos) {
  const gallery = document.getElementById("gallery");

  photos.forEach((photo) => {
    const card = document.createElement("div");
    card.classList.add("photo-card");
    card.onclick = () => openLightbox(photo);

    const thumbUrl = `https://picsum.photos/seed/${photo.id}/300/300`;
    const fullUrl = `https://picsum.photos/seed/${photo.id}/800/600`;

    card.innerHTML = `
            <div class="photo-placeholder">🖼️</div>
            <img data-src="${thumbUrl}" alt="${photo.title}" />
        `;

    gallery.appendChild(card);

    // Observe ảnh để lazy load
    const img = card.querySelector("img");
    imgObserver.observe(img);

    card.dataset.full = fullUrl;
    card.dataset.title = photo.title;
  });
}

// ===== LIGHTBOX =====
function openLightbox(photo) {
  const fullUrl = `https://picsum.photos/seed/${photo.id}/800/600`;
  document.getElementById("lightbox-img").src = fullUrl;
  document.getElementById("lightbox-title").textContent = photo.title;
  document.getElementById("lightbox").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  document.getElementById("lightbox").classList.remove("open");
  document.body.style.overflow = "";
}

// Đóng lightbox khi nhấn ngoài ảnh
document.getElementById("lightbox").addEventListener("click", function (e) {
  if (e.target === this) closeLightbox();
});

// ===== INFINITE SCROLL =====
// Dùng IntersectionObserver để detect khi cuộn gần cuối trang
const scrollObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      loadMorePhotos();
    }
  },
  { threshold: 0.1 },
);

scrollObserver.observe(document.getElementById("load-trigger"));

// Load trang đầu tiên
loadMorePhotos();
