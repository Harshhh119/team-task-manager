const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.log("❌ DB Connection Error:", err));

// 2. Simple User Schema (Role-Based)
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Member'], default: 'Member' }
});
const User = mongoose.model('User', UserSchema);

// 3. Middleware for Role-Based Access Control (RBAC)
const authorize = (roles = []) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden: Access Denied" });
      }
      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid Token" });
    }
  };
};

// 4. Routes
// Registration Route
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ message: "User Created" });
  } catch (err) {
    res.status(400).json({ message: "Error registering user" });
  }
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { name: user.name, role: user.role } });
  } else {
    res.status(400).json({ message: "Invalid Credentials" });
  }
});

// Admin-Only Route Example
app.post('/api/admin/create-project', authorize(['Admin']), (req, res) => {
  res.json({ message: "Project created successfully (Admin Only Access)" });
});

// Start Server
const PORT = process.env.PORT || 5000;
const path = require('path');

// 1. Serve the static files from the React app build folder
app.use(express.static(path.join(__dirname, '../client/build')));

// 2. Handle any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));