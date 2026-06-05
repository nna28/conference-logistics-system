# 📦 Hệ thống Quản lý Logistics Tổ chức Hội thảo Đào tạo
*(Conference Logistics Management System)*

Một nền tảng web Full-stack tập trung, được thiết kế nhằm số hóa và tự động hóa quy trình phối hợp phức tạp giữa nhiều phòng ban trong việc tổ chức các hội thảo đào tạo — từ khâu đặt địa điểm, ký hợp đồng, sắp xếp chuyến bay cho chuyên gia đến vận chuyển tài liệu.

---

## ✨ Giá trị & Tính năng Nổi bật

- **Kiến trúc Phân quyền Đa tầng (RBAC):** Hệ thống phân quyền chặt chẽ cho 7 nhóm người dùng (Admin, Bookings, Logistics Coordinator, Materials, Sales Manager, Training Consultant, Travel Agency). Đảm bảo tính bảo mật từ Backend (FastAPI Dependency) đến Frontend (React UI Rendering).

- **Quy trình Nghiệp vụ Xuyên suốt:** Xóa bỏ sự phân mảnh trong giao tiếp. Luồng công việc chảy mượt mà qua các module:
  `Workshops` ➡️ `Venues & Contracts` ➡️ `Travel Schedules` ➡️ `Material Requests & Shipments`

- **Tác vụ Tự động (Background Tasks):** Ứng dụng `asyncio` của FastAPI để tự động quét hệ thống mỗi ngày và gửi thông báo nhắc nhở Điều phối viên Logistics chuẩn bị tài liệu trước 2 tuần khi hội thảo diễn ra.

- **Xử lý Dữ liệu Tối ưu:** Thiết kế CSDL chuẩn hóa với PostgreSQL & SQLAlchemy. Quản lý Connection Pooling chặt chẽ để đảm bảo hiệu năng khi có nhiều luồng truy cập đồng thời.

---

## 🛠️ Công nghệ Sử dụng (Tech Stack)

**Backend:**
- [Python 3.x](https://www.python.org/)
- [FastAPI](https://fastapi.tiangolo.com/) — Web Framework tốc độ cao
- [SQLAlchemy](https://www.sqlalchemy.org/) — ORM
- [PostgreSQL](https://www.postgresql.org/) — Database
- [Uvicorn](https://www.uvicorn.org/) — ASGI Server
- JWT (JSON Web Tokens) — Xác thực người dùng

**Frontend:**
- [React.js](https://reactjs.org/)
- [Vite](https://vitejs.dev/) — Build tool cực nhanh
- [Axios](https://axios-http.com/) — Gọi API với Interceptors
- CSS3 / HTML5 — UI/UX Components

---

## 🚀 Hướng dẫn Cài đặt & Chạy Dự án

### Yêu cầu cài đặt trước

- Python 3.9+
- Node.js & npm (phiên bản mới nhất)
- PostgreSQL (đã tạo sẵn database)

---

### Bước 1: Cài đặt và khởi chạy Backend (FastAPI)

1. Mở terminal, di chuyển vào thư mục `backend`:
   ```bash
   cd backend
   ```

2. Tạo và kích hoạt môi trường ảo (Virtual Environment):
   ```bash
   python -m venv venv

   # Trên Windows:
   venv\Scripts\activate

   # Trên macOS/Linux:
   source venv/bin/activate
   ```

3. Cài đặt các thư viện cần thiết:
   ```bash
   pip install -r requirements.txt
   ```

4. Cấu hình Database:
   > Đảm bảo bạn đã cập nhật chuỗi kết nối PostgreSQL trong file `db/database.py` hoặc `.env`.

5. Khởi chạy server Backend:
   ```bash
   uvicorn main:app --reload
   ```

---

### Bước 2: Cài đặt và khởi chạy Frontend (React)

1. Mở một terminal **mới** (không dùng chung terminal với backend), di chuyển vào thư mục `frontend`:
   ```bash
   cd frontend
   ```

2. Cài đặt các thư viện:
   ```bash
   npm install
   ```

3. Khởi chạy server Frontend:
   ```bash
   npm run dev
   ```

---

## 📁 Cấu trúc Dự án (Folder Structure)

```
📦 Logistics-Management-System
 ┣ 📂 backend
 ┃ ┣ 📂 core          # Cấu hình bảo mật, JWT, hashing
 ┃ ┣ 📂 db            # Kết nối Database (SessionLocal)
 ┃ ┣ 📂 models        # SQLAlchemy Models (định nghĩa CSDL)
 ┃ ┣ 📂 routers       # Các API Endpoints (Auth, Workshops, Users...)
 ┃ ┣ 📂 schemas       # Pydantic Models (validate dữ liệu Input/Output)
 ┃ ┗ 📜 main.py       # Khởi chạy app FastAPI, tích hợp Routers & CORS
 ┗ 📂 frontend
   ┣ 📂 src
   ┃ ┣ 📂 api         # Cấu hình Axios & Interceptors
   ┃ ┣ 📂 components  # Các UI Components dùng chung (Sidebar, Header...)
   ┃ ┣ 📂 pages       # Các trang chính (Dashboard, Login, Workshops...)
   ┃ ┣ 📂 services    # Hàm gọi API cho từng thực thể (workshopService.js...)
   ┃ ┗ 📜 App.jsx     # Cấu hình Routing (React Router)
   ┗ 📜 vite.config.js  # Cấu hình Vite & Proxy
```

---

## 👥 Nhóm Thực hiện (Contributors)

| Họ và tên        | MSSV     |
|------------------|----------|
| Trần Lê Cương    | 23020517 |
| Ngô Ngọc Ánh     | 22024524 |
