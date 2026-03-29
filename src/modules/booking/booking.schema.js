const { isRequired, isString, isPositiveInt, isISODate, isIn, maxValue } = require('../../common/helpers/validators');

const createBooking = {
  body: {
    room_type_id: [isRequired('Mã loại phòng'), isPositiveInt('Mã loại phòng')],
    check_in: [isRequired('Ngày nhận phòng'), isString('Ngày nhận phòng'), isISODate('Ngày nhận phòng')],
    check_out: [isRequired('Ngày trả phòng'), isString('Ngày trả phòng'), isISODate('Ngày trả phòng')],
    payment_method: [isString('Hình thức thanh toán'), isIn('Hình thức thanh toán', ['online', 'pay_at_hotel'])],
  },
};

const cancelBooking = {
  params: {
    id: [isRequired('ID đặt phòng'), isPositiveInt('ID đặt phòng')],
  },
};

const getBookingDetail = {
  params: {
    id: [isRequired('ID đặt phòng'), isPositiveInt('ID đặt phòng')],
  },
};

const getAllBookings = {
  query: {
    status: [isString('Trạng thái'), isIn('Trạng thái', ['PENDING', 'CONFIRMED', 'PAID', 'CANCELLED', 'REFUNDED'])],
    page: [isPositiveInt('Trang')],
    limit: [isPositiveInt('Giới hạn'), maxValue('Giới hạn', 100)],
  },
};

module.exports = { createBooking, cancelBooking, getBookingDetail, getAllBookings };
