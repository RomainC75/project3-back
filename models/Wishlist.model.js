const { Schema, SchemaTypes, model } = require("mongoose");

const wishlistSchema = new Schema({
  userId: {
    type: SchemaTypes.ObjectId,
    ref: "User",
    unique:true
  },
  products: [
    {
      productId: { type: SchemaTypes.ObjectId, refPath: "targetedProduct" },
      targetedProduct: {
        type: String,
        required: true,
        enum: ["String", "Guitar", "Accessory", "Woodwind"],
      },
    },
  ],
});

const Wishlist = model("Wishlist", wishlistSchema);

module.exports = Wishlist;
