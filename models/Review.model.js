const { Schema, SchemaTypes, model } = require("mongoose");

const reviewSchema = new Schema({
  userId: {
    type: SchemaTypes.ObjectId,
    ref: "User",
  },
  productId: {
    type: SchemaTypes.ObjectId,
    ref: "Products",
  }, // ! for the ref : "Products" we need to coordinate our models to be sure it's the same name for your Products model and the ref i put
  rate: Number,
  comment: String,
});

const Review = model("Review", reviewSchema);

module.exports = Review;
