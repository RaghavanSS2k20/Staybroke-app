const mongoose = require('mongoose');
const {NEXT_PUBLIC_API_URI} = process.env;
const subscriptionSchema = new mongoose.Schema({
  endpoint: { 
    type: String, required: true,
    default: `${NEXT_PUBLIC_API_URI}/expense`
},
  keys: {
    p256dh: String,
    auth: String,
  },
  expirationTime: Number,
}, { timestamps: true });

const Subscription = mongoose.models?.Subscription || mongoose.model('Subscription', subscriptionSchema);
export default Subscription;