const reviewModel = require('./review.model');
const { createError } = require('../../common/helpers/error');
const notificationService = require('../notification/notification.service');

const createReview = async ({ userId, bookingId, rating, comment }) => {
  const booking = await reviewModel.getBookingForReview(bookingId);

  if (!booking) {
    throw createError('Không tìm thấy booking', 404);
  }

  if (Number(booking.user_id) !== Number(userId)) {
    throw createError('Bạn không có quyền đánh giá booking này', 403);
  }

  if (booking.status !== 'PAID' || new Date(booking.check_out) >= new Date()) {
    throw createError('Booking chưa đủ điều kiện để đánh giá', 400);
  }

  const existingReview = await reviewModel.getExistingReview(bookingId);

  if (existingReview) {
    throw createError('Booking này đã được đánh giá', 409);
  }

  const review = await reviewModel.createReview({
    bookingId,
    userId,
    hotelId: booking.hotel_id,
    rating,
    comment,
  });

  notificationService.notifyReviewPosted(review);

  return review;
};

const getHotelReviews = async (hotelId, page, limit) => {
  console.log("2");
  return reviewModel.getReviewsByHotelId({ hotelId, page, limit });
};

const getMyReviews = async (userId) => {
  return reviewModel.getReviewsByUserId(userId);
};

const updateReview = async ({ reviewId, userId, rating, comment }) => {
  const review = await reviewModel.getReviewById(reviewId);

  if (!review) {
    throw createError('Không tìm thấy đánh giá', 404);
  }

  if (Number(review.user_id) !== Number(userId)) {
    throw createError('Bạn không có quyền thực hiện thao tác này', 403);
  }

  return reviewModel.updateReview({
    reviewId,
    rating,
    comment,
    hotelId: review.hotel_id,
  });
};

const deleteReview = async ({ reviewId, userId }) => {
  const review = await reviewModel.getReviewById(reviewId);

  if (!review) {
    throw createError('Không tìm thấy đánh giá', 404);
  }

  if (Number(review.user_id) !== Number(userId)) {
    throw createError('Bạn không có quyền thực hiện thao tác này', 403);
  }

  return reviewModel.deleteReview({
    reviewId,
    hotelId: review.hotel_id,
  });
};

const adminDeleteReview = async (reviewId) => {
  const review = await reviewModel.getReviewById(reviewId);

  if (!review) {
    throw createError('Không tìm thấy đánh giá', 404);
  }

  return reviewModel.deleteReview({
    reviewId,
    hotelId: review.hotel_id,
  });
};

module.exports = { createReview, getHotelReviews, getMyReviews, updateReview, deleteReview, adminDeleteReview };
