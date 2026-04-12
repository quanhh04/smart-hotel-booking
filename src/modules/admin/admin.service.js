const adminModel = require('./admin.model');

const getStats = async () => adminModel.getStats();
const getRevenue = async (startDate, endDate) => adminModel.getRevenue(startDate, endDate);
const getUsers = async (page, limit) => adminModel.getUsers(page, limit);
const getTopHotels = async (sortBy, limit) => adminModel.getTopHotels(sortBy, limit);

module.exports = { getStats, getRevenue, getUsers, getTopHotels };
