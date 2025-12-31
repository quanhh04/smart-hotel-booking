const hotelService = require('./hotel.service');

const getHotels = async (req, res) => {
  try {
    const hotels = await hotelService.listHotels();
    return res.status(200).json(hotels);
  } catch (error) {
    const status = error.status || 500;
    const message = status === 500 ? 'Internal server error' : error.message;
    return res.status(status).json({ message });
  }
};

const createHotel = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { name, address, description } = req.body;

    if (!name || !address || !description) {
      return res
        .status(400)
        .json({ message: 'Name, address, and description are required' });
    }

    const hotel = await hotelService.addHotel({ name, address, description });
    return res.status(201).json(hotel);
  } catch (error) {
    const status = error.status || 500;
    const message = status === 500 ? 'Internal server error' : error.message;
    return res.status(status).json({ message });
  }
};

module.exports = {
  getHotels,
  createHotel,
};
