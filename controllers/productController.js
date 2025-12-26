const Product = require('../models/productModel');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createOrUpdateProduct = async (req, res) => {
  const { slug, title, body, category } = req.body;
  let imageUrl = null;

  try {
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'sabaysis/products',
        resource_type: 'auto',
      });
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const productFields = {
      slug,
      title,
      body,
      category: category || 'Sports', 
    };
    if (imageUrl) productFields.image = imageUrl;

    let product = await Product.findOne({ slug });

    if (product) {
      product = await Product.findOneAndUpdate(
        { slug },
        { $set: productFields },
        { new: true }
      );
      return res.json({ message: 'Product updated', product });
    } else {
      product = new Product(productFields);
      await product.save();
      return res.status(201).json({ message: 'Product created', product });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
        const productById = await Product.findById(req.params.slug);
        if(productById) {
             await productById.deleteOne();
             res.json({ message: 'Product removed' });
        } else {
             res.status(404).json({ message: 'Product not found' });
        }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductBySlug,
  createOrUpdateProduct,
  deleteProduct,
};
