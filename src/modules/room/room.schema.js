const { isRequired, isString, isPositiveInt, isNumber, isArray, isISODate, minLength, minValue } = require('../../common/helpers/validators');

const createRoom = {
  body: {
    hotel_id: [isRequired('ID khách sạn'), isPositiveInt('ID khách sạn')],
    name: [isRequired('Tên phòng'), isString('Tên phòng'), minLength('Tên phòng', 1)],
    price_per_night: [isRequired('Giá mỗi đêm'), isNumber('Giá mỗi đêm'), minValue('Giá mỗi đêm', 1)],
    max_guests: [isRequired('Số khách tối đa'), isPositiveInt('Số khách tối đa')],
    description: [isRequired('Mô tả'), isString('Mô tả'), minLength('Mô tả', 1)],
    amenities: [isRequired('Tiện nghi'), isArray('Tiện nghi')],
    total_quantity: [isRequired('Tổng số lượng'), isPositiveInt('Tổng số lượng')],
    bed: [isString('Loại giường')],
    size: [isString('Diện tích')],
  },
};

const getRooms = {
  query: {
    minPrice: [isNumber('Giá tối thiểu'), minValue('Giá tối thiểu', 1)],
    maxPrice: [isNumber('Giá tối đa'), minValue('Giá tối đa', 1)],
    guests: [isPositiveInt('Số khách')],
    amenities: [isString('Tiện nghi')],
    check_in: [isISODate('Ngày nhận phòng')],
    check_out: [isISODate('Ngày trả phòng')],
    page: [isPositiveInt('Trang')],
    limit: [isPositiveInt('Giới hạn')],
  },
};

const updateRoom = {
  params: {
    id: [isRequired('ID phòng'), isPositiveInt('ID phòng')],
  },
  body: {
    name: [isString('Tên phòng'), minLength('Tên phòng', 1)],
    price_per_night: [isNumber('Giá mỗi đêm'), minValue('Giá mỗi đêm', 1)],
    max_guests: [isPositiveInt('Số khách tối đa')],
    description: [isString('Mô tả'), minLength('Mô tả', 1)],
    amenities: [isArray('Tiện nghi')],
    bed: [isString('Loại giường')],
    size: [isString('Diện tích')],
  },
};

const deleteRoom = {
  params: {
    id: [isRequired('ID phòng'), isPositiveInt('ID phòng')],
  },
};

module.exports = { createRoom, getRooms, updateRoom, deleteRoom };
