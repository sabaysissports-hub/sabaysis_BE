const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getProducts,
  getProductBySlug,
  createOrUpdateProduct,
  deleteProduct,
} = require('../controllers/productController');

const os = require('os');

const upload = multer({ dest: os.tmpdir() });

router.get('/', getProducts);
router.get('/:slug', getProductBySlug);
router.post('/', upload.array('images', 10), createOrUpdateProduct); // Support up to 10 images
router.delete('/:slug', deleteProduct);

module.exports = router;
