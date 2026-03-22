const reviewService = require('./review.service');
const { asyncHandler } = require('../../common/helpers/controller');

const createReview = asyncHandler(async (req, res) => {
  const { booking_id: bookingId, rating, comment } = req.body;
  const { userId } = req.user;

  const review = await reviewService.createReview({ userId, bookingId, rating, comment });

  return res.status(201).json(review);
});

const getHotelReviews = asyncHandler(async (req, res) => {
  const { hotelId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  console.log("1");

  const { reviews, total } = await reviewService.getHotelReviews(hotelId, page, limit);

  return res.status(200).json({ reviews, total, page: Number(page), limit: Number(limit) });
});

const getMyReviews = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  const reviews = await reviewService.getMyReviews(userId);

  return res.status(200).json(reviews);
});

const updateReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const { userId } = req.user;

  const review = await reviewService.updateReview({ reviewId: id, userId, rating, comment });

  return res.status(200).json(review);
});

const deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  await reviewService.deleteReview({ reviewId: id, userId });

  return res.status(200).json({ message: 'Xóa đánh giá thành công' });
});

const adminDeleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await reviewService.adminDeleteReview(id);

  return res.status(200).json({ message: 'Xóa đánh giá thành công' });
});

module.exports = { createReview, getHotelReviews, getMyReviews, updateReview, deleteReview, adminDeleteReview };
