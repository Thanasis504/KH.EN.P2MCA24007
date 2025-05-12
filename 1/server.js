const express=require("express");
const app=express();
const stock=require('./routes/stocks');


app.use(express.json())
app.use('/stocks', stock);

app.listen(3000,() =>{
    console.log(`server running on port 3000`);
});