const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator');
const { auth } = require('../middlewares/auth');

// @route   POST /api/auth/register
router.post(
  '/register',
  [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  authController.registerUser
);

// @route   POST /api/auth/login
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  authController.loginUser
);

// @route   GET /api/auth/me
router.get('/me', auth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
