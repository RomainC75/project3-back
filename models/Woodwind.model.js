const { Schema, model, SchemaTypes } = require('mongoose')
const Product = require('./Product.model')

const Woodwind = Product.discriminator('WoodwindSchema',
    new Schema({
        type:{type: String ,enum:['saxophon', 'clarinet', 'bassoon', 'oboe']},
        //Bb,Eb
        tonality:String,
        highFSharpKey:Boolean,
        //683mm
        isIncludingBag: Boolean
    }))

module.exports = Woodwind