const imageModel = require('./image.model');
const { asyncHandler } = require('../../common/helpers/controller');
const { createError } = require('../../common/helpers/error');

// Upload image (save URL to DB)
const createImage = asyncHandler(async (req, res) => {
  const { url, alt, type } = req.body;
  if (!url) throw createError('URL ảnh là bắt buộc', 400);
  const image = await imageModel.createImage({ url, alt, type });
  return res.status(201).json(image);
});

// List images
const getImages = asyncHandler(async (req, res) => {
  const { type, limit } = req.query;
  const images = await imageModel.getImages({ type, limit: Number(limit) || 50 });
  return res.status(200).json({ images });
});

// Delete image
const deleteImage = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  await imageModel.deleteImage(id);
  return res.status(204).send();
});

// Add image to hotel
const addHotelImage = asyncHandler(async (req, res) => {
  const hotelId = Number(req.params.hotelId);
  const { image_id, sort_order } = req.body;
  if (!image_id) throw createError('image_id là bắt buộc', 400);
  await imageModel.addHotelImage(hotelId, image_id, sort_order || 0);
  const images = await imageModel.getHotelImages(hotelId);
  return res.status(200).json({ images });
});

// Remove image from hotel
const removeHotelImage = asyncHandler(async (req, res) => {
  const hotelId = Number(req.params.hotelId);
  const imageId = Number(req.params.imageId);
  await imageModel.removeHotelImage(hotelId, imageId);
  return res.status(204).send();
});

// Get hotel images
const getHotelImages = asyncHandler(async (req, res) => {
  const hotelId = Number(req.params.hotelId);
  const images = await imageModel.getHotelImages(hotelId);
  return res.status(200).json({ images });
});

module.exports = { createImage, getImages, deleteImage, addHotelImage, removeHotelImage, getHotelImages };
