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
  let likeCount;

  //TODO: find data if exist
  //TODO: if !data && !isLiked create new like, return like 0
  //TODO: if data && !isLiked return likes
  //TODO: if !data && isLiked create new like, return like 1
  
  const data = await Stock.findOne({stock: symbol});

   //TODO: if data && isLiked 
  //if ip exist return likes
  //else add address return likes 
  if(data && isLiked){
    if(data.likes.indexOf(ip) == -1) {
      
      const myQuery = {stock:symbol} ;
      const newValues = { $push: { likes: [ip] } };
      const options = {new: true};
      const newData = await Stock.findOneAndUpdate(myQuery,newValues,options);
      
      return newData.likes.length;
      
    } else return data.likes.length;
  }
  else{
    const newStock = new Stock({
      stock:symbol,
    });

    const data = await newStock.save();
    console.log('save!',data);

  }
  //   ,(err, data)=>{
  //   if(err) console.log(err);
  //   else {
  //     if(data.length>0){
  //       likeCount = !data.likes ? 0 : data.likes.length();
  //     }
  //     else{
  //       const newStock = new Stock({
  //         stock: symbol,
  //       });
    
  //       newStock.save((err,stock)=>{
  //         if(err) console.log(err);
  //         console.log(stock);
  //         likeCount = 0;
  //       });
    
  //     }
  //   }
  // }

  console.log(likeCount);
  return likeCount;
}

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function ({ip, query}, res){
      
      //if returns single item convert it to array state
      const stocks = Array.isArray(query.stock) ? query.stock : [query.stock];
      const isLiked = query.like;

      (async () => { 
      const data = await Promise.all(
        stocks.map(
          async symbol => {
            const price = await getPrice(symbol);
            const likes = await getLikes(symbol, ip, isLiked);
            
            let stockData = price;
            if(stockData.price)
              stockData.likes = likes;
            else
              stockData = likes;
            
            console.log(stockData);
            return stockData;
      }))
    //   .then(val=>{
    //     //if single remove to array state
    //     val.length > 1 ? val : val=val[0];
    //     res.setHeader('Content-Type', 'application/json');
    //     res.send(JSON.stringify({stockData:val}));
    //   })
    //   .catch(err=>{
    //     console.log(err);
    //   });
    //console.log(data);
      }) ();
    });
  
    
};

