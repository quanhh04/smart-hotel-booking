# Smart Hotel Booking — Backend (Express + PostgreSQL)

> Tài liệu này phục vụ **giảng dạy** — giải thích từng bước cài đặt, cách app chạy, lý do dùng từng thư viện. Đọc tuần tự là hiểu được toàn bộ.

---

## 1. Giới thiệu

Backend của hệ thống đặt phòng khách sạn, viết bằng **Express.js** và **PostgreSQL**.

Tính năng chính:

- Đăng ký / đăng nhập (JWT), quên mật khẩu (gửi email).
- Quản lý khách sạn, phòng, thành phố, ảnh.
- Đặt phòng (có **transaction + row-level lock** để chống over-booking).
- Thanh toán (giả lập, không kết nối cổng thật).
- Đánh giá (review) sau khi check-out.
- Thông báo (notification) trong app + email.
- Trợ lý AI (chat dùng Gemini, gợi ý phòng dùng thuật toán scoring).
- Khu vực admin (CRUD toàn bộ resource).

---

## 2. Yêu cầu hệ thống

| Tool       | Phiên bản |
| ---------- | --------- |
| Node.js    | **>= 20** |
| npm        | đi kèm Node |
| PostgreSQL | >= 14 (cloud hoặc local) |

Tuỳ chọn:

- Tài khoản **Cloudinary** (nếu cần upload ảnh thật).
- API key **Gemini** (Google AI Studio) nếu muốn bật chat AI.
- SMTP server (Gmail / Mailtrap / Ethereal) cho email — nếu không cấu hình, code tự fallback **Ethereal** (chỉ preview).

---

## 3. Cài đặt nhanh

```bash
# 1. Clone & vào thư mục
cd smart-hotel-booking

# 2. Cài dependency
npm install

# 3. Tạo file .env (xem mục 4)
cp .env.example .env   # nếu có sẵn, hoặc tạo tay theo template bên dưới

# 4. Khởi tạo DB schema (xem mục 5 — đang đọc trực tiếp từ DB sẵn có)

# 5. Chạy dev server (auto-reload nhờ nodemon)
npm start
```

Server sẽ lắng nghe ở `http://localhost:3000` (mặc định). Test nhanh:

```bash
curl http://localhost:3000/health
# {"status":"ok"}
```

---

## 4. Biến môi trường (.env)

```env
# === DATABASE ===
# Connection string Postgres. Ví dụ Neon/Supabase/Render/Local:
DATABASE_URL=postgresql://user:pass@host:5432/dbname?sslmode=require

# === AUTH ===
JWT_SECRET=<chuỗi-bí-mật-dài-tuỳ-ý>     # KHÔNG commit lên git
PORT=3000

# === EMAIL (SMTP) ===
# Nếu để trống, code dùng Ethereal (test inbox ảo, có preview URL trong log).
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=youremail@gmail.com
SMTP_PASS=<app-password>
SMTP_FROM="Smart Hotel <noreply@smarthotel.dev>"

# === AI (tuỳ chọn) ===
# Nếu thiếu, /ai/chat sẽ trả về một câu trả lời rule-based đơn giản.
GEMINI_API_KEY=AIza...
GEMINI_MODEL=gemini-2.5-flash-lite
```

> ⚠️ File `.env` đã được liệt kê trong `.gitignore`. Khi onboard người mới, copy `.env.example` (nếu thiếu thì tạo từ template trên).

---

## 5. Database

DB là **Postgres** với 4 schema chính:

| Schema         | Bảng tiêu biểu |
| -------------- | -------------- |
| `auth`         | `users`        |
| `hotel`        | `cities`, `hotels`, `room_types`, `room_images` |
| `booking`      | `bookings`, `payments` |
| `notification` | `notifications` |

Code KHÔNG có file migration — DB schema được dựng sẵn ngoài (Neon/Supabase). Nếu muốn dựng lại từ đầu:

