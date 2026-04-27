/**
 * room.controller — Quản lý "loại phòng" (room types).
 *
 * Endpoints (mount tại /rooms):
 *   GET    /rooms        → getRooms     — Tìm phòng (filter theo giá/khách/tiện ích/ngày)
 *   POST   /rooms        → createRoom   — Admin: tạo loại phòng mới cho 1 khách sạn
 *   PUT    /rooms/:id    → updateRoom   — Admin: cập nhật
 *   DELETE /rooms/:id    → deleteRoom   — Admin: xoá
 *
 * Lưu ý: 1 "room" trong DB là 1 LOẠI phòng có total_quantity, không phải 1 phòng vật lý.
 */
const roomService = require('./room.service');
const { asyncHandler } = require('../../common/helpers/controller');

const getRooms = asyncHandler(async (req, res) => {
  const { minPrice, maxPrice, guests, amenities, check_in, check_out, page, limit } = req.query;

  const { rooms, total } = await roomService.listRooms({
    minPrice,
    maxPrice,
    guests,
    amenities,
    checkIn: check_in,
    checkOut: check_out,
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10,
  });

  return res.status(200).json({ rooms, total, page: page ? Number(page) : 1, limit: limit ? Number(limit) : 10 });
});

const createRoom = asyncHandler(async (req, res) => {
  const room = await roomService.addRoom(req.body);
  return res.status(201).json(room);
});

const updateRoom = asyncHandler(async (req, res) => {
  const roomId = Number(req.params.id);
  const { name, price_per_night, max_guests, description, amenities, bed, size } = req.body;
  const room = await roomService.updateRoom(roomId, { name, price_per_night, max_guests, description, amenities, bed, size });
  return res.status(200).json(room);
});

const deleteRoom = asyncHandler(async (req, res) => {
  const roomId = Number(req.params.id);
  await roomService.removeRoom(roomId);
  return res.status(204).send();
});

module.exports = { getRooms, createRoom, updateRoom, deleteRoom };
