const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/productModel');

dotenv.config();

const productsToSeed = [
  { 
      slug: 'sports-net', 
      title: 'Sports Net', 
      body: 'High-quality safety and practice nets for various sports.',
      category: 'Equipment'
  },
  { 
      slug: 'football-turf', 
      title: 'Football Turf', 
      body: 'Professional-grade football surfaces meeting FIFA standards.', 
      category: 'Turf'
  },
  { 
      slug: 'cricket-turf', 
      title: 'Cricket Turf', 
      body: 'Durable and consistent turf specially designed for cricket pitches.', 
      category: 'Turf'
  },
  { 
      slug: 'artificial-grass', 
      title: 'Artificial Grass', 
      body: 'Lush, natural-looking, and low-maintenance synthetic grass for multiple uses.', 
      category: 'Turf'
  },
  { 
      slug: 'landscape-turf', 
      title: 'Landscape Turf', 
      body: 'Aesthetic and durable landscaping solutions for outdoor spaces and gardens.', 
      category: 'Turf'
  },
  { 
      slug: 'outdoor-gym', 
      title: 'Outdoor Gym', 
      body: 'Robust, weather-resistant fitness equipment for parks and public spaces.', 
      category: 'Infrastructure'
  },
  { 
      slug: 'pitch-equipment', 
      title: 'Pitch Equipment', 
      body: 'Essential gear and maintenance tools for keeping pitches in top condition.', 
      category: 'Equipment'
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI , {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');

    for (const p of productsToSeed) {
        // Upsert: Update if exists, Insert if not
        await Product.findOneAndUpdate(
            { slug: p.slug }, 
            { $set: p }, 
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        console.log(`Seeded: ${p.title}`);
    }
    
    console.log('Database Seeding Complete');
    process.exit(0);
  } catch (err) {
    console.error('Seeding Error:', err);
    process.exit(1);
  }
};

seedDB();

//  node scripts/seed.js