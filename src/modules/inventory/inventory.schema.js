const { isRequired, isPositiveInt, isNumber, isISODate, minValue } = require('../../common/helpers/validators');

const updateInventory = {
  params: {
    id: [isRequired('ID loại phòng'), isPositiveInt('ID loại phòng')],
  },
  body: {
    total_quantity: [isRequired('Tổng số lượng'), isNumber('Tổng số lượng'), minValue('Tổng số lượng', 0)],
  },
};

const getHotelInventory = {
  params: {
    id: [isRequired('ID khách sạn'), isPositiveInt('ID khách sạn')],
  },
  query: {
    check_in: [isISODate('Ngày nhận phòng')],
    check_out: [isISODate('Ngày trả phòng')],
  },
};

module.exports = { updateInventory, getHotelInventory };
