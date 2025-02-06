const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true }
    }
  ],
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  paymentMethod: {
    type: String,
    enum: ['Carte de crédit', 'PayPal', 'Virement bancaire'],
    required: true
  },
  paymentResult: {
    id: { type: String },
    status: { type: String },
    update_time: { type: String },
    email_address: { type: String }
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false
  },
  paidAt: {
    type: Date
  },
  isDelivered: {
    type: Boolean,
    required: true,
    default: false
  },
  deliveredAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['En attente', 'Traitement', 'Expédié', 'Livré', 'Annulé'],
    default: 'En attente'
  }
}, { 
  timestamps: true 
});

// Méthode statique pour calculer le total de la commande
orderSchema.statics.calculateTotalPrice = function(orderItems) {
  return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Méthode virtuelle pour vérifier le statut de la commande
orderSchema.virtual('orderStatus').get(function() {
  if (this.isDelivered) return 'Livrée';
  if (this.isPaid) return 'Payée';
  return this.status;
});

module.exports = mongoose.model('Order', orderSchema);