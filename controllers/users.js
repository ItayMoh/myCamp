const User = require('../models/user.js')
const passport = require('passport')

module.exports.register = async(req, res, next)=>{
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const newUser = await User.register(user, password)
        req.login(newUser, (err)=>{
            if(err) return next(err);
            req.flash('success','Welcome to myCamp!')
            res.redirect('/campgrounds')
        })
    }catch(e){
        req.flash('error', e.message);
        res.redirect('/register')
    }
}

module.exports.registerPage =  (req, res, next)=>{
    res.render('users/register.ejs')
}

module.exports.loginPage = (req, res, next)=>{
    res.render('users/login.ejs')
}

module.exports.flashing = (req, res, next)=>{
    req.flash('success', 'Successfully logged in')
    const redirectUrl = req.session.originatedUrlFrom || '/campgrounds';
    delete req.session.originatedUrlFrom;
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res, next)=>{
    req.logout();
    req.flash('success', 'Successfuly logged out');
    res.redirect('/campgrounds');
}