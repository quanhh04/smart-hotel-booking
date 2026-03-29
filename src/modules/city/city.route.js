const { Router } = require('express');
const cityController = require('./city.controller');
const authMiddleware = require('../../common/middleware/auth.middleware');
const requireAdmin = require('../../common/middleware/require-admin');
const validate = require('../../common/middleware/validate');
const citySchemas = require('./city.schema');

const router = Router();

router.get('/', validate(citySchemas.getCities), cityController.getCities);
router.get('/:id', validate(citySchemas.getCityDetail), cityController.getCityDetail);
router.post('/', authMiddleware, requireAdmin, validate(citySchemas.createCity), cityController.createCity);
router.put('/:id', authMiddleware, requireAdmin, validate(citySchemas.updateCity), cityController.updateCity);
router.delete('/:id', authMiddleware, requireAdmin, validate(citySchemas.deleteCity), cityController.deleteCity);

module.exports = router;
