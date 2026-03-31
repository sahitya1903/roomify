module.exports.isLoggedIn=(req,res,next)=>{
    //save redirect url when user is not logged in
    // console.log(req.path,'..',req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash('error','You must be logged in to create listing.');
        return res.redirect('/login');
    }
    next();
}


//needed bcz passport resets redirectUrl value everytime user login successful 
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}
