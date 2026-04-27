/**
 * hotel.controller — Tìm kiếm và quản lý khách sạn.
 *
 * Endpoints (mount tại /hotels):
 *   GET    /hotels             → getHotels       — Search có filter + sort + paging
 *   GET    /hotels/:id         → getHotelDetail  — Chi tiết khách sạn
 *   GET    /hotels/:id/rooms   → getHotelRooms   — Danh sách phòng của 1 khách sạn
 *   POST   /hotels             → createHotel     — Admin: tạo khách sạn mới
 *   PUT    /hotels/:id         → updateHotel     — Admin: cập nhật
 *   DELETE /hotels/:id         → deleteHotel     — Admin: xoá (chỉ khi không có booking active)
 */
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

const getHotelRooms = asyncHandler(async (req, res) => {
  const hotelId = Number(req.params.id);
  const { page = 1, limit = 10 } = req.query;
  const result = await hotelService.getHotelRooms(hotelId, Number(page), Number(limit));
  return res.status(200).json({ ...result, page: Number(page), limit: Number(limit) });
});

module.exports = { getHotels, createHotel, getHotelDetail, updateHotel, deleteHotel, getHotelRooms };
