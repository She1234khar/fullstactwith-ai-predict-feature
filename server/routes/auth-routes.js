const express = require('express');
const { registerUser, loginUser, logout, authMiddleware } = require('../controllers/auth/auth-controller');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logout);

router.get('/check-auth', async (req, res) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(200).json({
        success: false,
        message: 'No token provided',
        user: null
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(200).json({
        success: false,
        message: 'Invalid token',
        user: null
      });
    }

    res.status(200).json({
      success: true,
      message: 'Authenticated user!',
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.log('Auth check error:', error);
    res.status(200).json({
      success: false,
      message: 'Invalid token',
      user: null
    });
  }
});

module.exports = router;