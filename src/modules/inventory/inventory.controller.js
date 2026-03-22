const inventoryService = require('./inventory.service');

const updateInventory = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Bạn chưa đăng nhập' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền thực hiện thao tác này' });
    }

    const roomTypeId = Number(req.params.id);

    const { total_quantity } = req.body;

    const result = await inventoryService.updateRoomTypeQuantity({
      roomTypeId,
      totalQuantity: total_quantity,
    });

    return res.status(200).json(result);
  } catch (error) {
    const status = error.status || 500;
    const message = status === 500 ? 'Lỗi hệ thống, vui lòng thử lại sau' : error.message;
    return res.status(status).json({ message });
  }
};

const getHotelInventory = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Bạn chưa đăng nhập' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền thực hiện thao tác này' });
    }

    const hotelId = Number(req.params.id);

    const { check_in, check_out } = req.query;

    const inventory = await inventoryService.getHotelInventory({
      hotelId,
      checkIn: check_in,
      checkOut: check_out,
    });

    return res.status(200).json(inventory);
  } catch (error) {
    const status = error.status || 500;
    const message = status === 500 ? 'Lỗi hệ thống, vui lòng thử lại sau' : error.message;
    return res.status(status).json({ message });
  }
};

module.exports = {
  updateInventory,
  getHotelInventory,
};
