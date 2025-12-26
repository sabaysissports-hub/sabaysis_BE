const express = require('express');
const router = express.Router();
const os = require('os');
const multer = require('multer');
const {
	getServices,
	getServiceBySlug,
	getServiceDetailBySlug,
	createOrUpdateService,
	deleteService,
	createOrUpdateServiceDetail,
	deleteServiceDetail,
} = require('../controllers/serviceController');

const upload = multer({ dest: os.tmpdir() });

router.get('/', getServices);
router.get('/:slug', getServiceBySlug);
router.get('/:slug/detail', getServiceDetailBySlug);

// Admin management routes
router.post('/', createOrUpdateService);
router.put('/:slug', createOrUpdateService);
router.delete('/:slug', deleteService);

router.post('/:slug/detail', upload.single('bannerImage'), createOrUpdateServiceDetail);
router.put('/:slug/detail', upload.single('bannerImage'), createOrUpdateServiceDetail);
router.delete('/:slug/detail', deleteServiceDetail);

module.exports = router;
