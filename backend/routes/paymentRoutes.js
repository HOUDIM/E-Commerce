const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const PaymentRetryService = require('../services/paymentRetryService');
const authMiddleware = require('../middleware/authMiddleware');
const handlePaymentError = require('../middleware/paymentErrorMiddleware');


// Route pour créer un intent de paiement
router.post('/create-payment-intent', authMiddleware, paymentController.createPaymentIntent);

// Route de webhook Stripe
router.post('/webhook', express.raw({type: 'application/json'}), paymentController.webhookHandler);

router.post('/retry-payment', authMiddleware, async (req, res, next) => {
    try {
      const { orderId } = req.body;
      const result = await PaymentRetryService.retryFailedPayment(orderId);
      
      if (result.success) {
        return res.json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      handlePaymentError(error, req, res, next);
    }
  });

module.exports = router;