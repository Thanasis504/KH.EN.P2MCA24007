const express=require("express");
const axios=require ('axios');
const router = express.Router();


const Server_URL='http://20.244.56.144/evaluation-service/stocks'
const AUTH_TOKEN = process.env.AUTH_TOKEN;


// Fetching stock data from server based on timeframe
router.get('/:ticker', async(req,res) => {
    const {ticker}=req.params;
    const {minutes, agg} = req.query;
    if (!minutes || agg !=='average'){
        return res.status(400).json({ error: "error"});
        

    }

    try {
        const response=await axios.get(`${Server_URL}/${ticker}?minutes=${minutes}`,{
        headers:{
            Authorization: 'Bearer Bearer ${AUTH_TOKEN}'
        }});
        const priceData = response.data;

        if (!priceData || priceData.length === 0){
            return res.status(404).json({
                error: "No price found"
            });
        }
        

        let total_value = 0;
        let priceHistory = [];
        for (let i=0 ; i<priceData.length; i++){
            total_value += priceData[i].price;
            priceHistory.push({
                price: priceData[i].price,
                lastUpdatedAt: priceData[i].lastUpdatedAt
            });
        }

        const average= total_value/ priceData.length;

        // Generating response
        res.json({
            averageStockPrice: parseFloat(average.toFixed(6)),
            priceHistory: priceHistory
        });
    }
    catch (error){
        console.log("Error fetching data");
    }
});
module.exports = router;