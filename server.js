const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const emailRoutes = require('./routes/emailRoutes');
const authRoutes = require('./routes/authRoutes');
const Product = require('./models/productModel');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.get('/', (req, res) => {
    res.send('Welcome to Sabaysis Backend');
});
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/products', productRoutes);
app.use('/api', emailRoutes); 
app.use('/api/auth', authRoutes);

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
