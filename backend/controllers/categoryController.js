const Category = require('../models/Category');
const mongoose = require('mongoose');

exports.createCategory = async (req, res) => {
    try {
      const category = new Category(req.body);
      await category.save();
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  exports.getCategories = async (req, res) => {
    try {
      const categories = await Category.find().populate('parent');
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  exports.updateCategory = async (req, res) => {
    try {
      const category = await Category.findByIdAndUpdate(
        req.params.id, 
        req.body,
        { new: true }
      );
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  exports.deleteCategory = async (req, res) => {
    try {
      await Category.findByIdAndDelete(req.params.id);
      res.json({ message: 'Catégorie supprimée' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };