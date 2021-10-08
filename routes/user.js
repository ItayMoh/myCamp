const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync.js')
const passport = require('passport')

const User = require('../models/user.js')
const {alreadyLoggedIn} = require('../middleware.js')


router.get('/register', alreadyLoggedIn, (req, res, next)=>{
    res.render('users/register.ejs')
}) 

router.post('/register', alreadyLoggedIn, catchAsync(async(req, res, next)=>{
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
}));

router.get('/login', alreadyLoggedIn, (req, res, next)=>{
    res.render('users/login.ejs')
}) 

router.post('/login', alreadyLoggedIn, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res, next)=>{
    req.flash('success', 'Successfully logged in')
    const redirectUrl = req.session.originatedUrlFrom || '/campgrounds';
    delete req.session.originatedUrlFrom;
    res.redirect(redirectUrl)
}) 

router.get('/logout', (req, res, next)=>{
    req.logout();
    req.flash('success', 'Successfuly logged out');
    res.redirect('/campgrounds');
}) 

module.exports = router;

