require("dotenv").config({ path: "../.env" });
const mongoose=require('mongoose');

// const mongourl="mongodb://127.0.0.1:27017/roomify";

const dbUrl=process.env.ATLASDB_URL;
const dns=require('dns');
dns.setServers(['1.1.1.1','8.8.8.8']);

const initData=require('./init.js')
const Listing=require('../models/listing.js');

main().then(()=>console.log('Connected to DB'))
.catch(err=>console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}

const initDB=async ()=>{
    await Listing.deleteMany({});
    // initData.data=initData.data.map((obj)=>({...obj,owner: '69fada615be42a955ea9166a'}))
    await Listing.insertMany(initData.data);
    console.log('data was initialised');
}

initDB();