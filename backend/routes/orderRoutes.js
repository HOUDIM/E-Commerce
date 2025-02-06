const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

// Route pour créer une commande
router.post('/', authMiddleware, orderController.createOrder);

// Route pour récupérer les commandes de l'utilisateur
router.get('/', authMiddleware, orderController.getUserOrders);

// Route pour récupérer une commande par ID
router.get('/:id', authMiddleware, orderController.getOrderById);

// Route pour mettre à jour le statut d'une commande (Admin only)
router.put('/:id/status', authMiddleware, orderController.updateOrderStatus);

// Route pour annuler une commande
router.put('/:id/cancel', authMiddleware, orderController.cancelOrder);

module.exports = router;