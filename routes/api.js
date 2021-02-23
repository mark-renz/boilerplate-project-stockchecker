'use strict';
const axios = require('axios');

const Stock = require('../models/Stock');

async function getPrice(symbol) {
  console.log('getPrice');
  const url = `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol}/quote`;

  const res = await axios.get(url);
  const price = await res.data.latestPrice;
  const data =  {stock:symbol, price:price};

  return data;
}


async function getLikes(symbol, ip, isLiked) {
  console.log('getLikes');

  //TODO: find data if exist
  
  const data = await Stock.findOne({stock: symbol});

   //TODO: if data && isLiked 
  //if ip exist return likes
  //else add address return likes
  //TODO: if data && !isLiked return likes
  if(data){
    if(isLiked) {
      if(data.likes.indexOf(ip) == -1) {
      
        const myQuery = {stock:symbol} ;
        const newValues = { $push: { likes: [ip] } };
        const options = {new: true};
        const newData = await Stock.findOneAndUpdate(myQuery,newValues,options);
        
        return {likes : newData.likes.length};
      } else return {likes : data.likes.length};
    } else return {likes : data.likes.length};   
  }

  //TODO: if !data && isLiked create new like, return like 1
  //TODO: if !data && !isLiked create new like, return like 0
  else{

    const address = isLiked ? ip : [];
    
    const newStock = new Stock({
      stock:symbol,
      likes: address
    });

    const data = await newStock.save();

    return {likes : data.likes.length};

  }
}

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function ({ip, query}, res){
      
      //if returns single item convert it to array state
      const stocks = Array.isArray(query.stock) ? query.stock : [query.stock];
      const isLiked = query.like;

      (async () => { 
      let data = await Promise.all(
        stocks.map(
          async symbol => {
            const price = await getPrice(symbol);
            const like = await getLikes(symbol, ip, isLiked);
            
            let stockData = price;
            
            stockData.price ?
              stockData.likes = like.likes : stockData = like;
            
            console.log(stockData);
            return stockData;
      }))
    
    //if single remove to array state
    data.length > 1 ? data : data = data[0];
    
    res.setHeader('Content-Type', 'application/json');
    res.send({stockData:data});
      }) ();
    });
  
    
};

