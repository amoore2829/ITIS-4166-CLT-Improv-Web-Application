const event = require('../models/event');
const Event = require('../models/event');

// check if user is a guest
exports.isGuest = (req, res, next) => {
    if (!req.session.user) {
        return next();
    } else {
        req.flash('error', 'You have already logged in');
        return res.redirect('/users/profile');
    }
}

// check if user is authenticated
exports.isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        req.flash('error', 'You must be logged in to view this page');
        return res.redirect('/users/login');
    }
}

// check if user is author of the story
exports.isAuthor = (req, res, next) => {
    let id = req.params.id;

    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid event id');
        err.status = 400;
        return next(err);
    }
    Event.findById(id)
    .then(event => {
        if(event) {
            if(event.author == req.session.user) {
                return next();
            } else {
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        } else {
            let err = new Error('Cannot find a event with id ' + id);
                err.status = 404;
                return next(err);
        }
    })
    .catch(err=>next(err));
};