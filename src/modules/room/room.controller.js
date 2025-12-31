const roomService = require('./room.service');

const getRooms = async (req, res) => {
  try {
    const { minPrice, maxPrice, guests, amenities } = req.query;
    const rooms = await roomService.listRooms({
      minPrice,
      maxPrice,
      guests,
      amenities,
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

    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const {
      hotel_id,
      name,
      price_per_night,
      max_guests,
      description,
      amenities,
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
    });

    return res.status(201).json(room);
  } catch (error) {
    const status = error.status || 500;
    const message = status === 500 ? 'Internal server error' : error.message;
    return res.status(status).json({ message });
  }
};

module.exports = {
  getRooms,
  createRoom,
};
