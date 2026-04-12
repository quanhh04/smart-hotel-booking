const { Router } = require('express');
const cityController = require('./city.controller');
const authMiddleware = require('../../common/middleware/auth.middleware');
const requireAdmin = require('../../common/middleware/require-admin');
const { validateGetCityDetail, validateCreateCity, validateUpdateCity, validateDeleteCity } = require('./city.validate');

const router = Router();

router.get('/', cityController.getCities);
router.get('/:id', validateGetCityDetail, cityController.getCityDetail);
router.post('/', authMiddleware, requireAdmin, validateCreateCity, cityController.createCity);
router.put('/:id', authMiddleware, requireAdmin, validateUpdateCity, cityController.updateCity);
router.delete('/:id', authMiddleware, requireAdmin, validateDeleteCity, cityController.deleteCity);

module.exports = router;
