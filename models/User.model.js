const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: { type: Schematypes.String, required: true },
    firstName: String,
    lastName: String,
    address: {
      addressNumber: Number,
      street: String,
      zipcode: Number,
      city: String,
      country: String,
    },
    isMailValidated: {
      type: boolean,
      default: false,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
