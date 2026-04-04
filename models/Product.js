const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  type: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  variants: [variantSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);