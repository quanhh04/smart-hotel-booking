const { isRequired, isString, isPositiveInt, isIn, maxValue } = require('../../common/helpers/validators');

const payBooking = {
  body: {
    booking_id: [isRequired('ID đặt phòng'), isPositiveInt('ID đặt phòng')],
  },
};

const refund = {
  body: {
    booking_id: [isRequired('ID đặt phòng'), isPositiveInt('ID đặt phòng')],
  },
};

const getAllPayments = {
  query: {
    status: [isString('Trạng thái'), isIn('Trạng thái', ['SUCCESS', 'REFUNDED'])],
    page: [isPositiveInt('Trang')],
    limit: [isPositiveInt('Giới hạn'), maxValue('Giới hạn', 100)],
  },
};

const getPaymentDetail = {
  params: {
    id: [isRequired('ID giao dịch'), isPositiveInt('ID giao dịch')],
  },
};

module.exports = { payBooking, refund, getAllPayments, getPaymentDetail };