1. Tạo Postgres DB mới.
2. Mở từng file `*.model.js` trong `src/modules/<module>` → đọc các câu `INSERT/SELECT` để suy ra cột (tên cột bám sát SQL trong code).
3. Tạo schema + bảng tương ứng. (Khoá ngoại: `bookings.user_id → users.id`, `bookings.room_type_id → room_types.id`, …)

> 💡 Cho lớp học thực hành: nên có sẵn 1 file `schema.sql` cho học viên `psql -f schema.sql`. Có thể tạo bằng cách `pg_dump --schema-only` từ DB hiện có.

Khi server start, `src/config/db.js` chạy `SELECT 1` để **fail fast** nếu DB không kết nối được — nếu thấy log:

```
[ERROR] [db] PostgreSQL connection failed
```

→ kiểm tra lại `DATABASE_URL` trước khi xét nguyên nhân khác.

---

## 6. Run app

| Lệnh           | Tác dụng                                          |
| -------------- | ------------------------------------------------- |
| `npm start`    | Chạy với **nodemon** (auto-reload khi sửa code).  |
| `npm run dev`  | Chạy trực tiếp `node src/server.js` (không reload). |

Mặc định server lắng nghe `PORT` trong `.env` (fallback 3000).

---

## 7. Kiến trúc tổng thể

### 7.1. Sơ đồ luồng request

```
HTTP Request
  │
  ▼
┌─────────────────────────────┐
│ app.js                       │  cors → express.json → morgan log
│   middleware chain           │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  /auth, /hotels, /bookings…  │  router gắn URL → controller
│   (route.js)                 │
└──────────────┬──────────────┘
               │  (có middleware: authMiddleware / requireAdmin / validate)
               ▼
┌─────────────────────────────┐
│ controller.js                │  parse req → gọi service → res.json
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ service.js                   │  business logic (rule, transaction…)
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ model.js                     │  SQL query (qua pg.Pool)
└──────────────┬──────────────┘
               │
               ▼
            PostgreSQL
```

### 7.2. Mỗi module có đúng 5 file

```
src/modules/<name>/
  ├── <name>.route.js       # Express router
  ├── <name>.controller.js  # HTTP handler (req/res)
  ├── <name>.service.js     # Business logic
  ├── <name>.model.js       # SQL queries
  └── <name>.validate.js    # Validate body / query (yup / hand-written)
```

Cùng pattern cho 12 module: `auth`, `hotel`, `booking`, `payment`, `room`, `city`, `review`, `notification`, `admin`, `image`, `inventory`, `ai`.

### 7.3. Common helpers

```
src/common/
  ├── helpers/
  │   ├── controller.js   # asyncHandler() → bọc try/catch chung
  │   ├── error.js        # createError(message, statusCode)
  │   └── logger.js       # createLogger(scope) → log.info/warn/error
  └── middleware/
      ├── auth.middleware.js   # verify JWT bắt buộc
      ├── optional-auth.js     # verify JWT nếu có (cho /hotels được nhận diện user)
      ├── require-admin.js     # chặn nếu role !== 'admin'
      └── validate.js          # chạy validate.js của module
```

### 7.4. Thư viện chính & vai trò

| Lib            | Vai trò |
| -------------- | ------- |
| `express`      | HTTP framework: định nghĩa route, middleware. |
| `pg`           | Driver Postgres. Dùng `Pool` (connection pooling) để tái sử dụng connection thay vì connect-disconnect mỗi request → tăng performance & tránh quá tải DB. |
| `cors`         | Bật CORS cho FE gọi từ origin khác. |
| `morgan`       | Log request HTTP ra console (`GET /hotels 200 12ms`). |
| `jsonwebtoken` | Tạo & verify **JWT** cho auth. |
| `bcrypt`       | Hash password (one-way, có salt). Không thể dịch ngược. |
| `nodemailer`   | Gửi email qua SMTP (xác nhận đặt phòng, nhắc check-in, reset password). |
| `dotenv`       | Nạp `.env` vào `process.env`. |
| `nodemon`      | Auto-restart server khi sửa file (chỉ dev). |

