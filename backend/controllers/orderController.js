const Order = require('../models/Order');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Créer une nouvelle commande
exports.createOrder = async (req, res) => {
  try {
    const { 
      orderItems, 
      shippingAddress, 
      paymentMethod 
    } = req.body;

    // Vérifier si les produits existent et ont un stock suffisant
    const itemsWithProductInfo = await Promise.all(
      orderItems.map(async (item) => {
        const product = await Product.findById(item.product);
        
        if (!product) {
          throw new Error(`Produit avec l'ID ${item.product} non trouvé`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Stock insuffisant pour le produit ${product.name}`);
        }

        return {
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity
        };
      })
    );

    // Calculer le prix total
    const totalPrice = Order.calculateTotalPrice(itemsWithProductInfo);

    // Créer la commande
    const order = new Order({
      user: req.user.id,
      orderItems: itemsWithProductInfo,
      shippingAddress,
      paymentMethod,
      totalPrice
    });

    // Sauvegarder la commande
    const savedOrder = await order.save();

    // Mettre à jour le stock des produits
    await Promise.all(
      itemsWithProductInfo.map(async (item) => {
        await Product.findByIdAndUpdate(
          item.product, 
          { $inc: { stock: -item.quantity } },
          { new: true }
        );
      })
    );

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la création de la commande',
      error: error.message 
    });
  }
};

// Récupérer toutes les commandes de l'utilisateur
exports.getUserOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('orderItems.product', 'name price');

    const total = await Order.countDocuments({ user: req.user.id });

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des commandes',
      error: error.message 
    });
  }
};

// Récupérer une commande par ID
exports.getOrderById = async (req, res) => {
  try {
    // Vérifier si l'ID est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de commande invalide' });
    }

    const order = await Order.findById(req.params.id)
      .populate('user', 'username email')
      .populate('orderItems.product', 'name price');

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Vérifier l'accès de l'utilisateur (admin ou propriétaire de la commande)
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la récupération de la commande',
      error: error.message 
    });
  }
};

// Mettre à jour le statut de la commande (Admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    // Vérification que l'utilisateur est un admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const { status, isDelivered, isPaid } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id, 
      { 
        status, 
        isDelivered, 
        isPaid,
        ...(isDelivered && { deliveredAt: Date.now() }),
        ...(isPaid && { paidAt: Date.now() })
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour de la commande',
      error: error.message 
    });
  }
};

// Annuler une commande
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Vérifier que la commande appartient à l'utilisateur ou qu'il est admin
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    // Vérifier si la commande peut être annulée
    if (order.status === 'Expédié' || order.status === 'Livré') {
      return res.status(400).json({ message: 'Commande ne peut pas être annulée' });
    }

    // Mettre à jour le statut de la commande
    order.status = 'Annulé';
    await order.save();

    // Restaurer le stock des produits
    await Promise.all(
      order.orderItems.map(async (item) => {
        await Product.findByIdAndUpdate(
          item.product, 
          { $inc: { stock: item.quantity } },
          { new: true }
        );
      })
    );

    res.json({ message: 'Commande annulée avec succès' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de l\'annulation de la commande',
      error: error.message 
    });
  }
};