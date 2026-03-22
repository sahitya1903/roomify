const express=require('express');
const app=express();
const mongoose=require('mongoose');
const mongourl="mongodb://127.0.0.1:27017/roomify";
const Listing=require('./models/listing.js');
const path=require('path');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const wrapAsync=require('./utils/wrapAsync.js');
const ExpressError=require('./utils/ExpressError.js');
const {listingSchema,reviewSchema}=require('./schema.js');
const Review=require('./models/review.js');

main().then(()=>console.log('Connected to DB'))
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


//Root
app.get('/',(req,res)=>{
    res.send('root');
})

//Listing Schema Validation Middleware
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map(el=>el.message).join(',');
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

//Review Schema Validation Middleware
const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map(el=>el.message).join(',');
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

//INDEX Route
app.get('/listings',wrapAsync(async (req,res,next)=>{
    const allListings=await Listing.find({});
    res.render('./listings/index.ejs',{allListings});
}))

//NEW Route
app.get('/listings/new',(req,res,next)=>{
    res.render('./listings/new.ejs')    
})

//CREATE Route
app.post('/listings',validateListing, wrapAsync(async(req,res,next)=>{
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect('/listings');
}))


//SHOW Route
app.get('/listings/:id',wrapAsync(async(req,res,next)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate('reviews');
    res.render('./listings/show.ejs',{listing});
}))


//EDIT Route
app.get('/listings/:id/edit',wrapAsync(async(req,res,next)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id);
    res.render('./listings/edit.ejs',{listing});
}))

//UPDATE Route
app.put('/listings/:id',validateListing,wrapAsync(async(req,res,next)=>{
    const {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect('/listings');
}))

//DESTROY Route
app.delete('/listings/:id',wrapAsync(async(req,res,next)=>{
    const {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}))

//ADD Review Route
app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing.id}`);
}))

//Adding Sample listing
app.get("/testListing",async(req,res)=>{
    let sampleListing=new Listing({
        title:"My New Villa",
        description:"Near the beach",
        price:2000,
        image:"",
        location:"Panaji,Goa",
        country:"India"
    });
    await sampleListing.save();
    console.log('sample saved');
    res.send("successful testing");
})

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