const roomService = require('./room.service');

const getRooms = async (req, res) => {
  try {
    const { minPrice, maxPrice, guests, amenities, check_in, check_out } = req.query;

    if (check_in || check_out) {
      if (check_in && isNaN(Date.parse(check_in))) {
        return res.status(400).json({ message: 'Định dạng ngày không hợp lệ' });
      }
      if (check_out && isNaN(Date.parse(check_out))) {
        return res.status(400).json({ message: 'Định dạng ngày không hợp lệ' });
      }
      if (check_in && check_out && new Date(check_in) >= new Date(check_out)) {
        return res.status(400).json({ message: 'check_out phải sau check_in' });
      }
    }

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

    if (
      !hotel_id ||
      !name ||
      price_per_night === undefined ||
      max_guests === undefined ||
      !description ||
      !Array.isArray(amenities)
    ) {
      return res.status(400).json({
        message:
          'hotel_id, name, price_per_night, max_guests, description, and amenities are required',
      });
    }

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
    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: 'Room id is invalid' });
    }

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
