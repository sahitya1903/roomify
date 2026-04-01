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
    initData.data=initData.data.map((obj)=>({...obj,owner: '69cb701ec9dc1a3d444033da'}))
    await Listing.insertMany(initData.data);
    console.log('data was initialised');
}

initDB();