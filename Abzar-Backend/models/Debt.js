// create a model for a debt that has a name, amount, and date
// it will be used to create a new debt
// when a new debt is created, it will be added to the database
// each product's stock will get deducted from the stock of the product
//
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const DebtSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    items: [
        {
            item: {
                type: Schema.Types.ObjectId,
                ref: 'item'
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    total: {
        type: Number,
        required: true
    },
    paid: {
        type: Boolean,
        default: false
    },
    lastPay: {
        type: Date
    },
    paidTotal: {
        type: Number
    },
    remaining: {
        type: Number
    }
})
module.exports = Debt = mongoose.model('debt', DebtSchema)

