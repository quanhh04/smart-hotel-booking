/**
 * inventory.controller — Tồn kho phòng theo ngày.
 *
 * Endpoints (mount tại '/'  — đường dẫn dạng /room-types/... và /hotels/.../inventory):
 *   PATCH  /room-types/:id/inventory      → updateInventory     — Admin: chỉnh total_quantity
 *   GET    /hotels/:id/inventory          → getHotelInventory   — Đếm phòng còn trống theo khoảng ngày
 *
 * Phục vụ trang admin "tồn kho" + frontend kiểm tra availability trước khi đặt.
 */
const inventoryService = require('./inventory.service');
const { asyncHandler } = require('../../common/helpers/controller');

const updateInventory = asyncHandler(async (req, res) => {
  const roomTypeId = Number(req.params.id);
  const { total_quantity } = req.body;

  const result = await inventoryService.updateRoomTypeQuantity({
    roomTypeId,
    totalQuantity: total_quantity,
  });

  return res.status(200).json(result);
});

const getHotelInventory = asyncHandler(async (req, res) => {
  const hotelId = Number(req.params.id);
  const { check_in, check_out } = req.query;

  const inventory = await inventoryService.getHotelInventory({
    hotelId,
    checkIn: check_in,
    checkOut: check_out,
  });

  return res.status(200).json(inventory);
});

module.exports = { updateInventory, getHotelInventory };
