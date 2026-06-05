# User Directory - Bài B2

## API đã dùng

- **JSONPlaceholder**: `https://jsonplaceholder.typicode.com/users`
- Hỗ trợ GET, POST, PUT, DELETE (API giả lập, không lưu thật nhưng trả về response đúng format)

## Cách chạy

Mở file `index.html` trực tiếp trên trình duyệt.

## Chức năng

- **READ**: Load danh sách 10 users từ API, hiện skeleton loader khi đang tải
- **CREATE**: Nhấn "+ Thêm user" → Điền form → POST lên API → Thêm vào danh sách
- **UPDATE**: Nhấn "Sửa" → Form điền sẵn → PUT lên API → Cập nhật hiển thị
- **DELETE**: Nhấn "Xóa" → Confirm → DELETE API → Xóa khỏi bảng
- **SEARCH**: Gõ vào ô tìm kiếm để lọc theo tên/email (filter ở client)
- Toast thông báo khi thành công/lỗi
