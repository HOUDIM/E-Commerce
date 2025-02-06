const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

// Route pour créer un produit (Admin only)
router.post('/', authMiddleware, productController.createProduct);

// Route pour récupérer tous les produits (Public)
router.get('/', productController.getAllProducts);

// Route pour récupérer un produit par ID (Public)
router.get('/:id', productController.getProductById);

// Route pour mettre à jour un produit (Admin only)
router.put('/:id', authMiddleware, productController.updateProduct);

// Route pour supprimer un produit (Admin only)
router.delete('/:id', authMiddleware, productController.deleteProduct);

module.exports = router;