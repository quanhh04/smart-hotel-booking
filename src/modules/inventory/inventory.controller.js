const inventoryService = require('./inventory.service');

const updateInventory = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const roomTypeId = Number(req.params.id);
    if (!Number.isFinite(roomTypeId)) {
      return res.status(400).json({ message: 'Room type id is invalid' });
    }

    const { total_quantity } = req.body;

    if (total_quantity === undefined || total_quantity === null) {
      return res.status(400).json({ message: 'total_quantity là bắt buộc' });
    }

    const result = await inventoryService.updateRoomTypeQuantity({
      roomTypeId,
      totalQuantity: total_quantity,
    });

    return res.status(200).json(result);
  } catch (error) {
    const status = error.status || 500;
    const message = status === 500 ? 'Internal server error' : error.message;
    return res.status(status).json({ message });
  }
};

const getHotelInventory = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const hotelId = Number(req.params.id);
    if (!Number.isFinite(hotelId)) {
      return res.status(400).json({ message: 'Hotel id is invalid' });
    }

    const { check_in, check_out } = req.query;

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

    const inventory = await inventoryService.getHotelInventory({
      hotelId,
      checkIn: check_in,
      checkOut: check_out,
    });

    return res.status(200).json(inventory);
  } catch (error) {
    const status = error.status || 500;
    const message = status === 500 ? 'Internal server error' : error.message;
    return res.status(status).json({ message });
  }
};

module.exports = {
  updateInventory,
  getHotelInventory,
};
