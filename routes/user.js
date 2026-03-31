const express=require('express');
const wrapAsync = require('../utils/wrapAsync');
const router=express.Router();
const User=require('../models/user');
const passport=require('passport');

router.get('/signup',(req,res)=>{
    res.render('./users/signup.ejs');
})

router.post('/signup',wrapAsync(async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.flash('success','Welcome to Roomify');
        res.redirect('/listings');
    }catch(err){
        req.flash('error',err.message);
        res.redirect('/signup')
    }  
}))

router.get('/login',(req,res)=>{
    res.render('./users/login.ejs');
})

router.post('/login',
    passport.authenticate('local',{failureRedirect:'/login',failureFlash:true}),
    wrapAsync(async(req,res)=>{
        req.flash('success','Welcome to Roomify! You are logged in!');
        res.redirect('/listings');
    }))

module.exports=router;