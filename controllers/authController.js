const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
  
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
  
    if (email === adminEmail && password === adminPassword) {
      res.json({
        success: true,
        admin: {
          email: adminEmail,
          role: 'admin'
        }
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  };
  
  module.exports = { loginAdmin };
