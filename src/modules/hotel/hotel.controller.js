const hotelService = require('./hotel.service');
const { asyncHandler } = require('../../common/helpers/controller');

const getHotels = asyncHandler(async (req, res) => {
  const {
    keyword,
    min_price: minPrice,
    max_price: maxPrice,
    stars,
    sort_by: sortBy,
    sort_order: sortOrder,
    page,
    limit,
  } = req.query;

  const result = await hotelService.listHotels({ keyword, minPrice, maxPrice, stars, sortBy, sortOrder, page, limit });
  return res.status(200).json({
    hotels: result.hotels,
    total: result.total,
    page: Number(page) || 1,
    limit: Number(limit) || 10,
  });
});

const createHotel = asyncHandler(async (req, res) => {
  const { name, address, description } = req.body;
  const hotel = await hotelService.addHotel({ name, address, description });
  return res.status(201).json(hotel);
});

const getHotelDetail = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const data = await hotelService.getHotelDetail(id);

  if (!data) {
    return res.status(404).json({ message: 'Không tìm thấy khách sạn' });
  }

  return res.status(200).json(data);
});

const updateHotel = asyncHandler(async (req, res) => {
  const hotelId = Number(req.params.id);
  const { name, address, description } = req.body;
  const hotel = await hotelService.updateHotel(hotelId, { name, address, description });
  return res.status(200).json(hotel);
});

const deleteHotel = asyncHandler(async (req, res) => {
  const hotelId = Number(req.params.id);
  await hotelService.removeHotel(hotelId);
  return res.status(204).send();
});

const addImage = asyncHandler(async (req, res) => {
  const hotelId = Number(req.params.id);
  const { url } = req.body;
  const images = await hotelService.addImage(hotelId, url);
  return res.status(201).json({ images });
});

const deleteImage = asyncHandler(async (req, res) => {
  const hotelId = Number(req.params.id);
  const imageId = Number(req.params.imageId);
  await hotelService.removeImage(hotelId, imageId);
  return res.status(204).send();
});

const getHotelRooms = asyncHandler(async (req, res) => {
  const hotelId = Number(req.params.id);
  const { page = 1, limit = 10 } = req.query;
  const result = await hotelService.getHotelRooms(hotelId, Number(page), Number(limit));
  return res.status(200).json({ ...result, page: Number(page), limit: Number(limit) });
});

module.exports = { getHotels, createHotel, getHotelDetail, updateHotel, deleteHotel, addImage, deleteImage, getHotelRooms };
