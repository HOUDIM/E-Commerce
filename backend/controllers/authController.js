const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Vérification si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Utilisateur déjà existant' });
    }

    // Créer un nouvel utilisateur
    const user = new User({ username, email, password });
    await user.save();

    // Générer un token JWT
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    res.status(201).json({ token, user: { id: user._id, username: user.username } });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'inscription' });
  }
};

exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Vérifier si l'utilisateur existe
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Identifiants invalides' });
      }
  
      // Vérifier le mot de passe
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Identifiants invalides' });
      }
  
      // Générer un token JWT
      const token = jwt.sign(
        { id: user._id, role: user.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1d' }
      );
  
      res.json({ 
        token, 
        user: { 
          id: user._id, 
          username: user.username, 
          email: user.email,
          role: user.role 
        } 
      });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la connexion' });
    }
  };
  
  exports.getUserProfile = async (req, res) => {
    try {
      // Récupérer l'utilisateur sans le mot de passe
      const user = await User.findById(req.user.id).select('-password');
      
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
  
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération du profil' });
    }
  };