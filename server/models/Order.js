const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: Number,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'User',
  },
  orderItems: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
      },
    }
  ],
  shippingAddress: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    shippingArea: { type: String, required: true, default: 'Inside Dhaka' },
    country: { type: String, required: true },
    phone: { type: String, required: true },
  },
  paymentMethod: {
    type: String,
    required: true,
    default: 'Cash on Delivery', // Commonly used in regions like BD (shajgoj context)
  },
  paymentResult: {
    id: { type: String },
    status: { type: String },
    update_time: { type: String },
    email_address: { type: String },
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  discounts: [
    {
      offerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer', required: false },
      title: { type: String, required: true },
      discountAmount: { type: Number, required: true }
    }
  ],
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false,
  },
  paidAt: {
    type: Date,
  },
  isDelivered: {
    type: Boolean,
    required: true,
    default: false,
  },
  deliveredAt: {
    type: Date,
  },
  isCancelled: {
    type: Boolean,
    required: true,
    default: false,
  },
  cancelledAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

orderSchema.pre('save', async function () {
  if (this.isNew) {
    const lastOrder = await this.constructor.findOne({}, { orderId: 1 }).sort({ orderId: -1 });
    if (lastOrder && lastOrder.orderId) {
      this.orderId = lastOrder.orderId + 1;
    } else {
      this.orderId = 1001;
    }
  }
});

module.exports = mongoose.model('Order', orderSchema);