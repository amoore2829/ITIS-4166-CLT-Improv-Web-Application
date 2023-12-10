const {body} = require('express-validator')
exports.validateId = (req, res, next) => {
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid event i: ' + id);
        err.status = 400;
        return next(err);
    } else {
        return next();
    }
}

exports.validateLogin = [body('email', 'Email must be vaild').isEmail().trim().escape().normalizeEmail(), 
body('password', 'Password must be at 8 characters and at most 64 characters').isLength({min: 8, max: 64})]

exports.validateSignUp = [   
    body('firstName', 'First name is required').notEmpty().trim().escape(),
    body('lastName', 'Last name is required').notEmpty().trim().escape(),
    body('email', 'Email must be vaild').isEmail().trim().escape().normalizeEmail().notEmpty(), 
    body('password', 'Password must be at 8 characters and at most 64 characters').isLength({min: 8, max: 64})
]


exports.validateResult = (req, res, next)=>{
    let errors = validationResult(req);

    if(!errors.isEmpty()) {
        errors.array().forEach(error=>{
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    } 
        return next();


}


