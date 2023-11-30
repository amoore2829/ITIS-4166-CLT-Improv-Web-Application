function isLoggedIn(req, res, next) {
    req.user = req.session.user;
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
}