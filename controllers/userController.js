const User = require('../models/user');
const Event = require('../models/event');
const profile = require('../views/users/profile.ejs');
const { isGuest, isLoggedIn } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

exports.getRegister = (req, res) => {
    res.render('register');
};

exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const newUser = await User.create({ username, email, password });

        req.flash('success', 'You have successfully registered');
        res.redirect('/login');
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/register');
    }
};

exports.getUserLogin = (req, res) => {
    res.render('login');
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            req.flash('error', 'Wrong email address');
            return res.redirect('/login');
        }

        const isMatch = await user.comparePassword(password);

        if (isMatch) {
            req.session.user = user._id;
            req.flash('success', 'You have successfully logged in');
            return res.redirect('/profile');
        } else {
            req.flash('error', 'Wrong password');
            return res.redirect('/login');
        }
    } catch (err) {
        next(err);
    }
};

exports.profile = async (req, res, next) => {
    const id = req.session.user;

    try {
        const user = await User.findById(id);
        const events = await Event.find({ author: id });

        res.render('profile', { user, events });
    } catch (err) {
        next(err);
    }
};

exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            return next(err);
        } else {
            res.redirect('/');
        }
    });
};
