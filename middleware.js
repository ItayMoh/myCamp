module.exports.loggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        //Store the url a user requests and after he successfully logging in, redirect to there
        req.session.originatedUrlFrom = req.originalUrl;
        req.flash('error', 'You must be signed in')
        return res.redirect('/login')
    }
    next();
}

module.exports.alreadyLoggedIn = (req, res, next)=>{
    if(req.isAuthenticated()){
        req.flash('error', `You are already logged in`)
        return res.redirect('/campgrounds')
    }
    next();
}
