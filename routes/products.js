const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// GET tous les produits
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ category: 1, name: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET catégories uniques
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    const filteredCategories = categories.filter(c => c && c.trim() !== '');
    res.json(filteredCategories.sort());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST créer produit
router.post('/', async (req, res) => {
  try {
    const { name, category, price, variants } = req.body;
    
    if (!name || !category || !price) {
      return res.status(400).json({ error: 'Champs requis: name, category, price' });
    }

    const product = new Product({
      name,
      category: category.trim(),
      price,
      variants: variants || [{ type: 'Standard', quantity: 1 }]
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT mettre à jour produit
router.put('/:id', async (req, res) => {
  try {
    const { name, category, price, variants } = req.body;
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { 
        name, 
        category: category ? category.trim() : 'Autre', 
        price, 
        variants 
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE produit
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    res.json({ message: 'Produit supprimé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;