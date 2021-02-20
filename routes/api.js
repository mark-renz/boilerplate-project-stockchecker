'use strict';
const https = require('https');
const axios = require('axios');

async function makeApiCall(symbol) {
  const url = `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol}/quote`;

  const res = await axios.get(url);
  const price = await res.data.latestPrice;
  const data =  {stock:symbol, price:price, likes:1};
  return data;
}

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function ({ query }, res){
      const stocks = Array.isArray(query.stock) ? query.stock : [query.stock];
      const like = query.like;
      let data = [];

      Promise.all(
        stocks.map(
          async symbol=>{
            const price = await makeApiCall(symbol);
            return price;
      })
      ).then(val=>{
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({stockData:val}));
      })
    });
    
};

