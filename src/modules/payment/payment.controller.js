const paymentService = require('./payment.service');

const payBooking = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Bạn chưa đăng nhập' });
    }

    const { booking_id: bookingId, amount } = req.body;

    const result = await paymentService.createPayment({
      bookingId,
      amount,
    });

    return res.status(201).json(result);
  } catch (error) {
    const status = error.status || 500;
    const message = status === 500 ? 'Lỗi hệ thống, vui lòng thử lại sau' : error.message;
    return res.status(status).json({ message });
  }
};

const getPayments = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Bạn chưa đăng nhập' });
    }

    const payments = await paymentService.getUserPayments(req.user.userId);
    return res.status(200).json(payments);
  } catch (error) {
    const status = error.status || 500;
    const message = status === 500 ? 'Lỗi hệ thống, vui lòng thử lại sau' : error.message;
    return res.status(status).json({ message });
  }
};

module.exports = {
  payBooking,
  getPayments,
};
