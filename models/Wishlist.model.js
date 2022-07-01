const { Schema, SchemaTypes, model } = require("mongoose");
const Product = require('./Product.model')

const wishlistSchema = new Schema({
  userId: {
    type: SchemaTypes.ObjectId,
    ref: "User",
    unique:true
  },
  products: [
    {
      product: { type: SchemaTypes.ObjectId, ref: Product }
    },
  ],
});

const Wishlist = model("Wishlist", wishlistSchema);

module.exports = Wishlist;
