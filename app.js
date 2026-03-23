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

const listings=require('./routes/listing.js');

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

app.use('/listings',listings); //listing routes

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

//ADD Review Route
app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing.id}`);
}))

//Delete Review Route
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
    let {id, reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}}); ///delete review object id from listing array
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
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