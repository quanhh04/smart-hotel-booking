const { isRequired, isString, isNumber, isPositiveInt, minLength, maxLength, minValue, maxValue } = require('../../common/helpers/validators');

const createReview = {
  body: {
    booking_id: [isRequired('Mã booking'), isPositiveInt('Mã booking')],
    rating: [isRequired('Điểm đánh giá'), isNumber('Điểm đánh giá'), minValue('Điểm đánh giá', 1), maxValue('Điểm đánh giá', 5)],
    comment: [isRequired('Nội dung đánh giá'), isString('Nội dung đánh giá'), minLength('Nội dung đánh giá', 10), maxLength('Nội dung đánh giá', 1000)],
  },
};

const updateReview = {
  params: {
    id: [isRequired('ID đánh giá'), isPositiveInt('ID đánh giá')],
  },
  body: {
    rating: [isRequired('Điểm đánh giá'), isNumber('Điểm đánh giá'), minValue('Điểm đánh giá', 1), maxValue('Điểm đánh giá', 5)],
    comment: [isRequired('Nội dung đánh giá'), isString('Nội dung đánh giá'), minLength('Nội dung đánh giá', 10), maxLength('Nội dung đánh giá', 1000)],
  },
};

const getHotelReviews = {
  params: {
    hotelId: [isRequired('ID khách sạn'), isPositiveInt('ID khách sạn')],
  },
  query: {
    page: [isPositiveInt('Trang')],
    limit: [isPositiveInt('Số lượng'), maxValue('Số lượng', 50)],
  },
};

const deleteReview = {
  params: {
    id: [isRequired('ID đánh giá'), isPositiveInt('ID đánh giá')],
  },
};

module.exports = { createReview, updateReview, getHotelReviews, deleteReview };
