// State
let todos = JSON.parse(localStorage.getItem("todos")) || [];
let nextId = todos.length ? Math.max(...todos.map(t => t.id)) + 1 : 1;
let currentFilter = "all";

// DOM refs
const form = document.querySelector("#todoForm");
const input = document.querySelector("#todoInput");
const list = document.querySelector("#todoList");
const counter = document.querySelector("#counter");
const clearBtn = document.querySelector("#clearBtn");

// --- Render ---
function render() {
    list.innerHTML = "";

    let filtered = todos;
    if (currentFilter === "active") filtered = todos.filter(t => !t.done);
    if (currentFilter === "completed") filtered = todos.filter(t => t.done);

    if (filtered.length === 0) {
        const p = document.createElement("p");
        p.className = "empty-msg";
        p.textContent = "Không có việc nào!";
        list.appendChild(p);
    } else {
        filtered.forEach(todo => list.appendChild(createItem(todo)));
    }

    const leftCount = todos.filter(t => !t.done).length;
    counter.textContent = `${leftCount} items left`;

    save();
}

// Tạo 1 <li> từ todo object — dùng createElement, không dùng innerHTML
function createItem(todo) {
    const li = document.createElement("li");
    li.dataset.id = todo.id;
    if (todo.done) li.classList.add("completed");

    const span = document.createElement("span");
    span.className = "todo-text";
    span.textContent = todo.text;

    const delBtn = document.createElement("button");
    delBtn.className = "del-btn";
    delBtn.textContent = "❌";
    delBtn.setAttribute("aria-label", "Xóa");

    li.appendChild(span);
    li.appendChild(delBtn);
    return li;
}

// --- Event Delegation trên #todoList ---
list.addEventListener("click", (e) => {
    const li = e.target.closest("li[data-id]");
    if (!li) return;
    const id = Number(li.dataset.id);

    // Xóa
    if (e.target.classList.contains("del-btn")) {
        todos = todos.filter(t => t.id !== id);
        render();
        return;
    }

    // Toggle completed khi click vào text
    if (e.target.classList.contains("todo-text")) {
        todos = todos.map(t => t.id === id ? { ...t, done: !t.done } : t);
        render();
    }
});

// Double-click để edit
list.addEventListener("dblclick", (e) => {
    if (!e.target.classList.contains("todo-text")) return;
    const li = e.target.closest("li[data-id]");
    if (!li) return;

    const id = Number(li.dataset.id);
    const todo = todos.find(t => t.id === id);

    const editInput = document.createElement("input");
    editInput.className = "edit-input";
    editInput.value = todo.text;

    li.replaceChild(editInput, e.target);
    editInput.focus();

    function saveEdit() {
        const newText = editInput.value.trim();
        if (newText) {
            todos = todos.map(t => t.id === id ? { ...t, text: newText } : t);
        }
        render();
    }

    editInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") saveEdit();
        if (e.key === "Escape") render();
    });
    editInput.addEventListener("blur", saveEdit);
});

// --- Form submit ---
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    todos.push({ id: nextId++, text, done: false });
    input.value = "";
    input.focus();
    render();
});

// --- Filter buttons ---
document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        currentFilter = btn.dataset.filter;
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        render();
    });
});

// --- Clear completed ---
clearBtn.addEventListener("click", () => {
    todos = todos.filter(t => !t.done);
    render();
});

// --- LocalStorage ---
function save() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Khởi động
render();