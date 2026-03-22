const mongoose=require('mongoose');
const Review = require('./review');
const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title: {
        type:String,
        required:true,
    },
    description:String,
    image:{
        type:String,
        required:true,
        default: "https://unsplash.com/photos/blue-body-of-water-in-front-of-building-near-trees-during-nighttime-M7GddPqJowg",
        set: v=> v==="" ? "https://unsplash.com/photos/blue-body-of-water-in-front-of-building-near-trees-during-nighttime-M7GddPqJowg":v,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ]
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if (listing) {
        await Review.deleteMany({_id:{$in: listing.reviews}});        
    }
})

const Listing=mongoose.model('Listing',listingSchema);
module.exports=Listing;