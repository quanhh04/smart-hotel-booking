const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { loadEnvironment } = require('./config');
const requestId = require('./common/middleware/request-id');

const authRoutes = require('./modules/auth/auth.route');
const hotelRoutes = require('./modules/hotel/hotel.route');
const bookingRoutes = require('./modules/booking/booking.route');
const paymentRoutes = require('./modules/payment/payment.route');
const aiRoutes = require('./modules/ai/ai.route');
const roomRoutes = require('./modules/room/room.route');
const inventoryRoutes = require('./modules/inventory/inventory.route');

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestId);
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

module.exports = app;
