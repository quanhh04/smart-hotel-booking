const pool = require('../../config/db');
const notificationModel = require('./notification.model');
const emailService = require('./email.service');
const { createError } = require('../../common/helpers/error');

const getUserNotifications = async (userId, page, limit) => {
  const { notifications, total } = await notificationModel.getByUserId(userId, page, limit);
  const unreadCount = await notificationModel.getUnreadCount(userId);
  return { notifications, total, unread_count: unreadCount };
};

const markAsRead = async (notificationId, userId) => {
  const notification = await notificationModel.getById(notificationId);
  if (!notification) throw createError('Không tìm thấy thông báo', 404);
  if (notification.user_id !== userId) throw createError('Bạn không có quyền thực hiện thao tác này', 403);
  return notificationModel.markAsRead(notificationId);
};

const markAllAsRead = async (userId) => {
  return notificationModel.markAllAsRead(userId);
};

const deleteNotification = async (notificationId, userId) => {
  const notification = await notificationModel.getById(notificationId);
  if (!notification) throw createError('Không tìm thấy thông báo', 404);
  if (notification.user_id !== userId) throw createError('Bạn không có quyền thực hiện thao tác này', 403);
  await notificationModel.deleteById(notificationId);
};

const createSystemNotification = async (title, message) => {
  const result = await pool.query('SELECT id FROM auth.users');
  const userIds = result.rows.map((row) => row.id);
  if (!userIds.length) return 0;

  const notifications = userIds.map((userId) => ({
    userId, type: 'SYSTEM', title, message, metadata: {},
  }));
  const created = await notificationModel.createBulkNotifications(notifications);
  return created.length;
};

// Fire-and-forget notification helpers (không throw error nếu thất bại)

const notifyBookingCreated = async (booking) => {
  try {
    const hotelName = booking.room_type?.hotel_name || booking.hotel_name;
    const roomName = booking.room_type?.name || booking.room_name;

    await notificationModel.createNotification({
      userId: booking.user_id,
      type: 'BOOKING_CREATED',
      title: 'Đặt phòng thành công',
      message: `Bạn đã đặt phòng ${roomName} tại ${hotelName} thành công.`,
      metadata: { booking_id: booking.id, hotel_name: hotelName, room_name: roomName, check_in: booking.check_in, check_out: booking.check_out },
    });

    const userResult = await pool.query('SELECT email FROM auth.users WHERE id = $1', [booking.user_id]);
    const userEmail = userResult.rows[0]?.email;
    if (userEmail) {
      emailService.sendBookingConfirmation({ to: userEmail, bookingId: booking.id, hotelName, roomName, checkIn: booking.check_in, checkOut: booking.check_out });
    }
  } catch (error) {
    console.error('notifyBookingCreated failed', error.message);
  }
};

const notifyBookingCancelled = async (booking) => {
  try {
    await notificationModel.createNotification({
      userId: booking.user_id,
      type: 'BOOKING_CANCELLED',
      title: 'Hủy đặt phòng thành công',
      message: `Đặt phòng #${booking.id} đã được hủy.`,
      metadata: { booking_id: booking.id, status: 'CANCELLED' },
    });
  } catch (error) {
    console.error('notifyBookingCancelled failed', error.message);
  }
};

const notifyPaymentSuccess = async (payment) => {
  try {
    await notificationModel.createNotification({
      userId: payment.booking.user_id,
      type: 'PAYMENT_SUCCESS',
      title: 'Thanh toán thành công',
      message: `Thanh toán #${payment.payment.id} cho đặt phòng #${payment.payment.booking_id} thành công.`,
      metadata: { payment_id: payment.payment.id, booking_id: payment.payment.booking_id, amount: payment.payment.amount },
    });
  } catch (error) {
    console.error('notifyPaymentSuccess failed', error.message);
  }
};

const notifyReviewPosted = async (review) => {
  try {
    const adminResult = await pool.query("SELECT id FROM auth.users WHERE role = 'admin'");
    for (const { id: adminId } of adminResult.rows) {
      await notificationModel.createNotification({
        userId: adminId,
        type: 'REVIEW_POSTED',
        title: 'Đánh giá mới',
        message: `Có đánh giá mới ${review.rating} sao cho khách sạn.`,
        metadata: { review_id: review.id, rating: review.rating, comment: review.comment },
      });
    }
  } catch (error) {
    console.error('notifyReviewPosted failed', error.message);
  }
};

module.exports = {
  getUserNotifications, markAsRead, markAllAsRead, deleteNotification, createSystemNotification,
  notifyBookingCreated, notifyBookingCancelled, notifyPaymentSuccess, notifyReviewPosted,
};
