const express=require('express');
const app=express();
const mongoose=require('mongoose');
const mongourl="mongodb://127.0.0.1:27017/roomify";
const path=require('path');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const ExpressError=require('./utils/ExpressError.js');
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user.js');


const listings=require('./routes/listing.js');
const reviews=require('./routes/review.js');

main()
.then(()=>console.log('Connected to DB'))
.catch(err=>console.log(err));

async function main() {
    await mongoose.connect(mongourl);
}

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,'/public')));

const sessionOptions={
    secret:'mysupersecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now()+ 7*24*60*60*1000,  //time in ms
        maxAge: 7*24*60*60*1000,
        httpOnly: true
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})

app.get('/getDemoUser',async(req,res)=>{
    let fakeUser=new User({
        email:'abc@gmail.com',
        username:'abc',
    });
    let registeredUser=await User.register(fakeUser,'helloWorld');
    res.send(registeredUser);
})

//Root
app.get('/',(req,res)=>{
    res.send('root');
})

app.use('/listings',listings); //listing routes
app.use('/listings/:id/reviews',reviews); //review routes

app.use((req,res,next)=>{
    next(new ExpressError(404,'Page not found'));
})

//Error Handler
app.use((err,req,res,next)=>{
    let {statusCode=500,message='Some error occurred'}= err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render('error.ejs',{ err });
})

app.listen(8080,()=>{
    console.log('server listening on port 8080');
})
