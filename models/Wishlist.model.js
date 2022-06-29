const { Schema, SchemaTypes, model } = require("mongoose");

const wishlistSchema = new Schema({
  userId: {
    type: SchemaTypes.ObjectId,
    ref: "User",
  },
  products: [
    { type: SchemaTypes.ObjectId, ref: "Products" }, // ! for the ref : "Products" we need to coordinate our models to be sure it's the same name for your Products model and the ref i put
  ],
});

const Wishlist = model("Wishlist", wishlistSchema);

module.exports = Wishlist;
