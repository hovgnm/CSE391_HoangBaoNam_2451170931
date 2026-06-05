// ============= API LAYER =============
const api = {
  baseURL: "https://jsonplaceholder.typicode.com",

  async getUsers() {
    const res = await fetch(`${this.baseURL}/users`);
    if (!res.ok) throw new Error(`Lỗi ${res.status}`);
    return res.json();
  },

  async createUser(data) {
    const res = await fetch(`${this.baseURL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Lỗi ${res.status}`);
    return res.json();
  },

  async updateUser(id, data) {
    const res = await fetch(`${this.baseURL}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Lỗi ${res.status}`);
    return res.json();
  },

  async deleteUser(id) {
    const res = await fetch(`${this.baseURL}/users/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`Lỗi ${res.status}`);
    return true;
  },
};

// ============= UI LAYER =============
const ui = {
  renderUsers(users) {
    const tbody = document.getElementById("user-tbody");
    if (users.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#999;padding:30px">Không có user nào</td></tr>`;
      return;
    }
    tbody.innerHTML = users
      .map(
        (u) => `
            <tr>
                <td>${u.id}</td>
                <td>${u.name}</td>
                <td>${u.email}</td>
                <td>${u.phone || "—"}</td>
                <td>
                    <button class="btn-edit" onclick="openEditForm(${u.id})">✏️ Sửa</button>
                    <button class="btn-delete" onclick="deleteUser(${u.id})">🗑️ Xóa</button>
                </td>
            </tr>
        `,
      )
      .join("");
  },

  showLoading() {
    const tbody = document.getElementById("user-tbody");
    tbody.innerHTML = [1, 2, 3]
      .map(
        () => `
            <tr><td colspan="5"><div class="skeleton"></div></td></tr>
        `,
      )
      .join("");
  },

  showError(msg) {
    this.showToast(msg, "error");
  },

  showSuccess(msg) {
    this.showToast(msg, "success");
  },

  showToast(msg, type) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.className = type;
    toast.style.display = "block";
    setTimeout(() => {
      toast.style.display = "none";
    }, 3000);
  },
};

// ============= STATE =============
let allUsers = []; // Lưu danh sách gốc để filter
let nextId = 100; // JSONPlaceholder trả id giả, mình tự tăng

// ============= LOAD USERS =============
async function loadUsers() {
  ui.showLoading();
  try {
    allUsers = await api.getUsers();
    ui.renderUsers(allUsers);
  } catch (error) {
    ui.showError("Không tải được danh sách: " + error.message);
    document.getElementById("user-tbody").innerHTML =
      `<tr><td colspan="5" style="text-align:center;color:#e74c3c;padding:20px">❌ Không tải được dữ liệu</td></tr>`;
  }
}

// ============= FILTER =============
function filterUsers() {
  const keyword = document.getElementById("search-input").value.toLowerCase();
  const filtered = allUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(keyword) ||
      u.email.toLowerCase().includes(keyword),
  );
  ui.renderUsers(filtered);
}

// ============= ADD =============
function openAddForm() {
  document.getElementById("modal-title").textContent = "Thêm User";
  document.getElementById("form-id").value = "";
  document.getElementById("form-name").value = "";
  document.getElementById("form-email").value = "";
  document.getElementById("form-phone").value = "";
  document.getElementById("modal-overlay").classList.add("open");
}

// ============= EDIT =============
function openEditForm(id) {
  const user = allUsers.find((u) => u.id === id);
  if (!user) return;

  document.getElementById("modal-title").textContent = "Sửa User";
  document.getElementById("form-id").value = user.id;
  document.getElementById("form-name").value = user.name;
  document.getElementById("form-email").value = user.email;
  document.getElementById("form-phone").value = user.phone || "";
  document.getElementById("modal-overlay").classList.add("open");
}

function closeModal() {
  document.getElementById("modal-overlay").classList.remove("open");
}

async function saveUser() {
  const id = document.getElementById("form-id").value;
  const name = document.getElementById("form-name").value.trim();
  const email = document.getElementById("form-email").value.trim();
  const phone = document.getElementById("form-phone").value.trim();

  if (!name || !email) {
    alert("Vui lòng nhập đủ tên và email!");
    return;
  }

  const data = { name, email, phone };

  try {
    if (id) {
      // Cập nhật
      await api.updateUser(id, data);
      // Cập nhật luôn trên mảng local (JSONPlaceholder không lưu thật)
      const idx = allUsers.findIndex((u) => u.id == id);
      if (idx !== -1) {
        allUsers[idx] = { ...allUsers[idx], name, email, phone };
      }
      ui.showSuccess("✅ Cập nhật thành công!");
    } else {
      // Thêm mới
      const created = await api.createUser(data);
      // JSONPlaceholder luôn trả id=11, mình gán id tự tăng
      created.id = nextId++;
      created.name = name;
      created.email = email;
      created.phone = phone;
      allUsers.unshift(created);
      ui.showSuccess("✅ Thêm user thành công!");
    }

    ui.renderUsers(allUsers);
    closeModal();
  } catch (error) {
    ui.showError("❌ Lỗi: " + error.message);
  }
}

// ============= DELETE =============
async function deleteUser(id) {
  if (!confirm("Bạn có chắc muốn xóa user này không?")) return;

  try {
    await api.deleteUser(id);
    allUsers = allUsers.filter((u) => u.id !== id);
    ui.renderUsers(allUsers);
    ui.showSuccess("✅ Đã xóa user!");
  } catch (error) {
    ui.showError("❌ Xóa thất bại: " + error.message);
  }
}

// Đóng modal khi click bên ngoài
document
  .getElementById("modal-overlay")
  .addEventListener("click", function (e) {
    if (e.target === this) closeModal();
  });

// Khởi chạy
loadUsers();
