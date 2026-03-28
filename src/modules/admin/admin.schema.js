const Joi = require('joi');

const getStats = {};

const getRevenue = {
  query: Joi.object({
    start_date: Joi.string().isoDate().required().messages({
      'string.base': 'Ngày bắt đầu phải là chuỗi ký tự',
      'string.isoDate': 'Ngày bắt đầu phải đúng định dạng ISO (YYYY-MM-DD)',
      'any.required': 'Ngày bắt đầu là bắt buộc',
    }),
    end_date: Joi.string().isoDate().required().messages({
      'string.base': 'Ngày kết thúc phải là chuỗi ký tự',
      'string.isoDate': 'Ngày kết thúc phải đúng định dạng ISO (YYYY-MM-DD)',
      'any.required': 'Ngày kết thúc là bắt buộc',
    }),
  }),
};

const getUsers = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1).messages({
      'number.base': 'Số trang phải là số',
      'number.integer': 'Số trang phải là số nguyên',
      'number.min': 'Số trang phải lớn hơn hoặc bằng 1',
    }),
    limit: Joi.number().integer().min(1).max(100).default(10).messages({
      'number.base': 'Số lượng mỗi trang phải là số',
      'number.integer': 'Số lượng mỗi trang phải là số nguyên',
      'number.min': 'Số lượng mỗi trang phải lớn hơn hoặc bằng 1',
      'number.max': 'Số lượng mỗi trang không được vượt quá 100',
    }),
  }),
};

const getTopHotels = {
  query: Joi.object({
    sort_by: Joi.string().valid('revenue', 'booking_count').default('revenue').messages({
      'string.base': 'Tiêu chí sắp xếp phải là chuỗi ký tự',
      'any.only': 'Tiêu chí sắp xếp phải là revenue hoặc booking_count',
    }),
    limit: Joi.number().integer().min(1).max(50).default(10).messages({
      'number.base': 'Số lượng phải là số',
      'number.integer': 'Số lượng phải là số nguyên',
      'number.min': 'Số lượng phải lớn hơn hoặc bằng 1',
      'number.max': 'Số lượng không được vượt quá 50',
    }),
  }),
};

module.exports = { getStats, getRevenue, getUsers, getTopHotels };
