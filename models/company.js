const mongoose = require('mongoose');

const companySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    address: {
        city: {
            type: String
        }, 
        state: {
            type: String
        }
    },
    securityCode: {
        type: String
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Company', companySchema);