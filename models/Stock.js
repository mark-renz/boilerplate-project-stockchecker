const { model, Schema } = require('mongoose');

const stockSchema = new Schema({
  stock: String,
  likes: [
    {
      address: String,
      createdAt: String
    }
  ]
});

module.exports = model('Stock', stockSchema);