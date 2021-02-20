'use strict';
const axios = require('axios');

async function getPrice(symbol) {
  const url = `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol}/quote`;

  const res = await axios.get(url);
  const price = await res.data.latestPrice;
  const data =  {stock:symbol, price:price};
  return data;
}


async function getLikes(symbol) {
  return 1;
}

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function ({ query }, res){
      //if returns single item convert it to array state
      const stocks = Array.isArray(query.stock) ? query.stock : [query.stock];
      const like = query.like;
      let data = [];

      Promise.all(
        stocks.map(
          async symbol=>{
            const price = await getPrice(symbol);
            const likes = await getLikes(symbol);
            price.likes = likes;
            return price;
      })
      ).then(val=>{
        //if single remove to array state
        val.length > 1 ? val : val=val[0];
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({stockData:val}));
      })
    });
    
};

