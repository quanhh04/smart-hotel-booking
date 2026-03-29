const adminModel = require('./admin.model');
const createLogger = require('../../common/helpers/logger');
const log = createLogger('admin.service');

const getStats = async () => {
  log.info('getStats: fetching dashboard stats');
  const stats = await adminModel.getStats();
  log.info('getStats: done');
  return stats;
};

const getRevenue = async (startDate, endDate) => {
  log.info('getRevenue: fetching', { startDate, endDate });
  const revenue = await adminModel.getRevenue(startDate, endDate);
  log.info('getRevenue: done', { dataPoints: revenue.length });
  return revenue;
};

const getUsers = async (page, limit) => {
  log.info('getUsers: fetching', { page, limit });
  const result = await adminModel.getUsers(page, limit);
  log.info('getUsers: done', { total: result.total });
  return result;
};

const getTopHotels = async (sortBy, limit) => {
  log.info('getTopHotels: fetching', { sortBy, limit });
  const hotels = await adminModel.getTopHotels(sortBy, limit);
  log.info('getTopHotels: done', { count: hotels.length });
  return hotels;
};

module.exports = { getStats, getRevenue, getUsers, getTopHotels };
