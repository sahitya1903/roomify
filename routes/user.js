const express=require('express');
const wrapAsync = require('../utils/wrapAsync');
const router=express.Router();
const passport=require('passport');
const { saveRedirectUrl } = require('../middleware');
const userController=require('../controllers/user');

router.get('/signup',userController.renderSignupForm);

router.post('/signup',wrapAsync(userController.signup));

router.get('/login',userController.renderLoginForm);

router.post('/login',saveRedirectUrl,
    passport.authenticate('local',{failureRedirect:'/login',failureFlash:true}),
    wrapAsync(userController.login)
);

router.get('/logout',userController.logout);

module.exports=router;
