const stripe = require('../config/stripe');
const Order = require('../models/Order');
const handlePaymentError = require('../middleware/paymentErrorMiddleware');

exports.createPaymentIntent = async (req, res, next) => {
    try {
      const { orderId, paymentMethodId } = req.body;
  
      // Récupérer la commande
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Commande non trouvée' });
      }
  
      // Vérifications supplémentaires
      if (order.isPaid) {
        return res.status(400).json({ message: 'Commande déjà payée' });
      }
  
      // Calcul du montant avec vérification
      const amount = Math.round(order.totalPrice * 100);
      if (amount <= 0) {
        throw new Error('Montant de paiement invalide');
      }
  
      // Création de l'intent de paiement avec méthode de paiement
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'eur',
        payment_method: paymentMethodId,
        confirm: true,
        metadata: { 
          orderId: order._id.toString(),
          userId: order.user.toString()
        }
      });
  
      // Gestion des différents statuts
      switch (paymentIntent.status) {
        case 'succeeded':
          order.isPaid = true;
          order.paidAt = Date.now();
          order.paymentResult = {
            id: paymentIntent.id,
            status: paymentIntent.status
          };
          await order.save();
          
          return res.json({
            success: true,
            message: 'Paiement réussi',
            paymentIntent
          });
  
        case 'requires_payment_method':
          return res.status(402).json({
            success: false,
            message: 'Méthode de paiement requise',
            requiresAction: true,
            clientSecret: paymentIntent.client_secret
          });
  
        default:
          throw new Error('Statut de paiement non géré');
      }
    } catch (error) {
      // Utilisation du middleware de gestion des erreurs
      return handlePaymentError(error, req, res, next);
    }
  };

exports.webhookHandler = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body, 
      sig, 
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await handleSuccessfulPayment(paymentIntent);
        break;
      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object;
        await handleFailedPayment(failedPaymentIntent);
        break;
    }

    res.json({ received: true });
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

async function handleSuccessfulPayment(paymentIntent) {
  const order = await Order.findById(paymentIntent.metadata.orderId);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: paymentIntent.id,
      status: paymentIntent.status,
      update_time: Date.now(),
      email_address: paymentIntent.charges.data[0].billing_details.email
    };
    await order.save();
  }
}

async function handleFailedPayment(paymentIntent) {
  const order = await Order.findById(paymentIntent.metadata.orderId);
  if (order) {
    order.status = 'Annulé';
    await order.save();
  }
}