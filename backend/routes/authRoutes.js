const express = require('express');
const { register, login, getMe } = require('../controllers/authController');

const router = express.Router;
const authRouter = express.Router();

const { protect } = require('../middleware/authMiddleware');

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/me', protect, getMe);

module.exports = authRouter;
