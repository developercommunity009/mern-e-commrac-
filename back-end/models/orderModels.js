const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    shippingInfo: {
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        pincode: {
            type: Number,
            required: true
        },
    },
  
    paymentInfo: {
        cartNo: {
            type: String,
            required: true
        },
        cartId: {
            type: String,
            required: true
        },
    },

    oderItem: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                require: true
            },
            color: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Color",
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
        }
    ],

    paidAt: {
        type: Date,
        default: Date.now()
    },

    month: {
        type:String,
        default:new Date().getMonth()
    },

    totalPrice: {
        type: Number,
        required: true
    },

    totalPriceAfterDiscount: {
        type: Number,
        required: true
    },

    orderStatus: {
        type: String,
        default: "Ordered"
    }

}, { timestamps: true });

//Export the model
module.exports = mongoose.model('Order', orderSchema);