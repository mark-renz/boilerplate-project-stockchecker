'use strict';

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({stockData:{}}));
    });
    
};
