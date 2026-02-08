const express=require('express');
const app=express();
const mongoose=require('mongoose');
const mongourl="mongodb://127.0.0.1:27017/roomify";
const Listing=require('./models/listing.js');
const path=require('path');

main().then(()=>console.log('Connected to DB'))
.catch(err=>console.log(err));
async function main() {
    await mongoose.connect(mongourl);
}

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));

//Root
app.get('/',(req,res)=>{
    res.send('root');
})


//INDEX Route
app.get('/listings',async (req,res)=>{
    const allListings=await Listing.find({});
    res.render('./listings/index.ejs',{allListings});
})

//SHOW Route
app.get('/listings/:id',async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render('./listings/show.ejs',{listing});
})


/*
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

*/
app.listen(8080,()=>{
    console.log('server listening on port 8080');
})