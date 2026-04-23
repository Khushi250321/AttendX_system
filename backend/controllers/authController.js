const User = require('../models/User');
const jwt = require('jsonwebtoken');

// ✅ REGISTER — any user can create an account
const register = async (req, res) => {
  try {
    const { name, email, password, role, enrollmentNumber, semester, class: className } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password and role are required' });
    }
    if (!['student', 'teacher'].includes(role)) {
      return res.status(400).json({ message: 'Role must be student or teacher' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    // NOTE: Do NOT hash here — User model pre('save') does it automatically
    const user = await User.create({
      name, email, password, role,
      enrollmentNumber: enrollmentNumber || '',
      semester: semester || '',
      class: className || '',
    });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role,
              enrollmentNumber: user.enrollmentNumber, semester: user.semester, class: user.class },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'No account found with this email' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      message: 'Login successful',
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role,
              enrollmentNumber: user.enrollmentNumber, semester: user.semester, class: user.class },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET CURRENT USER (called by AuthContext on page refresh)
const getMe = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, getMe };
