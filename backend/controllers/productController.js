const Product = require('../models/Product');
const mongoose = require('mongoose');

// Créer un nouveau produit (Admin only)
exports.createProduct = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      price, 
      category, 
      stock, 
      imageUrl, 
      brand 
    } = req.body;

    // Vérification que l'utilisateur est un admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      imageUrl,
      brand
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la création du produit',
      error: error.message 
    });
  }
};

// Récupérer tous les produits
exports.getAllProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      minPrice, 
      maxPrice, 
      search 
    } = req.query;

    // Construction du filtre
    let filter = {};
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Recherche par mot-clé
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des produits',
      error: error.message 
    });
  }
};

// Récupérer un produit par ID
exports.getProductById = async (req, res) => {
  try {
    // Vérifier si l'ID est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de produit invalide' });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la récupération du produit',
      error: error.message 
    });
  }
};

// Mettre à jour un produit (Admin only)
exports.updateProduct = async (req, res) => {
  try {
    // Vérification que l'utilisateur est un admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    // Vérifier si l'ID est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de produit invalide' });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour du produit',
      error: error.message 
    });
  }
};

// Supprimer un produit (Admin only)
exports.deleteProduct = async (req, res) => {
  try {
    // Vérification que l'utilisateur est un admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    // Vérifier si l'ID est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de produit invalide' });
    }

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    res.json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la suppression du produit',
      error: error.message 
    });
  }
};