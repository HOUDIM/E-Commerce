const express = require('express');
const router = express.Router();
const { register, login, getUserProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Route d'inscription
router.post('/register', register);

// Route de connexion
router.post('/login', login);

// Route de profil utilisateur (protégée)
router.get('/profile', authMiddleware, getUserProfile);

module.exports = router;