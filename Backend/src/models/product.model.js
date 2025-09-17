const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    // Establishes a relationship between the product and the user (shopkeeper)
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // This tells Mongoose the ObjectId refers to a document in the 'User' collection
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    },
    // ✨ ADDED: Field to store the image URL
    imageUrl: {
        type: String,
        trim: true,
        default: ''
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Product', productSchema);