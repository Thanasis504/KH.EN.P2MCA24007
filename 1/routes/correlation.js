const express=require("express");
const axios=require ('axios');
const router = express.Router();


const Server_URL = "http://20.244.56.144/evaluation-service/stocks";
const AUTH_TOKEN = process.env.AUTH_TOKEN;

router.get("/correlation/:stock1/:stock2", async(req,res) =>{
    const {stock1,stock2}= req.params;
    const{minutes}=req.query;

    if (!minutes){
        return res.status(400)

    }

    try{
        const response1 =await axios.get(`${Server_URL}/${stock1}?minutes=${minutes}`,{
            headers:{
                Authorization: 'Bearer ${AUTH_TOKEN}'
            }});
        const response2 =await axios.get(`${Server_URL}/${stock2}?minutes=${minutes}`,{
            headers:{
                    Authorization: 'Bearer Bearer ${AUTH_TOKEN}'
                }});
    
    let prices1 =[];
    let prices2 =[];

    for (let i=0; i<response1.data.length; i++) {
    prices1.push(response1.data[i].price);
    }

    for (let i = 0; i < response2.data.length; i++) {
    prices2.push(response2.data[i].price);
    }
    const len = Math.min(prices1.length, prices2.length);
    if (len<2){
        return res.status(400)

    }
let x=[];
let y=[];
for (let i=0;i<len;i++) {
x.push(prices1[i]);
y.push(prices2[i]);
}
// calculating averages
let sum_X=0;
for (let i=0; i < x.length; i++) {
  sum_X+=x[i];
}
let avg_X=sum_X/x.length;

let sum_Y= 0;
for (let i = 0; i < y.length; i++) {
  sum_Y += y[i];
}
let avg_Y = sum_Y / y.length;


let numerator = 0;



for (let i = 0; i < len; i++) {
    const dx = x[i] - avg_X;
    const dy = y[i] - avg_Y;
    numerator += dx * dy;
    sum_X += dx * dx;
    sum_Y += dy * dy;
  }

  const denominator =Math.sqrt(sum_X * sum_Y);
  const correlation=denominator === 0 ? 0 : numerator/denominator;
  res.json({
    stock1,stock2,correlation:parseFloat(correlation.toFixed(4))
  });
}

catch(err){
    res.status(500).json({error:"correlation calc error"});
}
});

module.exports = router;