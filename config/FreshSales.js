const dotenv=require('dotenv');
dotenv.config();

const FreshSales = {
    baseURL: process.env.FRESHSALES_API_URL,
    headers: {
      Authorization: `Token token=${process.env.FRESHSALES_API_KEY}`,
      'Content-Type': 'application/json'
    }
  };

module.exports=FreshSales