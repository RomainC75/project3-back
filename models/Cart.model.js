const { Schema, SchemaTypes, model } = require("mongoose");

const cartSchema = new Schema({
  userId: {
    type: SchemaTypes.ObjectId,
    ref: "User",
  },
  products: [
    {
      id: { type: SchemaTypes.ObjectId, ref: "Products" }, // ! for the ref : "Products" we need to coordinate our models to be sure it's the same name for your Products model and the ref i put
      amount: Number,
    },
  ],
  status: {
    type: SchemaTypes.String,
    enum: ["Pending", "Payed", "Shipped"],
  },
});

const Cart = model("Cart", cartSchema);

module.exports = Cart;