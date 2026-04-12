const { Router } = require('express');
const reviewController = require('./review.controller');
const authMiddleware = require('../../common/middleware/auth.middleware');
const requireAdmin = require('../../common/middleware/require-admin');
const { validateCreateReview, validateGetHotelReviews, validateUpdateReview, validateDeleteReview } = require('./review.validate');

const router = Router();

router.post('/', authMiddleware, validateCreateReview, reviewController.createReview);
router.get('/hotel/:hotelId', validateGetHotelReviews, reviewController.getHotelReviews);
router.get('/me', authMiddleware, reviewController.getMyReviews);
router.put('/:id', authMiddleware, validateUpdateReview, reviewController.updateReview);
router.delete('/:id', authMiddleware, validateDeleteReview, reviewController.deleteReview);
router.delete('/admin/:id', authMiddleware, requireAdmin, validateDeleteReview, reviewController.adminDeleteReview);

module.exports = router;
