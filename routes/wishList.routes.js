const router = require("express").Router();
const { json } = require("express");
const authentication = require("../middleware/authentication.mid");

const Product = require("../models/Product.model");
const Wishlist = require("../models/Wishlist.model");

router.get("/", authentication, async (req, res, next) => {
  try {
    const foundWishList = await Wishlist.find({
      userId: req.user._id,
    }).populate("products.product");
    res.status(200).json(foundWishList);
  } catch (e) {
    next(e);
  }
});

//just for postman
router.post("/", authentication, async (req, res, next) => {
  try {
    const foundWishList = await Wishlist.find({ userId: req.user._id });
    if (foundWishList.length > 0) {
      res.status(400).json({
        message: "already got a wish list !",
      });
      return;
    }
    const ans = await Wishlist.create({
      userId: req.user._id,
      products: req.body,
    });
    res.status(201).json(ans);
  } catch (e) {
    next(e);
  }
});

router.patch("/", authentication, async (req, res, next) => {
  try {
    const foundWishList = await Wishlist.find({ userId: req.user._id });
    if (foundWishList.length === 1) {
      const ans = await Wishlist.findOneAndUpdate(
        { userId: req.user._id },
        { products: req.body },
        { new: true }
      );
      res.status(200).json(ans);
    } else {
      res.status(400).json({ message: "no wishList found !" });
    }
  } catch (e) {
    next(e);
  }
});

//just for postman
router.delete("/", authentication, async (req, res, next) => {
  try {
    const foundWishList = await Wishlist.find({ userId: req.user._id });
    if (foundWishList.length > 0) {
      await Wishlist.findOneAndDelete({
        userId: req.user._id,
      });
      res.status(200).json({
        message: "deleted !",
      });
      return;
    } else {
      res.status(400).json({ message: "no wishList found !" });
      return;
    }
  } catch (e) {
    next(e);
  }
});

module.exports = router;
