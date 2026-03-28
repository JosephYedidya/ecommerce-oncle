require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(require('cors')());

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('✅ MongoDB connecté'))
  .catch(err => console.log('❌ Erreur MongoDB:', err));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Backend fonctionne!' });
});

app.use('/api/products', require('./routes/products'));
app.use('/api/sales', require('./routes/sales'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur sur port ${PORT}`);
});