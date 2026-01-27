const mongoose=require('mongoose');
const mongourl="mongodb://127.0.0.1:27017/roomify";
const initData=require('./init.js')
const Listing=require('../models/listing.js');

main().then(()=>console.log('Connected to DB'))
.catch(err=>console.log(err));

async function main() {
    await mongoose.connect(mongourl);
}

const initDB=async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log('data was initialised');
}

initDB();