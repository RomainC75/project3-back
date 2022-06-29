const { Schema, model, SchemaTypes } = require("mongoose");
const Product = require("./Product.model");

const guitarSchema = Product.discriminator(
  "GuitarSchema",
  new Schema({
    type: { type: String, enum: ["guitar", "bass"] },
    scale: Number,
    body: String,
    fretBoardWood: String,
    fretsNumber: Number,
    color: String,
  })
);

const Guitar = new model("Guitar", guitarSchema);

module.exports = Guitar;
