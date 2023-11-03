// require models
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const eventRoutes = require('./routes/eventRoutes');
const mainRoutes = require('./routes/mainRoutes');
require('dotenv').config();
const mongoose = require('mongoose');

// create app
const app = express();

// configure app
let port = process.env.PORT || 3000;
let host = 'localhost';
const auth = process.env.AUTH || undefined

let url = process.env.MONGODB_URI;
app.set('view engine', 'ejs');

console.log('url: ', url);

// connect to mongodb
mongoose.connect(url)
.then(
    //start the server
    app.listen(port, host, () =>
    {
        console.log('Server is running on port', port);
    })
    
)
.catch(err => console.log(err.message))

// mount middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

// set up routes
//app.get('/', (req, res) => {
//    res.redirect('./index');
//});

app.use('/', mainRoutes);

app.use('/events', eventRoutes);

app.use((req, res, next) => {
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if(!err.status) {
        err.status = 500;
      err.message = ('Internal Server Error');
    }
    console.log(err);

    res.status(err.status);
   res.render('error', {error: err});
});