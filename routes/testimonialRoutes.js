const express = require('express');
const router = express.Router();
const {
  getAllTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require('../controllers/testimonialController');

// Public routes
router.get('/', getAllTestimonials);
router.get('/:id', getTestimonialById);

// Admin routes (add authentication middleware later)
router.post('/', createTestimonial);
router.put('/:id', updateTestimonial);
router.delete('/:id', deleteTestimonial);

module.exports = router;
