const { Schema, model, SchemaTypes } = require('mongoose')

const productSchema = new Schema({
    price: Number,
    pictures:[{type:String}],
    name: {type: String, required:true, unique:true},
    stockQuantity: {type: Number, required:true},
    brand: {type: String, required:true},
    options: String,
},{
    timestamps:true
})

const Product = new model('Product', productSchema)

module.exports = Product