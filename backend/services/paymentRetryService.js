const Order = require('../models/Order');
const stripe = require('../config/stripe');

class PaymentRetryService {
  static async retryFailedPayment(orderId) {
    const order = await Order.findById(orderId);
    
    if (!order) {
      throw new Error('Commande non trouvée');
    }

    // Vérifier les conditions de nouvelle tentative
    const MAX_RETRY_ATTEMPTS = 3;
    const retryAttempts = order.paymentRetryAttempts || 0;

    if (retryAttempts >= MAX_RETRY_ATTEMPTS) {
      order.status = 'Annulé';
      await order.save();
      return { success: false, message: 'Nombre max de tentatives atteint' };
    }

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(order.totalPrice * 100),
        currency: 'eur',
        metadata: { 
          orderId: order._id.toString(),
          retryAttempt: retryAttempts + 1
        }
      });

      order.paymentRetryAttempts = retryAttempts + 1;
      await order.save();

      return { 
        success: true, 
        clientSecret: paymentIntent.client_secret 
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PaymentRetryService;