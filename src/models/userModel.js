const mongoose = require('mongoose');

const userSchema = mongoose.Schema({ 
    firstName: { 
        type: String,
        required: true
    },

    lastName: { 
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: { 
        type: String,
        required: true
    },

    phone: { 
        type: String,
        required: true
    },

    role: { 
        type: String,
        enum: ['Admin', 'User'],
        default: 'User'
    }

});

const User = mongoose.model('User', userSchema);

module.exports = User;