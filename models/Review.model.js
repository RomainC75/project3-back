const { Schema, SchemaTypes, model } = require("mongoose");

const reviewSchema = new Schema({
  userId: {
    type: SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  productId: {
    type: SchemaTypes.ObjectId,
    ref: "Products",
    required: true,
  }, // ! for the ref : "Products" we need to coordinate our models to be sure it's the same name for your Products model and the ref i put
  rate: { type: Number, required: true },
  comment: { type: String, required: true },
},{
  timestamps:true
});

const Review = model("Review", reviewSchema);

module.exports = Review;