---

## 8. Auth flow (rất quan trọng cho học viên hiểu)

```
[Đăng ký]
  POST /auth/register {email, password}
    → bcrypt.hash(password)              # KHÔNG bao giờ lưu plain text
    → INSERT users(email, password, ...)
    → jwt.sign({userId, role}, JWT_SECRET)
    → trả về { token }

[Đăng nhập]
  POST /auth/login {email, password}
    → SELECT user theo email
    → bcrypt.compare(input, user.password)
    → nếu OK: jwt.sign(...) → trả token

[Gọi API có bảo vệ]
  FE đính kèm header: Authorization: Bearer <token>
    → authMiddleware verify token bằng JWT_SECRET
    → gắn req.user = { userId, role }
    → controller dùng req.user.userId

[Chỉ admin]
  Route gắn thêm requireAdmin → kiểm tra req.user.role === 'admin'
```

> Vì JWT là **stateless**, server không lưu session. Logout = FE xoá token khỏi `localStorage`. Để revoke token trước hạn cần thêm bảng blacklist (chưa có trong project này).

---

## 9. Booking flow — concurrency (điểm vàng để giảng)

`src/modules/booking/booking.model.js → createBooking()` minh hoạ pattern **transaction + `FOR UPDATE`** chống race condition:

```
                 [User A]                   [User B]
                    │                          │
    BEGIN ─────────┐│                          │
                   ▼│                          │
   SELECT … FOR UPDATE on room_types(id)       │
                   │ → lấy được lock           │
                   │                           │ BEGIN
                   │                           │ SELECT … FOR UPDATE
                   │                           │ ⏸ BỊ BLOCK ở đây
                   │                           │   (chờ A COMMIT)
   COUNT bookings overlap                      │
   nếu OK → INSERT booking                     │
   COMMIT ────────►│                           │
                   │                           ▼ → tiếp tục
                   │                  COUNT bookings overlap
                   │                  → đã hết phòng → ROLLBACK + 409
```

Đoạn code có **comment chi tiết bằng tiếng Việt** giải thích tại sao dùng `pool.connect()` (không phải `pool.query`), `BEGIN/COMMIT`, công thức overlap `NOT (a2 ≤ b1 OR a1 ≥ b2)` và bắt buộc `client.release()` trong `finally`.

---

## 10. Notification flow

Module `notification` có **2 nhóm hàm**:

1. **Hàm "chuẩn"** (gọi từ HTTP route): list / markRead / delete / createSystem.
2. **Hàm fire-and-forget** (`notifyBookingCreated`, `notifyPaymentSuccess`, …): được module khác (booking, payment, review) gọi sau khi nghiệp vụ chính thành công.

Quy ước **fire-and-forget**: luôn `try/catch` và **KHÔNG throw**. Nếu insert notification lỗi → chỉ log, không làm fail business flow chính (vd: booking đã tạo xong, không nên rollback chỉ vì insert notification fail).

Email gửi qua `nodemailer`. Khi không có SMTP thật, code tạo tài khoản Ethereal và in `previewUrl` ra log để xem nội dung mail.

---

## 11. AI flow

`/ai/chat`:

1. FE gửi `{ message, session_id }`.
2. Service tìm history theo `sessionId` trong **Map in-memory**.
3. Gửi history + message tới Gemini → nhận reply (có thể kèm danh sách phòng).
4. Lưu history mới (giới hạn 40 lượt gần nhất).

⚠️ **Cảnh báo cho lớp học**: dùng Map in-memory chỉ phù hợp demo:

