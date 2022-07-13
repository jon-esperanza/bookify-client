const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');

// create app
const app = express();

// configure app
let port = 3000;
let host = 'localhost';
app.set('view engine', 'ejs');

// mount middlewares
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

// routes
app.get('/', (req, res, next) => {
    res.render('./index');
});

// handle undefined routes
app.use((req, res, next) => {
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
});

// handle errors -> redirect to error page
app.use((err, req, res, next) => {
    console.log(err.stack);
    if(!err.status) {
        err.status = 500;
        err.message = ("Internal Server Error");
    }
    res.status(err.status);
    res.render('error', {
        error: err
    });
});

// start server
app.listen(port, host, () => {
    console.log('Server is running on port', port);
});