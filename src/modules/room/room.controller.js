const roomService = require('./room.service');
const { asyncHandler } = require('../../common/helpers/controller');

const getRooms = asyncHandler(async (req, res) => {
  const { minPrice, maxPrice, guests, amenities, check_in, check_out } = req.query;

  const rooms = await roomService.listRooms({
    minPrice,
    maxPrice,
    guests,
    amenities,
    checkIn: check_in,
    checkOut: check_out,
  });

  return res.status(200).json(rooms);
});

const createRoom = asyncHandler(async (req, res) => {
  const room = await roomService.addRoom(req.body);
  return res.status(201).json(room);
});

const getRoomDetail = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const room = await roomService.getRoomDetail(id);

  if (!room) {
    return res.status(404).json({ message: 'Không tìm thấy phòng' });
  }

  return res.status(200).json(room);
});

module.exports = { getRooms, createRoom, getRoomDetail };
