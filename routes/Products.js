const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// POST: ajouter un produit avec variantes
router.post('/', async (req, res) => {
  try {
    const { name, price, variants } = req.body;
    
    if (!name || !price || !variants || variants.length === 0) {
      return res.status(400).json({ error: 'Données manquantes' });
    }

    const product = new Product({ 
      name, 
      price, 
      variants 
    });
    await product.save();
    
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: lister tous les produits
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;