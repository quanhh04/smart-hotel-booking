const { Router } = require('express');
const reviewController = require('./review.controller');
const authMiddleware = require('../../common/middleware/auth.middleware');
const validate = require('../../common/middleware/validate');
const requireAdmin = require('../../common/middleware/require-admin');
const reviewSchemas = require('./review.schema');

const router = Router();

router.post('/', authMiddleware, validate(reviewSchemas.createReview), reviewController.createReview);
router.get('/hotel/:hotelId', validate(reviewSchemas.getHotelReviews), reviewController.getHotelReviews);
router.get('/me', authMiddleware, reviewController.getMyReviews);
router.put('/:id', authMiddleware, validate(reviewSchemas.updateReview), reviewController.updateReview);
router.delete('/:id', authMiddleware, validate(reviewSchemas.deleteReview), reviewController.deleteReview);
router.delete('/admin/:id', authMiddleware, requireAdmin, validate(reviewSchemas.deleteReview), reviewController.adminDeleteReview);

module.exports = router;
