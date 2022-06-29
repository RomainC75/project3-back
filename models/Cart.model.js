const { Schema, SchemaTypes, model } = require("mongoose");

const cartSchema = new Schema({
  userId: {
    type: SchemaTypes.ObjectId,
    ref: "User",
  },
  products: [
    {
      id: { type: SchemaTypes.ObjectId, refPath: "targetedProduct" }, // ! for the ref : "Products" we need to coordinate our models to be sure it's the same name for your Products model and the ref i put
      quantity: Number,
      targetedProduct: {
        type: String,
        required: true,
        enum: ["String", "Guitar", "Accessory", "Woodwind"],
      },
    },
  ],
  status: {
    type: SchemaTypes.String,
    enum: ["Pending", "Payed", "Shipped", "Received"],
  },
});

const Cart = model("Cart", cartSchema);

module.exports = Cart;
