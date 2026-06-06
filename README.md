# Smart Hotel Booking — Backend

Express.js + PostgreSQL backend cho hệ thống đặt phòng khách sạn.

---

## Tech Stack

- **Express.js** — HTTP framework
- **PostgreSQL** — Database (pg driver + connection pooling)
- **JWT** — Authentication
- **bcrypt** — Password hashing
- **Nodemailer** — Email service
- **Google Gemini** — AI chatbot

---

## Yêu cầu

| Tool       | Phiên bản |
| ---------- | --------- |
| Node.js    | >= 20     |
| PostgreSQL | >= 14     |

Optional:
- Cloudinary (upload ảnh)
- Gemini API key (AI chat)
- SMTP server (email thật — nếu không có sẽ dùng Ethereal)

---

## Cài đặt

```bash
cd smart-hotel-booking
npm install
cp .env.example .env  # Sửa thông tin DB, JWT_SECRET, ...
npm start
```

Server chạy tại `http://localhost:3000`. Health check: `GET /health`.

---

## Biến môi trường (.env)

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname?sslmode=require

# Auth
JWT_SECRET=<chuỗi-bí-mật>
PORT=3000

# Email (để trống → dùng Ethereal test)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=youremail@gmail.com
SMTP_PASS=<app-password>
SMTP_FROM="Smart Hotel <noreply@smarthotel.dev>"

# AI (optional — hỗ trợ nhiều key, phân cách bằng dấu phẩy, tự rotate khi hết quota)
GEMINI_API_KEY=AIza...key1,AIza...key2,AIza...key3
GEMINI_MODEL=gemini-2.5-flash-lite
```

---

## Scripts

| Lệnh          | Tác dụng                              |
| -------------- | ------------------------------------- |
| `npm start`    | Dev server (nodemon, auto-reload)     |
| `npm run dev`  | Chạy trực tiếp (không auto-reload)    |

---

## Kiến trúc

### Request flow

```
Request → app.js (cors, json, morgan)
  → route.js (URL mapping)
    → middleware (auth, validate)
      → controller.js (parse req → gọi service → res.json)
        → service.js (business logic)
          → model.js (SQL queries)
            → PostgreSQL
```

### Module structure (12 modules)

```
src/modules/<name>/
├── <name>.route.js
├── <name>.controller.js
├── <name>.service.js
├── <name>.model.js
└── <name>.validate.js
```

Modules: `auth`, `hotel`, `room`, `city`, `booking`, `payment`, `review`, `notification`, `inventory`, `image`, `admin`, `ai`.

### Common

```
src/common/
├── helpers/
│   ├── controller.js     # asyncHandler
│   ├── error.js          # createError(message, statusCode)
│   └── logger.js         # createLogger(scope)
└── middleware/
    ├── auth.middleware.js # JWT verify (bắt buộc)
    ├── optional-auth.js  # JWT verify (nếu có)
    ├── require-admin.js  # Chặn nếu không phải admin
    └── validate.js       # Validate request body/query
