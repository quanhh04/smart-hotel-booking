const hotelService = require('./hotel.service');

const listHotels = async (req, res) => {
  try {
    const hotels = await hotelService.listHotels();
    return res.status(200).json(hotels);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const createHotel = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { name, address, description } = req.body || {};

    if (!name || !address || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const hotel = await hotelService.createHotel({
      name,
      address,
      description,
    });

    return res.status(201).json(hotel);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  listHotels,
  createHotel,
};
