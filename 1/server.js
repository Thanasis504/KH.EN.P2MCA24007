const express=require("express");
const app=express();
require('dotenv').config();

const stock=require('./routes/stocks');
const correlation=require('./routes/correlation');

app.use(express.json())
app.use('/stocks', stock);
app.use('/', correlation);

app.listen(3000,() =>{
    console.log(`server running on port 3000`);
});