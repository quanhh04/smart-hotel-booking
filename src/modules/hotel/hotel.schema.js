const Joi = require("joi");

const createHotel = {
  body: Joi.object({
    name: Joi.string().trim().min(1).required().messages({
      "string.base": "Tên khách sạn phải là chuỗi ký tự",
      "string.empty": "Tên khách sạn không được để trống",
      "string.min": "Tên khách sạn không được để trống",
      "any.required": "Tên khách sạn là bắt buộc",
    }),
    address: Joi.string().trim().min(1).required().messages({
      "string.base": "Địa chỉ phải là chuỗi ký tự",
      "string.empty": "Địa chỉ không được để trống",
      "string.min": "Địa chỉ không được để trống",
      "any.required": "Địa chỉ là bắt buộc",
    }),
    description: Joi.string().trim().min(1).required().messages({
      "string.base": "Mô tả phải là chuỗi ký tự",
      "string.empty": "Mô tả không được để trống",
      "string.min": "Mô tả không được để trống",
      "any.required": "Mô tả là bắt buộc",
    }),
  }),
};

const getHotelDetail = {
  params: Joi.object({
    id: Joi.number().integer().positive().required().messages({
      "number.base": "ID khách sạn phải là số",
      "number.integer": "ID khách sạn phải là số nguyên",
      "number.positive": "ID khách sạn phải là số dương",
      "any.required": "ID khách sạn là bắt buộc",
    }),
  }),
};

const updateHotel = {
  params: Joi.object({
    id: Joi.number().integer().positive().required().messages({
      "number.base": "ID khách sạn phải là số",
      "number.integer": "ID khách sạn phải là số nguyên",
      "number.positive": "ID khách sạn phải là số dương",
      "any.required": "ID khách sạn là bắt buộc",
    }),
  }),
  body: Joi.object({
    name: Joi.string().trim().min(1).messages({
      "string.base": "Tên khách sạn phải là chuỗi ký tự",
      "string.empty": "Tên khách sạn không được để trống",
      "string.min": "Tên khách sạn không được để trống",
    }),
    address: Joi.string().trim().min(1).messages({
      "string.base": "Địa chỉ phải là chuỗi ký tự",
      "string.empty": "Địa chỉ không được để trống",
      "string.min": "Địa chỉ không được để trống",
    }),
    description: Joi.string().trim().min(1).messages({
      "string.base": "Mô tả phải là chuỗi ký tự",
      "string.empty": "Mô tả không được để trống",
      "string.min": "Mô tả không được để trống",
    }),
  }),
};

const deleteHotel = {
  params: Joi.object({
    id: Joi.number().integer().positive().required().messages({
      "number.base": "ID khách sạn phải là số",
      "number.integer": "ID khách sạn phải là số nguyên",
      "number.positive": "ID khách sạn phải là số dương",
      "any.required": "ID khách sạn là bắt buộc",
    }),
  }),
};

const getHotels = {
  query: Joi.object({
    keyword: Joi.string().trim().allow("").messages({
      "string.base": "Từ khóa tìm kiếm phải là chuỗi ký tự",
    }),
    min_price: Joi.number().min(0).messages({
      "number.base": "Giá tối thiểu phải là số",
      "number.min": "Giá tối thiểu không được âm",
    }),
    max_price: Joi.number().min(0).messages({
      "number.base": "Giá tối đa phải là số",
      "number.min": "Giá tối đa không được âm",
    }),
    stars: Joi.number().integer().min(1).max(5).messages({
      "number.base": "Số sao phải là số",
      "number.integer": "Số sao phải là số nguyên",
      "number.min": "Số sao phải từ 1 đến 5",
      "number.max": "Số sao phải từ 1 đến 5",
    }),
    sort_by: Joi.string()
      .valid("rating", "price_from", "created_at")
      .messages({
        "string.base": "Tiêu chí sắp xếp phải là chuỗi ký tự",
        "any.only":
          "Tiêu chí sắp xếp phải là một trong: rating, price_from, created_at",
      }),
    sort_order: Joi.string().uppercase().valid("ASC", "DESC").messages({
      "string.base": "Thứ tự sắp xếp phải là chuỗi ký tự",
      "any.only": "Thứ tự sắp xếp phải là ASC hoặc DESC",
    }),
    page: Joi.number().integer().min(1).default(1).messages({
      "number.base": "Số trang phải là số",
      "number.integer": "Số trang phải là số nguyên",
      "number.min": "Số trang phải lớn hơn hoặc bằng 1",
    }),
    limit: Joi.number().integer().min(1).max(100).default(10).messages({
      "number.base": "Số lượng mỗi trang phải là số",
      "number.integer": "Số lượng mỗi trang phải là số nguyên",
      "number.min": "Số lượng mỗi trang phải lớn hơn hoặc bằng 1",
      "number.max": "Số lượng mỗi trang không được vượt quá 100",
    }),
  }),
};

const addImage = {
  params: Joi.object({
    id: Joi.number().integer().positive().required().messages({
      "number.base": "ID khách sạn phải là số",
      "number.integer": "ID khách sạn phải là số nguyên",
      "number.positive": "ID khách sạn phải là số dương",
      "any.required": "ID khách sạn là bắt buộc",
    }),
  }),
  body: Joi.object({
    url: Joi.string().trim().uri().required().messages({
      "string.base": "URL hình ảnh phải là chuỗi ký tự",
      "string.empty": "URL hình ảnh không được để trống",
      "string.uri": "URL hình ảnh không hợp lệ",
      "any.required": "URL hình ảnh là bắt buộc",
    }),
  }),
};

const deleteImage = {
  params: Joi.object({
    id: Joi.number().integer().positive().required().messages({
      "number.base": "ID khách sạn phải là số",
      "number.integer": "ID khách sạn phải là số nguyên",
      "number.positive": "ID khách sạn phải là số dương",
      "any.required": "ID khách sạn là bắt buộc",
    }),
    imageId: Joi.number().integer().min(0).required().messages({
      "number.base": "ID hình ảnh phải là số",
      "number.integer": "ID hình ảnh phải là số nguyên",
      "number.min": "ID hình ảnh không hợp lệ",
      "any.required": "ID hình ảnh là bắt buộc",
    }),
  }),
};

const getHotelRooms = {
  params: Joi.object({
    id: Joi.number().integer().positive().required().messages({
      "number.base": "ID khách sạn phải là số",
      "number.integer": "ID khách sạn phải là số nguyên",
      "number.positive": "ID khách sạn phải là số dương",
      "any.required": "ID khách sạn là bắt buộc",
    }),
  }),
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1).messages({
      "number.base": "Số trang phải là số",
      "number.integer": "Số trang phải là số nguyên",
      "number.min": "Số trang phải lớn hơn hoặc bằng 1",
    }),
    limit: Joi.number().integer().min(1).max(100).default(10).messages({
      "number.base": "Số lượng mỗi trang phải là số",
      "number.integer": "Số lượng mỗi trang phải là số nguyên",
      "number.min": "Số lượng mỗi trang phải lớn hơn hoặc bằng 1",
      "number.max": "Số lượng mỗi trang không được vượt quá 100",
    }),
  }),
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
