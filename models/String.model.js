const { Schema, model, SchemaTypes } = require("mongoose");
const Product = require("./Product.model");

const StringInstru = Product.discriminator(
  "StringInstruSchema",
  new Schema({
    type: { type: String, enum: ["violin", "viola", "cello", "doubleBass"] },
    //4/4
    size: String,
    //solid maple body
    Fretboard: String,
    //683mm
    NoTropicalWoodUsed: Boolean,
    bowIncluded: Boolean,
    strings: String,
    caseIncluded: Boolean,
  })
);

module.exports = StringInstru;
