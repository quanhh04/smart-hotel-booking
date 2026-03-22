const hotelService = require('./hotel.service');
const { asyncHandler } = require('../../common/helpers/controller');

const getHotels = asyncHandler(async (req, res) => {
  const hotels = await hotelService.listHotels();
  return res.status(200).json(hotels);
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

module.exports = { getHotels, createHotel, getHotelDetail };
