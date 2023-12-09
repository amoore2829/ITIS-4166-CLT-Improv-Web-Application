// require models
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const eventRoutes = require('./routes/eventRoutes');
const mainRoutes = require('./routes/mainRoutes');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const User = require('./models/user');

// create app
const app = express();

// configure app
let port = process.env.PORT || 3000;
let host = 'localhost';
const auth = process.env.AUTH || undefined

let url = process.env.MONGODB_URI;
app.set('view engine', 'ejs');

console.log('url: ', url);

//connect to database
mongoose.connect('mongodb+srv://amoor202:demo123@cluster01.b9blw2k.mongodb.net/nbad-project3?retryWrites=true&w=majority')

.then(()=>{
    //start app
    app.listen(port, host, ()=>{
        console.log('Server is running on port', port);
    });
})
.catch(err=>console.log(err.message));

// mount middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({mongoUrl: url})
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// set up routes
//app.get('/', (req, res) => {
//    res.redirect('./index');
//});

app.use('/', mainRoutes);

app.use('/events', eventRoutes);

app.use('/users', userRoutes);

// app.use((req, res, next) => {
//     let err = new Error('The server cannot locate ' + req.url);
//     err.status = 404;
//     next(err);
// });

// app.use((err, req, res, next) => {
//     if(!err.status) {
//         err.status = 500;
//         err.message = ('Internal Server Error');
//     }
//     console.log(err);

//     res.status(err.status);
//     res.render('error', { error: err, user: req.user });
// });
