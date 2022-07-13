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
