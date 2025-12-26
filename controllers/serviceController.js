const Service = require('../models/serviceModel');
const ServiceDetail = require('../models/serviceDetailModel');
const cloudinary = require('../config/cloudinary');

const getServices = async (req, res) => {
  try {
    const services = await Service.find({}).sort({ title: 1 });
    res.json(services);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const getServiceBySlug = async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const getServiceDetailBySlug = async (req, res) => {
  try {
    const detail = await ServiceDetail.findOne({ slug: req.params.slug });
    if (!detail) return res.status(404).json({ message: 'Service detail not found' });
    res.json(detail);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = {
  getServices,
  getServiceBySlug,
  getServiceDetailBySlug,
};

// Create or update a service by slug
const createOrUpdateService = async (req, res) => {
  try {
    const { slug, title, body } = req.body;
    const paramSlug = req.params.slug; // optional
    const findSlug = paramSlug || slug;
    if (!findSlug || !title) {
      return res.status(400).json({ message: 'slug (or param) and title are required' });
    }
    const setData = { title, body };
    if (slug) setData.slug = slug; // allow renaming when slug provided in body
    const updated = await Service.findOneAndUpdate(
      { slug: findSlug },
      { $set: setData },
      { upsert: !paramSlug, new: true, setDefaultsOnInsert: true }
    );
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Delete a service and its detail
const deleteService = async (req, res) => {
  try {
    const { slug } = req.params;
    await Service.deleteOne({ slug });
    await ServiceDetail.deleteOne({ slug });
    res.json({ message: 'Service and detail deleted' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Create or update a service detail by slug, handling optional bannerImage upload
const createOrUpdateServiceDetail = async (req, res) => {
  try {
    const { slug } = req.params;
    if (!slug) return res.status(400).json({ message: 'slug param required' });

    // Accept either individual fields or a JSON payload under `detail`
    let payload = {};
    if (req.body.detail) {
      try {
        payload = JSON.parse(req.body.detail);
      } catch (err) {
        return res.status(400).json({ message: 'Invalid detail JSON' });
      }
    } else {
      payload = { ...req.body };
    }

    // Ensure slug consistency
    payload.slug = slug;

    // Handle banner image upload if provided
    if (req.file && req.file.path) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'sabaysis/services/banners',
          resource_type: 'image',
          public_id: `${slug}_banner`,
        });
        payload.bannerImage = result.secure_url;
      } catch (err) {
        // If upload fails, continue with existing bannerImage value if any
      }
    }

    const updated = await ServiceDetail.findOneAndUpdate(
      { slug },
      { $set: payload },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const deleteServiceDetail = async (req, res) => {
  try {
    const { slug } = req.params;
    await ServiceDetail.deleteOne({ slug });
    res.json({ message: 'Service detail deleted' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports.createOrUpdateService = createOrUpdateService;
module.exports.deleteService = deleteService;
module.exports.createOrUpdateServiceDetail = createOrUpdateServiceDetail;
module.exports.deleteServiceDetail = deleteServiceDetail;
