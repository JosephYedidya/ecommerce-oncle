const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Product = require('../models/Product');

// GET: lister toutes les ventes
router.get('/', async (req, res) => {
  try {
    const sales = await Sale.find().populate('productId');
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: enregistrer une vente
router.post('/', async (req, res) => {
  try {
    const { productId, quantity, soldBy } = req.body;
    
    // Validation
    if (!productId || !quantity || !soldBy) {
      return res.status(400).json({ error: 'Données manquantes' });
    }

    // Vérifier que le produit existe
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    // Vérifier qu'il y a assez de stock
    if (product.quantity < quantity) {
      return res.status(400).json({ error: 'Stock insuffisant' });
    }

    // Créer la vente
    const sale = new Sale({ productId, quantity, soldBy });
    await sale.save();

    // Diminuer le stock du produit
    product.quantity -= quantity;
    await product.save();

    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;