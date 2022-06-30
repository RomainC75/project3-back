const { Schema, model, SchemaTypes } = require("mongoose");
const Product = require("./Product.model");

const Guitar = Product.discriminator(
  "GuitarSchema",
  new Schema({
    type: { type: String, enum: ["Guitar", "Bass"] },
    neck: String,
    body: String,
    fretBoard: String,
    fretsNumber: Number,
    color: String,
  })
);

//const Guitar = new model("Guitar", guitarSchema);

module.exports = Guitar;