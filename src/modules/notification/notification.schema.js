const { isRequired, isString, isPositiveInt, maxLength, minValue, maxValue } = require('../../common/helpers/validators');

const getNotifications = {
  query: {
    page: [isPositiveInt('Trang'), minValue('Trang', 1)],
    limit: [isPositiveInt('Số lượng'), minValue('Số lượng', 1), maxValue('Số lượng', 50)],
  },
};

const markAsRead = {
  params: {
    id: [isRequired('ID thông báo'), isPositiveInt('ID thông báo')],
  },
};

const deleteNotification = {
  params: {
    id: [isRequired('ID thông báo'), isPositiveInt('ID thông báo')],
  },
};

const createSystemNotification = {
  body: {
    title: [isRequired('Tiêu đề'), isString('Tiêu đề'), maxLength('Tiêu đề', 200)],
    message: [isRequired('Nội dung'), isString('Nội dung'), maxLength('Nội dung', 2000)],
  },
};

module.exports = { getNotifications, markAsRead, deleteNotification, createSystemNotification };
