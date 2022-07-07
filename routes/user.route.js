const router = require("express").Router();

const authentication = require("../middleware/authentication.mid");
const User = require("../models/User.model");
const Wishlist = require("../models/Wishlist.model");
const Cart = require("../models/Cart.model");

//get the authenticated user 's informations
router.get("/", authentication, async (req, res, next) => {
  try {
    const userFound = await User.findOne({ _id: req.user._id });
    res.status(200).json(userFound);
  } catch (e) {
    next(e);
  }
});

router.put("/", authentication, async (req, res, next) => {
  const availableKeys = [
    "email",
    "password",
    "firstName",
    "lastName",
    "address",
    "isMailValidated",
  ];
  const wrongFields = Object.keys(req.body).filter(
    (key) => !availableKeys.includes(key)
  );
  if (wrongFields.length > 0) {
    res.status(400).json({
      message: "wrong field(s) !",
      wrongfields: wrongFields,
    });
    return;
  }
  try {
    const ans = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    });
    res.status(200).json(ans);
  } catch (e) {
    next(e);
  }
});

//delete wishlist and cartS at the same time
router.delete("/", authentication, async (req, res, next) => {
  try {
    //delete all Carts
    const foundCarts = await Cart.find({ userId: req.user._id });
    if (foundCarts.length > 0) {
      await Promise.all(
        foundCarts.map(async (cart) => {
          await Cart.findByIdAndDelete(cart._id);
        })
      );
    }
    //delete the wishList
    const deletedWishList = await Wishlist.findOneAndDelete({
      userId: req.user._id,
    });

    //delete the user
    await User.findByIdAndDelete(req.user._id);
    res.status(200).json({ message: "user, wishList and carts are deleted" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
