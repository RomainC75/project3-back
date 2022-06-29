const { Schema, model, SchemaTypes } = require('mongoose')
const Product = require('./Product.model')

const String = Product.discriminator('StringSchema',
    new Schema({
        type:{type: String ,enum:['violin','viola','cello','doubleBass']},
        //4/4
        size:Number,
        //solid maple body
        body:String,
        //683mm
        scaleLength: Number,
        isIncludingBag: Boolean
    }))

module.exports = String