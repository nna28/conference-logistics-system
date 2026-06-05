# 📦 Hệ thống Quản lý Logistics Tổ chức Hội thảo Đào tạo 
*(Conference Logistics Management System)*

Một nền tảng web Full-stack tập trung, được thiết kế nhằm số hóa và tự động hóa quy trình phối hợp phức tạp giữa nhiều phòng ban trong việc tổ chức các hội thảo đào tạo (Từ khâu đặt địa điểm, ký hợp đồng, sắp xếp chuyến bay chuyên gia đến vận chuyển tài liệu).

---

## Giá trị & Tính năng Nổi bật

- **Kiến trúc Phân quyền Đa tầng (RBAC):** Hệ thống phân quyền chặt chẽ cho 7 nhóm người dùng khác nhau (Admin, Bookings, Logistics Coordinator, Materials, Sales Manager, Training Consultant, Travel Agency). Đảm bảo tính bảo mật từ Backend (FastAPI Dependency) ra đến Frontend (React UI Rendering).
- **Quy trình Nghiệp vụ Xuyên suốt:** Xóa bỏ sự phân mảnh trong giao tiếp. Luồng công việc chảy mượt mà qua các module: `Workshops` ➡️ `Venues` & `Contracts` ➡️ `Travel Schedules` ➡️ `Material Requests` & `Shipments`.
- **Tác vụ Tự động (Background Tasks):** Ứng dụng `asyncio` của FastAPI để tự động quét hệ thống mỗi ngày và gửi thông báo nhắc nhở Điều phối viên Logistics chuẩn bị tài liệu trước 2 tuần khi hội thảo diễn ra.
- **Xử lý Dữ liệu Tối ưu:** Thiết kế CSDL chuẩn hóa với PostgreSQL & SQLAlchemy. Quản lý Connection Pooling chặt chẽ để đảm bảo hiệu năng khi có nhiều luồng truy cập đồng thời.

---

## 🛠️ Công nghệ Sử dụng (Tech Stack)

**Backend:**
- [Python 3.x](https://www.python.org/)
- [FastAPI](https://fastapi.tiangolo.com/) (Web Framework tốc độ cao)
- [SQLAlchemy](https://www.sqlalchemy.org/) (ORM)
- [PostgreSQL](https://www.postgresql.org/) (Database)
- [Uvicorn](https://www.uvicorn.org/) (ASGI Server)
- JWT (JSON Web Tokens) cho xác thực.

**Frontend:**
- [React.js](https://reactjs.org/)
- [Vite](https://vitejs.dev/) (Build tool cực nhanh)
- [Axios](https://axios-http.com/) (Call API với Interceptors)
- CSS3/HTML5 cho UI/UX Components.

---

##  Hướng dẫn Cài đặt & Chạy dự án 

### Yêu cầu cài đặt trước:
- Python 3.9+
- Node.js & npm (Phiên bản mới nhất)
- PostgreSQL (Đã tạo sẵn database)

### Bước 1: Cài đặt và khởi chạy Backend (FastAPI)

1. Mở terminal, di chuyển vào thư mục `backend`:
   ```bash
   cd backend