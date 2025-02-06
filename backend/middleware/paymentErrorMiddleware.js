const PaymentError = require('../models/PaymentError');

const handlePaymentError = async (error, req, res, next) => {
  // Enregistrer l'erreur de paiement
  const paymentError = new PaymentError({
    user: req.user ? req.user.id : null,
    orderId: req.body.orderId || null,
    errorType: error.type || 'Unknown',
    errorMessage: error.message,
    errorDetails: error
  });

  await paymentError.save();

  // Réponses spécifiques selon le type d'erreur
  switch (error.type) {
    case 'card_error':
      return res.status(402).json({
        message: 'Erreur de paiement',
        code: error.code,
        detail: error.message
      });
    
    case 'invalid_request_error':
      return res.status(400).json({
        message: 'Requête de paiement invalide',
        detail: error.message
      });
    
    case 'authentication_error':
      return res.status(401).json({
        message: 'Erreur d\'authentification',
        detail: 'Problème de sécurité lors du paiement'
      });
    
    default:
      return res.status(500).json({
        message: 'Erreur de paiement interne',
        detail: 'Un problème est survenu lors du traitement du paiement'
      });
  }
};

module.exports = handlePaymentError;