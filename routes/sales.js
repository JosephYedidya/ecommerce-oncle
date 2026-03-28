const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Product = require('../models/Product');

// POST: enregistrer une vente avec variante
router.post('/', async (req, res) => {
  try {
    const { productId, variantType, quantity, soldBy } = req.body;
    
    if (!productId || !variantType || !quantity || !soldBy) {
      return res.status(400).json({ error: 'Données manquantes' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    const variant = product.variants.find(v => v.type === variantType);
    if (!variant) {
      return res.status(404).json({ error: 'Type non trouvé' });
    }

    if (variant.quantity < quantity) {
      return res.status(400).json({ error: 'Stock insuffisant' });
    }

    const sale = new Sale({ productId, variantType, quantity, soldBy });
    await sale.save();

    variant.quantity -= quantity;
    await product.save();

    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: lister toutes les ventes
router.get('/', async (req, res) => {
  try {
    const sales = await Sale.find().populate('productId');
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;