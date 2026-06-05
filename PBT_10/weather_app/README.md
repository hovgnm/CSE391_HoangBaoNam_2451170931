# Weather App - Bài B1

## API đã dùng

- **Geocoding API** (Open-Meteo): `https://geocoding-api.open-meteo.com/v1/search` - Lấy tọa độ từ tên thành phố
- **Weather API** (Open-Meteo): `https://api.open-meteo.com/v1/forecast` - Lấy thông tin thời tiết

Cả hai API đều miễn phí, không cần key.

## Cách chạy

Mở file `index.html` trực tiếp trên trình duyệt là xong, không cần cài gì thêm.

## Chức năng

- Nhập tên thành phố → nhấn "Tìm" hoặc Enter
- Hiện 3 trạng thái: Loading / Thành công / Lỗi
- Lưu 5 thành phố gần nhất vào LocalStorage
- Click vào lịch sử để tìm lại nhanh
