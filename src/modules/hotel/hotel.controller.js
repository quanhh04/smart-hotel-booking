const hotelService = require('./hotel.service');

const getHotels = async (req, res) => {
  try {
    const hotels = await hotelService.listHotels();
    return res.status(200).json(hotels);
  } catch (error) {
    const status = error.status || 500;
    const message = status === 500 ? 'Lỗi hệ thống, vui lòng thử lại sau' : error.message;
    return res.status(status).json({ message });
  }
};

const createHotel = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Bạn chưa đăng nhập' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền thực hiện thao tác này' });
    }

    const { name, address, description } = req.body;

    const hotel = await hotelService.addHotel({ name, address, description });
    return res.status(201).json(hotel);
  } catch (error) {
    const status = error.status || 500;
    const message = status === 500 ? 'Lỗi hệ thống, vui lòng thử lại sau' : error.message;
    return res.status(status).json({ message });
  }
};
const getHotelDetail = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const data = await hotelService.getHotelDetail(id);
    if (!data) {
      return res.status(404).json({ message: 'Không tìm thấy khách sạn' });
    }

    return res.status(200).json(data);
  } catch (error) {
    const status = error.status || 500;
    const message = status === 500 ? 'Lỗi hệ thống, vui lòng thử lại sau' : error.message;
    return res.status(status).json({ message });
  }
};

module.exports = {
  getHotels,
  createHotel,
  getHotelDetail,
};
