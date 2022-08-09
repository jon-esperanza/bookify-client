const fetch = require('node-fetch-commonjs');

exports.index = (req, res, next) => {
    const renderObj = {
        isAuthenticated: req.oidc.isAuthenticated(), 
        user: req.oidc.user
    }
    if (req.oidc.isAuthenticated()) {
        res.render('./user/dashboard', renderObj);
    } else {
        res.render('./index', renderObj);
    }
}

exports.signup = (req, res, next) => {
    res.oidc.login({
        returnTo: '/',
        authorizationParams: {
            screen_hint: 'signup',
        },
    });
}

exports.explore = (req, res, next) => {
    const renderObj = {
        isAuthenticated: req.oidc.isAuthenticated(), 
        user: req.oidc.user
    }
    res.render('./user/explore', renderObj);
}

exports.book = async (req, res, next) => {
    let id = req.query.id;
    let data = await fetch('https://www.googleapis.com/books/v1/volumes/' + id);
    if (!data.ok) {
        let err = new Error('HTTP Error');
        err.status = data.status;
        next(err);
    } else {
        let book = await data.json();
        const renderObj = {
            isAuthenticated: req.oidc.isAuthenticated(), 
            user: req.oidc.user,
            book: book.volumeInfo,
        }
        res.render('./book', renderObj);
    }
}
