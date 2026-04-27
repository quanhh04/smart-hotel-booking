/**
 * admin.controller — Dashboard và báo cáo cho admin.
 *
 * Endpoints (mount tại /admin, đều cần requireAdmin):
 *   GET   /admin/stats          → getStats      — Tổng số user/hotel/booking/revenue
 *   GET   /admin/revenue        → getRevenue    — Doanh thu trong khoảng [start_date, end_date]
 *   GET   /admin/users          → getUsers      — List users có paging
 *   GET   /admin/top-hotels     → getTopHotels  — Top khách sạn theo rating/booking
 */
const adminService = require('./admin.service');
const { asyncHandler } = require('../../common/helpers/controller');

const getStats = asyncHandler(async (req, res) => {
  const stats = await adminService.getStats();
  return res.status(200).json(stats);
});

const getRevenue = asyncHandler(async (req, res) => {
  const { start_date: startDate, end_date: endDate } = req.query;
  const revenue = await adminService.getRevenue(startDate, endDate);
  return res.status(200).json(revenue);
});

const getUsers = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await adminService.getUsers(page, limit);
  return res.status(200).json({
    users: result.users,
    total: result.total,
    page: Number(page) || 1,
    limit: Number(limit) || 10,
  });
});

const getTopHotels = asyncHandler(async (req, res) => {
  const { sort_by: sortBy, limit } = req.query;
  const hotels = await adminService.getTopHotels(sortBy, limit);
  return res.status(200).json(hotels);
});

module.exports = { getStats, getRevenue, getUsers, getTopHotels };
