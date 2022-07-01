const { Schema, SchemaTypes, model } = require("mongoose");

const cartSchema = new Schema({
  userId: {
    type: SchemaTypes.ObjectId,
    ref: "User",
  },
  products: [
    {
      // --> pointer vers Product ?
      productId: { 
        type: SchemaTypes.ObjectId, 
        ref: "Product"
     }, // ! for the ref : "Products" we need to coordinate our models to be sure it's the same name for your Products model and the ref i put
      quantity: Number
    },
  ],
  status: {
    type: SchemaTypes.String,
    enum: ["Pending", "Payed", "Shipped", "Received"],
    default: "Pending"
  },
});

const Cart = model("Cart", cartSchema);

module.exports = Cart;
