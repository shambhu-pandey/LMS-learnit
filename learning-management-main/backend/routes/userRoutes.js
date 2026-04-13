// const express = require('express');
// const { registerUser, authUser, getUserProfile } = require('../controllers/userController');
// const { protect } = require('../middleware/authMiddleware');
// const { getProfile, updateProfile } = require('../controllers/userController');
// const router = express.Router();

// router.post('/register', registerUser);
// router.post('/login', authUser);
// router.get('/profile', protect, getProfile);
// router.put('/profile', protect, updateProfile);
// module.exports = router;




const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  registerUser,
  authUser,
  getProfile,
  updateProfile
} = require('../controllers/userController');

// Auth routes
router.post('/register', registerUser);
router.post('/login', authUser);

// Profile routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;