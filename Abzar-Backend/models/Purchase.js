
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const PurchaseSchema = new Schema({
    purchaseTitle: {
        type: String,
    },
    supplier: {
        type: String,
        required: true
    },
    items: [
        {
            item: {
                type: Schema.Types.ObjectId,
                ref: 'item'
            },
            name: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            qty: {
                type: Number,
                required: true
            }
        }
    ],
    total: {
        type: Number,
        required: true
    },
    totalPaid: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    revoked: {
        type: Boolean,
        default: false
    }
})
// use a pre-save hook to update the stock of the product
// when a new purchase is created, it will be added to the database
// each product's stock will get added to the stock of the product if the product is already in the database
// if the product is not in the database, it will be added to the database
//
PurchaseSchema.pre('save', function(next) {
    // if the name of the purchase is empty, make it "Purchase" + the date and time
    const d = new Date();
    if(this.purchaseTitle === "" || this.purchaseTitle === undefined){
        this.purchaseTitle = "#Purchase " + d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() + (d.getHours() >= 12 ? "pm" : "am")
    }
    // const Product = require("./Product")
    // const purchase = this;
    // if(purchase.isNew){
    //     return purchase.items.forEach(item => {
    //         Product
    //             .findOneAndUpdate({_id: item.item._id}, {$inc: {stock: item.quantity}})
    //             .then(() => next())
    //             .catch(err => console.log(err))
    //     })
    // }
    next()
});

module.exports = Purchase = mongoose.model('purchase', PurchaseSchema)

// a sample of the data 
// {
//     "purchaseTitle": "Purchase 1",
//     "supplier": "Supplier 1",
//     "date": "2020-05-01T00:00:00.000Z",
//     "items": [
//         {
//             "item": "5e9f1b0b8b1b0c2b3c8b8b8b",
//             "name": "Product 1",
//             "quantity": 10
//         },
//         {
//             "item": "5e9f1b0b8b1b0c2b3c8b8b8c",
//             "name": "Product 2",
//             "quantity": 20
//         }
//     ],
//     "total": 1000,
//     "paidTotal": 500
// }
