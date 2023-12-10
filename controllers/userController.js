const User = require('../models/user');
const Event = require('../models/event');
//const profile = require('../views/users/profile.ejs');
const { isGuest, isLoggedIn } = require('../middleware/auth');
const bcrypt = require('bcrypt');
const rsvpModel = require('../models/rsvp');

exports.getRegister = (req, res) => {
    res.render('./users/register');
};

exports.registerUser = (req, res, next) => {
    let user = new User(req.body);
        if (req.file) {
            user.image = "/../profileImage/" + req.file.filename;
        }else {
            user.image = "/../profileImage/stockProfile.png";
        }
    
        user.save()
        .then(() => {
            req.session.user = user._id;
            req.flash('success', 'You have successfully signed up. Please login');
            res.redirect('/users/login')
        })
        .catch(err => {
            if (err.name === "ValidationError") 
            {
              req.flash("error", "Please fill out all the fields");
              return res.redirect("/users/new");
            }
    
            if (err.code === 11000)
            {
              req.flash("error", "Email address has been used");
              return res.redirect("/users/new");
            }
    
            next(err);
        })    
};

// exports.registerUser = async (req, res) => {
//     const { username, email, password } = req.body;

//     try {
//         const newUser = await User.create({ username, email, password });

//         req.flash('success', 'You have successfully registered');
//         res.redirect('../users/login');
//     } catch (err) {
//         req.flash('error', err.message);
//         res.redirect('/users/register');
//     }
// };

exports.getUserLogin = (req, res) => {
    res.render('./users/login');
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            req.flash('error', 'Wrong email address');
            return res.redirect('/users/login');
        }

        const isMatch = await user.comparePassword(password);

        if (isMatch) {
            req.session.user = user._id;
            req.flash('success', 'You have successfully logged in');
            return res.redirect('/users/profile');
        } else {
            req.flash('error', 'Wrong password');
            return res.redirect('/users/login');
        }
    } catch (err) {
        next(err);
    }
};

exports.getProfile = (req, res, next) => { 
    let id = req.session.user.id;
    Promise.all([User.findById(id), Event.find({host: id}), rsvpModel.find({user: id}).populate('event', 'title')]) 
    .then(results=> {
        
        console.log(results);
        const [user, event, rsvp] = results;
        res.render('./user/profile', {user, event, rsvp})
    })
    .catch(err=>next(err));
}

exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            return next(err);
        } else {
            res.redirect('/');
        }
    });
};