```

---

## Database

4 schema chính:

| Schema         | Bảng                                          |
| -------------- | --------------------------------------------- |
| `auth`         | `users`                                       |
| `hotel`        | `cities`, `hotels`, `room_types`, `room_images` |
| `booking`      | `bookings`, `payments`                        |
| `notification` | `notifications`                               |

---

## Tính năng chính

- **Auth**: Register, login (JWT), forgot password (email reset)
- **Hotels**: CRUD + filter, search, sort
- **Booking**: Transaction + row-level lock (FOR UPDATE) chống over-booking
- **Payment**: Giả lập thanh toán, refund
- **Review**: CRUD, tính rating trung bình
- **Notification**: In-app + email (fire-and-forget)
- **AI Chat**: Gemini integration, session-based, tool calling
- **AI Recommendations**: Scoring algorithm (price fit, guest fit, amenities, popularity, rating)
- **Admin**: Full CRUD cho mọi resource

---

## API Endpoints

| Method | Path                    | Auth     | Mô tả              |
| ------ | ----------------------- | -------- | ------------------- |
| GET    | `/health`               | —        | Health check        |
| POST   | `/auth/register`        | —        | Đăng ký             |
| POST   | `/auth/login`           | —        | Đăng nhập           |
| GET    | `/auth/me`              | user     | User hiện tại       |
| POST   | `/auth/forgot-password` | —        | Reset password      |
| GET    | `/hotels`               | optional | List + filter       |
| GET    | `/hotels/:id`           | —        | Chi tiết            |
| GET    | `/cities`               | —        | Danh sách city      |
| POST   | `/bookings`             | user     | Tạo booking         |
| GET    | `/bookings`             | user     | Booking của tôi     |
| POST   | `/payments/pay`         | user     | Thanh toán          |
| POST   | `/reviews`              | user     | Tạo review          |
| GET    | `/notifications`        | user     | Notifications       |
| POST   | `/ai/chat`              | optional | Chat với AI         |
| GET    | `/ai/recommendations`   | —        | Gợi ý phòng        |
| `*`    | `/admin/*`              | admin    | CRUD toàn bộ        |

---

## Cấu trúc thư mục

```
smart-hotel-booking/
├── .env
├── package.json
└── src/
    ├── app.js
    ├── server.js
    ├── config/
    │   └── db.js
    ├── common/
    │   ├── helpers/
    │   └── middleware/
    └── modules/
        ├── auth/
        ├── hotel/
        ├── room/
        ├── city/
        ├── booking/
        ├── payment/
        ├── review/
        ├── notification/
        ├── inventory/
        ├── image/
        ├── admin/
        └── ai/
```

---

## Troubleshooting

| Vấn đề                                    | Giải pháp |
| ----------------------------------------- | --------- |
| `PostgreSQL connection failed`            | Kiểm tra `DATABASE_URL` |
| `EADDRINUSE :::3000`                      | Port đang bị chiếm, đổi `PORT` |
| `JsonWebTokenError: invalid signature`    | `JWT_SECRET` không khớp, restart server |
| Email không gửi, có `previewUrl` trong log | Đang dùng Ethereal (thiếu SMTP config) |
| `LLM disabled: GEMINI_API_KEY not set`    | AI chat sẽ dùng rule-based fallback |
| Booking 409 conflict                      | Phòng đã hết — concurrent lock hoạt động đúng |

---

## Demo — Kịch bản đặt phòng qua AI Chatbot (Happy Case)

> Tính năng nổi bật: User chat bằng ngôn ngữ tự nhiên → AI tự tìm phòng + đặt phòng.

### Chuẩn bị trước khi demo

1. Backend đang chạy (`npm start`)
2. Frontend đang chạy (`npm run dev`)
3. **Đăng nhập** vào 1 tài khoản user (bắt buộc — nếu chưa login sẽ không đặt được)
4. Mở chatbot bằng cách bấm nút tròn góc phải dưới màn hình

### Kịch bản chat (gõ lần lượt)

**Bước 1 — Nêu nhu cầu:**
```
Tôi muốn đặt phòng khách sạn ở Hà Nội cho 2 người, khoảng 2-3 triệu/đêm
```
→ Bot sẽ trả danh sách phòng phù hợp (hiển thị dạng card có tên, giá, số khách).

**Bước 2 — Chọn phòng:**
```
Cho tôi đặt phòng đầu tiên
```
→ Bot sẽ hỏi ngày nhận phòng và trả phòng.

**Bước 3 — Cung cấp ngày:**
```
Từ ngày 15/7 đến 18/7/2026
```
→ Bot xác nhận lại: tên phòng, số đêm, tổng giá, và hỏi có chắc muốn đặt không.

**Bước 4 — Xác nhận đặt phòng:**
```
Đặt luôn, thanh toán tại khách sạn
```
→ Bot tạo booking thành công → hiện card xanh "Đặt phòng thành công — Mã #..."
→ Bot gợi ý thêm địa điểm ăn uống + vui chơi gần khách sạn / tại Hà Nội.

**Bước 5 — Xác minh (tuỳ chọn):**
- Bấm vào card "Xem lịch sử đặt phòng →" để chứng minh booking đã tạo thật trong hệ thống.
- Hoặc vào `/me/bookings` kiểm tra đơn mới.

### Kịch bản backup (Đà Nẵng — đã test thành công)

```
User: Tôi muốn tìm phòng khách sạn ở Hà Nội cho 2 người, giá dưới 2 triệu/đêm
User: Ngày 15/7 đến 18/7/2026
User: Phòng đầu tiên nhìn ổn đó, cho tôi đặt phòng này nhé
User: thanh toán tại khách sạn
→ Đặt phòng thành công ✅
```

### Lưu ý khi demo

- Nói **tự nhiên**, không cần format cứng — AI hiểu tiếng Việt thông thường.
- Nếu bot hỏi thêm thông tin → trả lời bình thường, nó nhớ context.
- Thời gian phản hồi ~3-8s (do gọi Gemini API). Nếu chậm hơn: "Hệ thống đang xử lý qua AI".
- Nếu gặp lỗi → bấm "Thử lại" hoặc gõ lại — hệ thống tự rotate API key.
- Sau khi đặt phòng thành công, bot sẽ **tự động gợi ý** địa điểm ăn uống + tham quan gần khách sạn.

### Seed data Hà Nội

Để có dữ liệu khách sạn Hà Nội cho demo, chạy:

```bash
psql "DATABASE_URL" -f seed-hanoi.sql
```

Bao gồm: 12 khách sạn (2-5 sao), 28 loại phòng, đầy đủ amenities. Giá từ 200k → 25 triệu/đêm.

### Luồng kỹ thuật phía sau

```
User nhắn tin
  → FE: POST /api/ai/chat { message, session_id }
  → BE: ai.service → llm.service → Gemini API
  → Gemini quyết định gọi tool: search_rooms / create_booking
  → BE thực thi tool (query DB / tạo booking với transaction lock)
  → Gemini format câu trả lời
  → FE hiển thị reply + room cards / booking success card
```
