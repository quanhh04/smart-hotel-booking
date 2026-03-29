const { isRequired, isString, isPositiveInt, isNumber, isUUID, isISODate, minLength, maxLength, minValue, maxValue } = require('../../common/helpers/validators');

const chat = {
  body: {
    message: [isRequired('Tin nhắn'), isString('Tin nhắn'), minLength('Tin nhắn', 1), maxLength('Tin nhắn', 1000)],
    session_id: [isString('Session ID'), isUUID('Session ID')],
  },
};

const recommendations = {
  query: {
    guests: [isPositiveInt('Số khách')],
    max_price: [isNumber('Giá tối đa'), minValue('Giá tối đa', 0)],
    amenities: [isString('Tiện ích')],
    limit: [isPositiveInt('Giới hạn'), minValue('Giới hạn', 1), maxValue('Giới hạn', 20)],
  },
};

const trending = {
  query: {
    days: [isNumber('Số ngày'), minValue('Số ngày', 7), maxValue('Số ngày', 30)],
  },
};

const historyBased = {};

const trackClick = {
  body: {
    room_type_id: [isRequired('Room type ID'), isPositiveInt('Room type ID')],
  },
};

const stats = {
  query: {
    from: [isISODate('Ngày bắt đầu')],
    to: [isISODate('Ngày kết thúc')],
  },
};

module.exports = {
  chat,
  recommendations,
  trending,
  historyBased,
  trackClick,
  stats,
};