- Restart server → mất sạch history.
- Multi-instance (k8s/load-balancer) → mỗi instance có Map riêng → request kế tiếp routing sang instance khác sẽ "quên" context.
- Không có TTL → memory leak nếu chạy lâu.

Production thực tế nên dùng **Redis** hoặc bảng DB `ai_sessions` + TTL.

`/ai/recommendations`: KHÔNG dùng LLM, dùng thuật toán scoring 5 tiêu chí có trọng số:

| Tiêu chí                  | Trọng số |
| ------------------------- | -------- |
| Phù hợp giá (price fit)   | 30%      |
| Phù hợp số khách          | 20%      |
| Khớp tiện ích yêu cầu     | 20%      |
| Độ phổ biến (số booking)  | 15%      |
| Rating của khách sạn      | 15%      |

Sau khi sort, đa dạng hoá: mỗi khách sạn tối đa 2 phòng trong kết quả top N.

---

## 12. Logging

Logger custom (`src/common/helpers/logger.js`) — wrap quanh `console.*` nhưng:

- Có **timestamp ISO**.
- Có **scope** (`[auth.service]`, `[db]`, `[server]`) để dễ grep log.
- Format chuẩn `[time] [LEVEL] [scope] message | meta`.

Quy ước: **không dùng `console.error/log` trực tiếp** trong service/model. Luôn:

```js
const createLogger = require('../../common/helpers/logger');
const log = createLogger('booking.service');
log.info('createBooking ok', { bookingId });
log.error('createBooking failed', err);
```

---

## 13. Tóm tắt cách tạo project tương tự từ đầu (cho fresher)

> Đây là roadmap rất cô đọng — học viên có thể làm theo trong 1–2 buổi.

```bash
# 1. Init dự án
mkdir my-backend && cd my-backend
npm init -y

# 2. Cài dependency cốt lõi
npm i express pg cors morgan jsonwebtoken bcrypt dotenv nodemailer
npm i -D nodemon

# 3. Cấu trúc thư mục
mkdir -p src/{config,common/{helpers,middleware},modules/auth}
```

**Bước 1 — `src/config/db.js`**: tạo `pg.Pool` từ `DATABASE_URL`, ping `SELECT 1`.

**Bước 2 — `src/app.js`**: tạo `express()`, gắn `cors`, `express.json`, `morgan`, route `/health`. **Export** `app` (chưa listen).

**Bước 3 — `src/server.js`**: nạp `dotenv`, require `./config/db`, require `./app`, gọi `app.listen(PORT)`. Đây là entry point. Tách app/server giúp test bằng supertest mà không phải mở port thật.

**Bước 4 — Module đầu tiên `auth`** (đi đủ 5 file):

- `auth.model.js`: hàm `findUserByEmail`, `createUser` (dùng `pool.query`).
- `auth.service.js`: `register` → `bcrypt.hash` → model, `login` → `bcrypt.compare` → `jwt.sign`.
- `auth.controller.js`: parse `req.body`, gọi service, `res.json(...)`. Bọc bằng `asyncHandler`.
- `auth.validate.js`: kiểm tra email/password format, throw `createError(400)` nếu sai.
- `auth.route.js`: `router.post('/register', validate, controller.register)`.

**Bước 5 — `auth.middleware.js`**: lấy `Authorization: Bearer …`, `jwt.verify`, gắn `req.user`. Áp dụng cho route cần đăng nhập.

**Bước 6 — Mở rộng**: lặp lại pattern 5-file cho từng resource (`hotel`, `booking`, …). Mỗi khi cần feature phức tạp (transaction, gửi email, AI…), tách thành function riêng trong service và **comment rõ tại sao**.

**Bước 7 — Helper chung**: tạo `asyncHandler` (bọc handler async để bắt error vào next), `createError(msg, status)`, `logger`. Dùng nhất quán.

**Bước 8 — Error middleware**: cuối `app.js` thêm `app.use((err, req, res, next) => res.status(err.statusCode || 500).json({ message: err.message }))`. (Project hiện tại đặt trong từng asyncHandler.)

