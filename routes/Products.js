const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET: lister tous les produits
router.get('/', async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// POST: ajouter un produit
router.post('/', async (req, res) => {
  try {
    const { name, price, quantity } = req.body;
    
    // Validation basique
    if (!name || !price || quantity === undefined) {
      return res.status(400).json({ error: 'Données manquantes' });
    }

    const product = new Product({ name, price, quantity });
    await product.save();
    
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;