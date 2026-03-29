const { isRequired, isString, isPositiveInt, isIn, isISODate, maxValue } = require('../../common/helpers/validators');

const getStats = {};

const getRevenue = {
  query: {
    start_date: [isRequired('Ngày bắt đầu'), isString('Ngày bắt đầu'), isISODate('Ngày bắt đầu')],
    end_date: [isRequired('Ngày kết thúc'), isString('Ngày kết thúc'), isISODate('Ngày kết thúc')],
  },
};

const getUsers = {
  query: {
    page: [isPositiveInt('Số trang')],
    limit: [isPositiveInt('Số lượng mỗi trang'), maxValue('Số lượng mỗi trang', 100)],
  },
};

const getTopHotels = {
  query: {
    sort_by: [isString('Tiêu chí sắp xếp'), isIn('Tiêu chí sắp xếp', ['revenue', 'booking_count'])],
    limit: [isPositiveInt('Số lượng'), maxValue('Số lượng', 50)],
  },
};

module.exports = { getStats, getRevenue, getUsers, getTopHotels };
