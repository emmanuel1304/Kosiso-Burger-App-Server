const mongoose = require('mongoose');


const orderSchema = mongoose.Schema({ 
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    items: [{ 
        name: {type: String, required: true},
        size: {type: Number},
        price: {type: Number, required: true},
        quantity: {type: String, required: true},
        totalAmount: {type: String, required: true},
        specialRequest: {type: String},
    }],

    totalOrderPrice: { 
        type: Number,
        required: true,
    },

    deliveryAddress: { 
        longitude: {type: String, required: true},
        latitude: {type: String, required: true},
    },

    contactInfo: { 
        email: {type: String, required: true},
        phone: {type: String, required: true}
    },

    orderStatus: {type: String, enum: ['Pending', 'Confirmed', 'Out for Delivery', 'Delivered'], default: 'Pending'},

    paymentStatus: {type: String, enum:['Pending', 'Completed'], default: 'Pending'},

    orderDate: {type: Date, default: Date.now},

    additionalNotes: {type: String},

    opened: {type: Boolean, default: false},
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;