const mongoose = require('mongoose');

const priceSchema = mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    prices: [
        {
            date: {
                type: Date
            },
            eps: {
                type: Number
            },
            time: {
                type: String
            }
        }
    ]
}, {
    timestamps: true
})

module.exports = mongoose.model('Price', priceSchema);