const { Schema, model, SchemaTypes } = require('mongoose')

const productSchema = new Schema({
    price: Number,
    stockQuantity: Number,
    brand: {type: String, required:true},
    details: { type: SchemaTypes.ObjectId, required: true},
    options: String,
},{
    timestamps:true
})

const Product = new model('Product', productSchema)

module.exports = Product