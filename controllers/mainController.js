const fetch = require('node-fetch-commonjs');

async function createUser(user){
    let data = await fetch(encodeURI('https://bookify-api-1.herokuapp.com/user/' + user), {
        method: 'POST',
    });
    if (!data.ok) {
        let err = new Error('HTTP Error');
        err.status = data.status;
        throw err;
    }
}

async function getHistory(user) {
    let data = await fetch(encodeURI('https://bookify-api-1.herokuapp.com/history/' + user));
    if (!data.ok) {
        if (data.status == 404) {
            await createUser(user)
            await getHistory(user)
        }
        let err = new Error('HTTP Error');
        err.status = data.status;
        throw err;
    } else {
        return data.json()
    }
}

async function getInsights(user) {
    let data = await fetch(encodeURI('https://bookify-api-1.herokuapp.com/history/' + user + "/insights"));
    if (!data.ok) {
        if (data.status == 404) {
            await createUser(user)
            await getInsights(user)
        }
        let err = new Error('HTTP Error');
        err.status = data.status;
        throw err;
    } else {
        return data.json()
    }
}


exports.index = async (req, res, next) => {
    const renderObj = {
        isAuthenticated: req.oidc.isAuthenticated(), 
        user: req.oidc.user
    }
    if (req.oidc.isAuthenticated()) {
        let history = await getHistory(req.oidc.user.sub)
        let insights = await getInsights(req.oidc.user.sub)
        renderObj.history = history;
        renderObj.insights = insights;
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

exports.explore = async (req, res, next) => {
    const renderObj = {
        isAuthenticated: req.oidc.isAuthenticated(), 
        user: req.oidc.user
    }
    res.render('./user/explore', renderObj);
}

exports.book = async (req, res, next) => {
    let history = await getHistory(req.oidc.user.sub);
    let id = req.query.id;
    let data = await fetch('https://www.googleapis.com/books/v1/volumes/' + id);
    if (!data.ok) {
        let err = new Error('HTTP Error');
        err.status = data.status;
        next(err);
    } else {
        let book = await data.json();
        let read = false;
        if (history.some(e => e._id === book.id)) {
            read = true;
        }
        const renderObj = {
            isAuthenticated: req.oidc.isAuthenticated(), 
            user: req.oidc.user,
            book: book.volumeInfo,
            bookId: book.id,
            markedRead: read,
        }
        res.render('./book', renderObj);
    }
}

exports.insights = async (req, res, next) => {
    let insights = await getInsights(req.oidc.user.sub)
    const renderObj = {
        isAuthenticated: req.oidc.isAuthenticated(), 
        user: req.oidc.user,
        bookPageYTD: insights.bookPageYTD,
        top5Books: insights.top5Books,
        top5Genres: insights.top5Genres,
        top5Authors: insights.top5Authors,
        totals: insights.totals
    }
    res.render('./user/insights', renderObj);
}
