const express = require('express');
const controller = require('../controllers/userController');
const { isGuest, isLoggedIn } = require('../middleware/auth');
const User = require('../models/user');
const Event = require('../models/event');
const bcrypt = require('bcrypt');
const router = express.Router();

// POST /users: create a new user account
router.post('/', isGuest, controller.registerUser);

// GET /users/register: send HTML form for registering a user
router.get('/register', isGuest, controller.getRegister);

// POST /users/register: register a user
router.post('/', isGuest, controller.registerUser);

// GET /users/login: send HTML for logging in
router.get('/login', isGuest, controller.getUserLogin);

// POST /users/login: authenticate user's login
router.post('/login', isGuest, controller.login);

// GET /users/profile: send user's profile page
router.get('/profile', isLoggedIn, controller.profile);

// GET /users/logout: logout a user
router.get('/logout', isLoggedIn, controller.logout);


module.exports = router;
