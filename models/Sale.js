const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  soldBy: { type: String, required: true }, // email ou nom de la caissière
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sale', saleSchema);