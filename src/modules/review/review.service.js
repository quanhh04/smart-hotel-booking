const reviewModel = require('./review.model');
const { createError } = require('../../common/helpers/error');
const notificationService = require('../notification/notification.service');
const createLogger = require('../../common/helpers/logger');
const log = createLogger('review.service');

const createReview = async ({ userId, bookingId, rating, comment }) => {
  log.info('createReview: checking booking', { userId, bookingId });
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

  log.info('createReview: checking existing review', { bookingId });
  const existingReview = await reviewModel.getExistingReview(bookingId);

  if (existingReview) {
    throw createError('Booking này đã được đánh giá', 409);
  }

  log.info('createReview: creating review', { bookingId, hotelId: booking.hotel_id, rating });
  const review = await reviewModel.createReview({
    bookingId,
    userId,
    hotelId: booking.hotel_id,
    rating,
    comment,
  });

  log.info('createReview: notifying', { reviewId: review.id });
  notificationService.notifyReviewPosted(review);
  log.info('createReview: done', { reviewId: review.id });
  return review;
};

const getHotelReviews = async (hotelId, page, limit) => {
  log.info('getHotelReviews: fetching', { hotelId, page, limit });
  const result = await reviewModel.getReviewsByHotelId({ hotelId, page, limit });
  log.info('getHotelReviews: done', { hotelId, total: result.total });
  return result;
};

const getMyReviews = async (userId) => {
  log.info('getMyReviews: fetching', { userId });
  const reviews = await reviewModel.getReviewsByUserId(userId);
  log.info('getMyReviews: done', { userId, count: reviews.length });
  return reviews;
};

const updateReview = async ({ reviewId, userId, rating, comment }) => {
  log.info('updateReview: checking review', { reviewId, userId });
  const review = await reviewModel.getReviewById(reviewId);

  if (!review) {
    throw createError('Không tìm thấy đánh giá', 404);
  }

  if (Number(review.user_id) !== Number(userId)) {
    throw createError('Bạn không có quyền thực hiện thao tác này', 403);
  }

  log.info('updateReview: updating', { reviewId, rating });
  const updated = await reviewModel.updateReview({
    reviewId,
    rating,
    comment,
    hotelId: review.hotel_id,
  });
  log.info('updateReview: done', { reviewId });
  return updated;
};

const deleteReview = async ({ reviewId, userId }) => {
  log.info('deleteReview: checking review', { reviewId, userId });
  const review = await reviewModel.getReviewById(reviewId);

  if (!review) {
    throw createError('Không tìm thấy đánh giá', 404);
  }

  if (Number(review.user_id) !== Number(userId)) {
    throw createError('Bạn không có quyền thực hiện thao tác này', 403);
  }

  log.info('deleteReview: deleting', { reviewId, hotelId: review.hotel_id });
  const result = await reviewModel.deleteReview({
    reviewId,
    hotelId: review.hotel_id,
  });
  log.info('deleteReview: done', { reviewId });
  return result;
};

const adminDeleteReview = async (reviewId) => {
  log.info('adminDeleteReview: checking review', { reviewId });
  const review = await reviewModel.getReviewById(reviewId);

  if (!review) {
    throw createError('Không tìm thấy đánh giá', 404);
  }

  log.info('adminDeleteReview: deleting', { reviewId, hotelId: review.hotel_id });
  const result = await reviewModel.deleteReview({
    reviewId,
    hotelId: review.hotel_id,
  });
  log.info('adminDeleteReview: done', { reviewId });
  return result;
};

module.exports = { createReview, getHotelReviews, getMyReviews, updateReview, deleteReview, adminDeleteReview };