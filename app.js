const express=require('express');
const app=express();

const mongoose=require('mongoose');
const mongourl="mongodb://127.0.0.1:27017/roomify";

app.set('view engine','ejs');


main().then(()=>console.log('Connected to DB'))
.catch(err=>console.log(err));
async function main() {
    await mongoose.connect(mongourl);
}

app.get('/',(req,res)=>{
    res.send('root');
})

app.listen(8080,()=>{
    console.log('server listening on port 8080');
})