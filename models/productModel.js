const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      default: 'Sports',
    },
    images: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
