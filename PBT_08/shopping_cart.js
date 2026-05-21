function createCart() {
  let items = [];
  let discountAmount = 0;

  return {
    // Thêm sản phẩm (nếu đã có → tăng quantity)
    addItem(product, quantity = 1) {
      const existing = items.find((i) => i.id === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        items.push({ ...product, quantity });
      }
    },

    // Xóa sản phẩm theo id
    removeItem(productId) {
      items = items.filter((i) => i.id !== productId);
    },

    // Cập nhật số lượng
    updateQuantity(productId, newQuantity) {
      const item = items.find((i) => i.id === productId);
      if (item) item.quantity = newQuantity;
    },

    // Tính tổng tiền (trước giảm giá)
    getTotal() {
      const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      return subtotal - discountAmount;
    },

    // Áp dụng mã giảm giá
    applyDiscount(code) {
      const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      if (code === "SALE10") discountAmount = subtotal * 0.1;
      else if (code === "SALE20") discountAmount = subtotal * 0.2;
      else if (code === "FREESHIP") discountAmount = 30000;
      else console.log("Mã giảm giá không hợp lệ!");
    },

    // In giỏ hàng dạng bảng
    printCart() {
      console.log("┌────────────────────────────────────────────────────┐");
      console.log("│ #  │ Sản phẩm         │ SL │ Đơn giá     │ Tổng       │");
      items.forEach((item, index) => {
        const total = item.price * item.quantity;
        console.log(
          `│ ${index + 1}  │ ${item.name.padEnd(16)} │  ${item.quantity} │ ${item.price.toLocaleString().padStart(11)} │ ${total.toLocaleString().padStart(10)} │`,
        );
      });
      console.log("├────────────────────────────────────────────────────┤");
      console.log(
        `│ Tổng cộng:                       ${this.getTotal().toLocaleString()}đ │`,
      );
      console.log("└────────────────────────────────────────────────────┘");
    },

    // Lấy tổng số sản phẩm (tổng quantity)
    getItemCount() {
      return items.reduce((sum, i) => sum + i.quantity, 0);
    },

    // Xóa toàn bộ giỏ
    clearCart() {
      items = [];
      discountAmount = 0;
    },
  };
}

// === TEST ===
const cart = createCart();

cart.addItem({ id: 1, name: "iPhone 16", price: 25990000 }, 1);
cart.addItem({ id: 3, name: "AirPods Pro", price: 6990000 }, 2);
cart.addItem({ id: 1, name: "iPhone 16", price: 25990000 }, 1); // Tăng lên 2

cart.printCart();

cart.applyDiscount("SALE10");
console.log("\nSau khi áp mã SALE10:");
cart.printCart();

console.log("Số SP:", cart.getItemCount()); // → 4
cart.removeItem(3);
console.log("Sau xóa AirPods:", cart.getItemCount()); // → 2
