const express=require("express");
const axios=require ('axios');
const router = express.Router();


const Server_URL='http://20.244.56.144/evaluation-service/stocks'


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
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ3MDU5OTU5LCJpYXQiOjE3NDcwNTk2NTksImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImViNGEwMGZiLTBjY2ItNGYzMy1hMDA3LTczNGZlNDZiM2UzNCIsInN1YiI6ImFrc2g0eS5zdW5pdGhAZ21haWwuY29tIn0sImVtYWlsIjoiYWtzaDR5LnN1bml0aEBnbWFpbC5jb20iLCJuYW1lIjoiYWtzaGF5IHN1bml0aCIsInJvbGxObyI6ImtoLmVuLnAybWNhMjQwMDciLCJhY2Nlc3NDb2RlIjoiU3d1dUtFIiwiY2xpZW50SUQiOiJlYjRhMDBmYi0wY2NiLTRmMzMtYTAwNy03MzRmZTQ2YjNlMzQiLCJjbGllbnRTZWNyZXQiOiJTQ0d5UXlLa1plWkJIcWtKIn0.S2gEe-GJeLc_Dp2T6Td-cgMpCKpF7KWhuosv0wNEPO8'
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