---

## 14. Tham khảo nhanh — endpoint chính

| Method | Path                             | Auth      | Mô tả |
| ------ | -------------------------------- | --------- | ----- |
| GET    | `/health`                        | —         | Health check |
| POST   | `/auth/register`                 | —         | Đăng ký |
| POST   | `/auth/login`                    | —         | Đăng nhập, trả token |
| GET    | `/auth/me`                       | user      | User hiện tại |
| POST   | `/auth/forgot-password`          | —         | Gửi mail reset |
| GET    | `/hotels`                        | optional  | List + filter |
| GET    | `/hotels/:id`                    | —         | Chi tiết |
| GET    | `/cities`                        | —         | Danh sách city |
| GET    | `/rooms/:hotelId`                | —         | Phòng trong khách sạn |
| POST   | `/bookings`                      | user      | Tạo booking (transaction) |
| GET    | `/bookings/me`                   | user      | Booking của tôi |
| POST   | `/payments`                      | user      | Thanh toán booking |
| POST   | `/reviews`                       | user      | Tạo review |
| GET    | `/notifications`                 | user      | Notification của tôi |
| POST   | `/ai/chat`                       | optional  | Chat với Gemini |
| GET    | `/ai/recommendations`            | —         | Gợi ý phòng |
| `*`    | `/admin/*`                       | admin     | CRUD toàn bộ resource |

> Endpoint đầy đủ xem trong `src/modules/<name>/<name>.route.js`.

---

## 15. Troubleshooting nhanh

| Triệu chứng                                          | Cách kiểm tra |
| ---------------------------------------------------- | ------------- |
| `[ERROR] [db] PostgreSQL connection failed`          | Sai `DATABASE_URL` / DB không bật / sai SSL config. |
| `EADDRINUSE :::3000`                                 | Đã có process khác chiếm 3000. Đổi `PORT` hoặc kill process. |
| `JsonWebTokenError: invalid signature`               | `JWT_SECRET` lúc tạo token khác lúc verify (vd đổi `.env` mà không restart). |
| Email không gửi nhưng log có `previewUrl`            | Đang dùng Ethereal (do thiếu SMTP_*). Mở URL để xem mail test. |
| `LLM disabled: GEMINI_API_KEY not set`               | Không sao, AI chat sẽ fallback rule-based. Đặt key nếu muốn full feature. |
| Booking báo 409 dù còn phòng                         | Race condition đã được lock đúng — chạy lại request. Hoặc kiểm tra `bookings.status` đã filter đúng chưa. |

---

## 16. Cấu trúc thư mục đầy đủ

```
smart-hotel-booking/
├── .env                       # secrets (không commit)
├── .gitignore
├── package.json
├── README.md                  # ← file này
└── src/
    ├── app.js                 # build & export Express app
    ├── server.js              # entry: load env + DB + listen
    ├── config/
    │   └── db.js              # pg.Pool + SSL + fail-fast ping
    ├── common/
    │   ├── helpers/
    │   │   ├── controller.js  # asyncHandler
    │   │   ├── error.js       # createError
    │   │   └── logger.js      # createLogger(scope)
    │   └── middleware/
    │       ├── auth.middleware.js
    │       ├── optional-auth.js
    │       ├── require-admin.js
    │       └── validate.js
    └── modules/
        ├── auth/         (route + controller + service + model + validate)
        ├── hotel/
        ├── room/
        ├── city/
        ├── booking/
        ├── payment/
        ├── review/
        ├── notification/  (+ email.service.js)
        ├── inventory/
        ├── image/
        ├── admin/
        └── ai/            (+ llm.service.js)
```

---

**Chúc giảng dạy vui vẻ!** Mọi file đã có doc block tiếng Việt ở đầu — học viên có thể mở từng file đọc tuần tự là hiểu.
