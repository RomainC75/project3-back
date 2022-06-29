const { Schema, model, SchemaTypes } = require('mongoose')
const Product = require('./Product.model')

const Accessory = Product.discriminator('AccessorySchema',
    new Schema({
        type:{type: String ,enum:['mouthpiece','strings','mediator','drum']},
        color:String
    }))

module.exports = Accessory