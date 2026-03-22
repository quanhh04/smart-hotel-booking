const roomService = require('./room.service');

const getRooms = async (req, res) => {
  try {
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
  } catch (error) {
    const status = error.status || 500;
    const message = status === 500 ? 'Internal server error' : error.message;
    return res.status(status).json({ message });
  }
};

const createRoom = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const {
      hotel_id,
      name,
      price_per_night,
      max_guests,
      description,
      amenities,
      total_quantity,
    } = req.body;

    const room = await roomService.addRoom({
      hotel_id,
      name,
      price_per_night,
      max_guests,
      description,
      amenities,
      total_quantity,
    });

    return res.status(201).json(room);
  } catch (error) {
    const status = error.status || 500;
    const message = status === 500 ? 'Internal server error' : error.message;
    return res.status(status).json({ message });
  }
};

const getRoomDetail = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const room = await roomService.getRoomDetail(id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    return res.status(200).json(room);
  } catch (error) {
    const status = error.status || 500;
    const message = status === 500 ? 'Internal server error' : error.message;
    return res.status(status).json({ message });
  }
};

module.exports = {
  getRooms,
  createRoom,
  getRoomDetail,
};
