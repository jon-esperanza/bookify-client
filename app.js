const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const methodOverride = require('method-override');
const { auth } = require('express-openid-connect');
const mainRoutes = require('./routes/mainRoutes.js');

// create app
const app = express();

// configure app
let port = 3000;
let host = 'localhost';
app.set('view engine', 'ejs');
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.OAUTH_SECRET,
    baseURL: 'http://localhost:3000',
    clientID: process.env.OAUTH_CLIENT_ID,
    issuerBaseURL: process.env.OAUTH_ISSUER_BASE_URL
};

// mount middlewares
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));
app.use(auth(config));

// routes
app.use('/', mainRoutes);

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
        isAuthenticated: req.oidc.isAuthenticated(),
        user: req.oidc.user,
        error: err
    });
});

// start server
app.listen(port, host, () => {
    console.log('Server is running on port', port);
});