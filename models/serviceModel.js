const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
