const express=require('express');
const wrapAsync = require('../utils/wrapAsync');
const router=express.Router();
const User=require('../models/user')

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

module.exports=router;