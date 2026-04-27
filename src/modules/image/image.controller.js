/**
 * image.controller — Lưu URL ảnh + gắn ảnh vào khách sạn.
 *
 * Endpoints (mount tại /images):
 *   POST   /images                          → createImage      — Thêm record ảnh (URL)
 *   GET    /images                          → getImages        — List ảnh, filter theo type
 *   DELETE /images/:id                      → deleteImage      — Xoá ảnh khỏi DB
 *   GET    /images/hotels/:hotelId          → getHotelImages   — Ảnh của 1 khách sạn (đã sắp xếp)
 *   POST   /images/hotels/:hotelId          → addHotelImage    — Gắn ảnh vào khách sạn
 *   DELETE /images/hotels/:hotelId/:imageId → removeHotelImage — Bỏ ảnh khỏi khách sạn
 *
 * Lưu ý: project chỉ lưu URL — file thật được host ở chỗ khác (Cloudinary, S3...).
 *
 * Đặc thù: controller này gọi thẳng model (không qua service) vì logic quá đơn
 * giản. Trong dự án thật, nên thêm 1 lớp service để chuẩn pattern.
 */
const imageModel = require('./image.model');
const { asyncHandler } = require('../../common/helpers/controller');
const { createError } = require('../../common/helpers/error');

const createImage = asyncHandler(async (req, res) => {
  const { url, alt, type } = req.body;
  if (!url) throw createError('URL ảnh là bắt buộc', 400);
  const image = await imageModel.createImage({ url, alt, type });
  return res.status(201).json(image);
});

const getImages = asyncHandler(async (req, res) => {
  const { type, limit } = req.query;
  const images = await imageModel.getImages({ type, limit: Number(limit) || 50 });
  return res.status(200).json({ images });
});

const deleteImage = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  await imageModel.deleteImage(id);
  return res.status(204).send();
});

const addHotelImage = asyncHandler(async (req, res) => {
  const hotelId = Number(req.params.hotelId);
  const { image_id, sort_order } = req.body;
  if (!image_id) throw createError('image_id là bắt buộc', 400);
  await imageModel.addHotelImage(hotelId, image_id, sort_order || 0);
  const images = await imageModel.getHotelImages(hotelId);
  return res.status(200).json({ images });
});

const removeHotelImage = asyncHandler(async (req, res) => {
  const hotelId = Number(req.params.hotelId);
  const imageId = Number(req.params.imageId);
  await imageModel.removeHotelImage(hotelId, imageId);
  return res.status(204).send();
});

const getHotelImages = asyncHandler(async (req, res) => {
  const hotelId = Number(req.params.hotelId);
  const images = await imageModel.getHotelImages(hotelId);
  return res.status(200).json({ images });
});

module.exports = { createImage, getImages, deleteImage, addHotelImage, removeHotelImage, getHotelImages };
