// ============ GALLERY ============

// Tạo 9 ảnh placeholder
const images = [];
for (let i = 1; i <= 9; i++) {
  images.push(`https://placehold.co/600x400?text=Anh+${i}`);
}

let currentIndex = 0;
let slideshowTimer = null;
let isPlaying = false;

const thumbList = document.getElementById("thumbList");
const slideInfo = document.getElementById("slideInfo");
const slideshowStatus = document.getElementById("slideshowStatus");
const imgModal = document.getElementById("imgModal");
const modalImg = document.getElementById("modalImg");
const closeModal = document.getElementById("closeModal");

// Tạo thumbnails
images.forEach(function (src, i) {
  const img = document.createElement("img");
  img.src = src;
  img.className = "thumb";
  img.alt = "Ảnh " + (i + 1);
  img.setAttribute("tabindex", "0");
  img.setAttribute("aria-label", "Ảnh " + (i + 1));

  if (i === 0) img.classList.add("active");

  // Click để mở modal
  img.addEventListener("click", function () {
    openModal(i);
  });

  // Enter/Space để mở modal khi focus bằng bàn phím
  img.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openModal(i);
    }
  });

  thumbList.appendChild(img);
});

function updateActive(idx) {
  const thumbs = thumbList.querySelectorAll(".thumb");
  thumbs.forEach(function (t) {
    t.classList.remove("active");
  });
  thumbs[idx].classList.add("active");
  slideInfo.textContent = "Ảnh " + (idx + 1) + " / " + images.length;
  currentIndex = idx;
}

function openModal(idx) {
  updateActive(idx);
  modalImg.src = images[idx];
  imgModal.classList.remove("hidden");
  closeModal.focus();
}

function closeModalFn() {
  imgModal.classList.add("hidden");
  thumbList.querySelectorAll(".thumb")[currentIndex].focus();
}

closeModal.addEventListener("click", closeModalFn);

// Slideshow
function startSlideshow() {
  isPlaying = true;
  slideshowStatus.textContent = "Slideshow: ON ▶";
  slideshowTimer = setInterval(function () {
    let next = (currentIndex + 1) % images.length;
    updateActive(next);
  }, 2000);
}

function stopSlideshow() {
  isPlaying = false;
  slideshowStatus.textContent = "Slideshow: OFF";
  clearInterval(slideshowTimer);
}

// ============ KEYBOARD EVENTS ============
document.addEventListener("keydown", function (e) {
  const modalOpen = !imgModal.classList.contains("hidden");
  const cmdOpen = !cmdOverlay.classList.contains("hidden");

  // Escape đóng modal hoặc command palette
  if (e.key === "Escape") {
    if (modalOpen) closeModalFn();
    if (cmdOpen) closeCmdPalette();
    return;
  }

  // Ctrl+K mở command palette
  if (e.ctrlKey && e.key === "k") {
    e.preventDefault();
    openCmdPalette();
    return;
  }

  // Nếu đang gõ trong input thì không xử lý gallery shortcuts
  if (e.target.tagName === "INPUT") return;

  // Mũi tên trái phải
  if (e.key === "ArrowLeft") {
    let prev = (currentIndex - 1 + images.length) % images.length;
    updateActive(prev);
  }

  if (e.key === "ArrowRight") {
    let next = (currentIndex + 1) % images.length;
    updateActive(next);
  }

  // Phím 1-9 nhảy đến ảnh
  if (e.key >= "1" && e.key <= "9") {
    let idx = parseInt(e.key) - 1;
    if (idx < images.length) updateActive(idx);
  }

  // Space play/pause slideshow
  if (e.key === " ") {
    e.preventDefault();
    if (isPlaying) {
      stopSlideshow();
    } else {
      startSlideshow();
    }
  }
});

// ============ COMMAND PALETTE ============

const commands = [
  {
    icon: "📄",
    label: "New file",
    action: function () {
      alert("Tạo file mới!");
    },
  },
  {
    icon: "💾",
    label: "Save file",
    action: function () {
      alert("Đã lưu!");
    },
  },
  {
    icon: "📂",
    label: "Open folder",
    action: function () {
      alert("Mở thư mục!");
    },
  },
  {
    icon: "🔍",
    label: "Search in files",
    action: function () {
      alert("Tìm kiếm!");
    },
  },
  {
    icon: "⚙️",
    label: "Settings",
    action: function () {
      alert("Cài đặt!");
    },
  },
  {
    icon: "ℹ️",
    label: "About",
    action: function () {
      alert("Keyboard App v1.0");
    },
  },
  {
    icon: "🌙",
    label: "Toggle dark mode",
    action: function () {
      document.body.classList.toggle("dark");
    },
  },
];

const cmdOverlay = document.getElementById("cmdOverlay");
const cmdInput = document.getElementById("cmdInput");
const cmdList = document.getElementById("cmdList");

let focusedCmd = -1;

function openCmdPalette() {
  cmdOverlay.classList.remove("hidden");
  cmdInput.value = "";
  focusedCmd = -1;
  renderCommands(commands);
  cmdInput.focus();
}

function closeCmdPalette() {
  cmdOverlay.classList.add("hidden");
}

function renderCommands(list) {
  cmdList.innerHTML = "";
  focusedCmd = -1;
  list.forEach(function (cmd, i) {
    const li = document.createElement("li");
    li.innerHTML = `<span class="icon">${cmd.icon}</span>${cmd.label}`;
    li.setAttribute("role", "option");
    li.setAttribute("aria-label", cmd.label);
    li.setAttribute("tabindex", "0");

    li.addEventListener("click", function () {
      cmd.action();
      closeCmdPalette();
    });

    cmdList.appendChild(li);
  });
}

// Search realtime trong command palette
cmdInput.addEventListener("input", function () {
  const keyword = this.value.toLowerCase();
  const filtered = commands.filter(function (c) {
    return c.label.toLowerCase().includes(keyword);
  });
  renderCommands(filtered);
});

// Điều hướng bằng bàn phím trong command palette
cmdInput.addEventListener("keydown", function (e) {
  const items = cmdList.querySelectorAll("li");

  if (e.key === "ArrowDown") {
    e.preventDefault();
    focusedCmd = Math.min(focusedCmd + 1, items.length - 1);
    updateCmdFocus(items);
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();
    focusedCmd = Math.max(focusedCmd - 1, 0);
    updateCmdFocus(items);
  }

  if (e.key === "Enter") {
    if (focusedCmd >= 0 && items[focusedCmd]) {
      items[focusedCmd].click();
    }
  }
});

function updateCmdFocus(items) {
  items.forEach(function (item) {
    item.classList.remove("focused");
  });
  if (focusedCmd >= 0 && items[focusedCmd]) {
    items[focusedCmd].classList.add("focused");
    items[focusedCmd].scrollIntoView({ block: "nearest" });
  }
}

// Click ra ngoài đóng palette
cmdOverlay.addEventListener("click", function (e) {
  if (e.target === cmdOverlay) closeCmdPalette();
});
