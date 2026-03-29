const { isRequired, isString, isPositiveInt, isNumber, isIn, isURL, minLength, minValue, maxValue } = require('../../common/helpers/validators');

const createHotel = {
  body: {
    name: [isRequired('Tên khách sạn'), isString('Tên khách sạn'), minLength('Tên khách sạn', 1)],
    address: [isRequired('Địa chỉ'), isString('Địa chỉ'), minLength('Địa chỉ', 1)],
    description: [isRequired('Mô tả'), isString('Mô tả'), minLength('Mô tả', 1)],
  },
};

const getHotelDetail = {
  params: {
    id: [isRequired('ID khách sạn'), isPositiveInt('ID khách sạn')],
  },
};

const updateHotel = {
  params: {
    id: [isRequired('ID khách sạn'), isPositiveInt('ID khách sạn')],
  },
  body: {
    name: [isString('Tên khách sạn'), minLength('Tên khách sạn', 1)],
    address: [isString('Địa chỉ'), minLength('Địa chỉ', 1)],
    description: [isString('Mô tả'), minLength('Mô tả', 1)],
  },
};

const deleteHotel = {
  params: {
    id: [isRequired('ID khách sạn'), isPositiveInt('ID khách sạn')],
  },
};

const getHotels = {
  query: {
    keyword: [isString('Từ khóa tìm kiếm')],
    min_price: [isNumber('Giá tối thiểu'), minValue('Giá tối thiểu', 0)],
    max_price: [isNumber('Giá tối đa'), minValue('Giá tối đa', 0)],
    stars: [isPositiveInt('Số sao'), minValue('Số sao', 1), maxValue('Số sao', 5)],
    sort_by: [isString('Tiêu chí sắp xếp'), isIn('Tiêu chí sắp xếp', ['rating', 'price_from', 'created_at'])],
    sort_order: [isString('Thứ tự sắp xếp'), isIn('Thứ tự sắp xếp', ['ASC', 'DESC'])],
    page: [isPositiveInt('Số trang')],
    limit: [isPositiveInt('Số lượng mỗi trang'), maxValue('Số lượng mỗi trang', 100)],
  },
};

const addImage = {
  params: {
    id: [isRequired('ID khách sạn'), isPositiveInt('ID khách sạn')],
  },
  body: {
    url: [isRequired('URL hình ảnh'), isString('URL hình ảnh'), isURL('URL hình ảnh')],
  },
};

const deleteImage = {
  params: {
    id: [isRequired('ID khách sạn'), isPositiveInt('ID khách sạn')],
    imageId: [isRequired('ID hình ảnh'), isNumber('ID hình ảnh'), minValue('ID hình ảnh', 0)],
  },
};

const getHotelRooms = {
  params: {
    id: [isRequired('ID khách sạn'), isPositiveInt('ID khách sạn')],
  },
  query: {
    page: [isPositiveInt('Số trang')],
    limit: [isPositiveInt('Số lượng mỗi trang'), maxValue('Số lượng mỗi trang', 100)],
  },
};

module.exports = {
  createHotel,
  getHotelDetail,
  updateHotel,
  deleteHotel,
  getHotels,
  addImage,
  deleteImage,
  getHotelRooms,
};
