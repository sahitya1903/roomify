if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}
// console.log(process.env.SECRET);

const express = require('express');
const app = express();
const mongoose = require('mongoose');
// const mongourl="mongodb://127.0.0.1:27017/roomify";

const dbUrl = process.env.ATLASDB_URL;
const dns = require('dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);


const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const session = require('express-session');

const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

const MongoStore = require('connect-mongo').default;

const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js')

main()
    .then(() => console.log('Connected to DB'))
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
})

store.on("error", (err) => {
    console.log('Error in MONGO Session Store', err)
});


const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,  //time in ms
        maxAge: 7 * 24 * 60 * 60 * 1000,
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


app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
})

// app.get('/getDemoUser',async(req,res)=>{
//     let fakeUser=new User({
//         email:'abc@gmail.com',
//         username:'abc',
//     });
//     let registeredUser=await User.register(fakeUser,'helloWorld');
//     res.send(registeredUser);
// })

// //Root
// app.get('/',(req,res)=>{
//     res.send('root');
// })

app.use('/listings', listingRouter); //listing routes
app.use('/listings/:id/reviews', reviewRouter); //review routes
app.use('/', userRouter); //user routes


app.use((req, res, next) => {
    next(new ExpressError(404, 'Page not found'));
})

//Error Handler
app.use((err, req, res, next) => {
    let { statusCode = 500, message = 'Some error occurred' } = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render('error.ejs', { err });
})

app.listen(8080, () => {
    console.log('server listening on port 8080');
})
