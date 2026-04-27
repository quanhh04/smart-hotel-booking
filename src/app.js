/**
 * app.js — Khởi tạo Express app và "lắp ráp" toàn bộ middleware + route.
 *
 * Tách app.js và server.js để:
 *   - app.js: chỉ build và export `app` → dễ import vào test (supertest).
 *   - server.js: gọi app.listen() + nạp env + kết nối DB → là entry point thực sự.
 *
 * Kiến trúc tổng thể:
 *   Request
 *     → cors (cho phép FE gọi cross-origin)
 *     → express.json() (parse body JSON)
 *     → morgan (log request ra console)
 *     → /<module> route → controller → service → model → DB
 *     → response JSON
 *
 * Mỗi module (auth, hotel, booking, ...) đều có 5 file đặt cùng folder:
 *   route.js → controller.js → service.js → model.js, kèm validate.js.
 */
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./modules/auth/auth.route');
const hotelRoutes = require('./modules/hotel/hotel.route');
const bookingRoutes = require('./modules/booking/booking.route');
const paymentRoutes = require('./modules/payment/payment.route');
const aiRoutes = require('./modules/ai/ai.route');
const roomRoutes = require('./modules/room/room.route');
const inventoryRoutes = require('./modules/inventory/inventory.route');
const reviewRoutes = require('./modules/review/review.route');
const notificationRoutes = require('./modules/notification/notification.route');
const adminRoutes = require('./modules/admin/admin.route');
const cityRoutes = require('./modules/city/city.route');
const imageRoutes = require('./modules/image/image.route');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/hotels', hotelRoutes);
app.use('/bookings', bookingRoutes);
app.use('/payments', paymentRoutes);
app.use('/ai', aiRoutes);
app.use('/rooms', roomRoutes);
app.use('/', inventoryRoutes);
app.use('/reviews', reviewRoutes);
app.use('/notifications', notificationRoutes);
app.use('/admin', adminRoutes);
app.use('/cities', cityRoutes);
app.use('/images', imageRoutes);

module.exports = app;
