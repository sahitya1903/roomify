const express=require('express');
const app=express();
const mongoose=require('mongoose');
const mongourl="mongodb://127.0.0.1:27017/roomify";
const Listing=require('./models/listing.js');
const path=require('path');
const methodOverride=require('method-override')

main().then(()=>console.log('Connected to DB'))
.catch(err=>console.log(err));
async function main() {
    await mongoose.connect(mongourl);
}

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

//Root
app.get('/',(req,res)=>{
    res.send('root');
})


//INDEX Route
app.get('/listings',async (req,res)=>{
    const allListings=await Listing.find({});
    res.render('./listings/index.ejs',{allListings});
})

//NEW Route
app.get('/listings/new',(req,res)=>{
    res.render('./listings/new.ejs')    
})

//CREATE Route
app.post('/listings/',async(req,res)=>{
    const newListing=req.body;
    await Listing.insertOne(newListing);
    res.redirect('/listings');
})


//SHOW Route
app.get('/listings/:id',async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render('./listings/show.ejs',{listing});
})


//EDIT Route
app.get('/listings/:id/edit',async(req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id);
    res.render('./listings/edit.ejs',{listing});
})

//UPDATE Route
app.put('/listings/:id',async(req,res)=>{
    const {id}=req.params;
    const updatedListing=req.body;
    await Listing.findByIdAndUpdate(id,updatedListing);
    // await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect('/listings');
})

//DESTROY Route
app.delete('/listings/:id',async(req,res)=>{
    const {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
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