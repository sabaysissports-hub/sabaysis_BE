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
router.post('/', upload.single('image'), createOrUpdateProduct);
router.delete('/:slug', deleteProduct);

module.exports = router;
