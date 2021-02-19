'use strict';
const request = require('request');

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function ({ query }, res){
      const stocks = query.stock;
      
      console.log(stocks);
      
      stocks.forEach(symbol => {
        makeApiCall(symbol)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        })
      })

      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({stockData:{}}));
    });
    
};

const makeApiCall = (symbol) => {
  const url = `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol}/quote`;
  
  return new Promise ((resolve, reject) => {
    request(url, { json: true }, 
      (err, res, body) => {
        err ? reject(err) : resolve(body.latestPrice);
    });
  });
}
