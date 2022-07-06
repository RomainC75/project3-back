const router = require("express").Router();
const Cart = require("../models/Cart.model");
const Product = require('../models/Product.model')
const authentication = require("../middleware/authentication.mid");
const id24FormatCheck = require("../middleware/id24FormatCheck.mid");
const { json } = require("express");

router.get("/", authentication, async (req, res, next) => {
  try {
    console.log(req.user._id);
    const userCart = await Cart.find({ userId: req.user._id }).populate('products.productId');
    res.status(200).json(userCart);
  } catch (error) {
    next(error);
  }
});

router.get("/pending", authentication, async (req, res, next) => {
  console.log('mono')
  try {
    console.log(req.user._id);
    const userCart = await Cart.find({ userId: req.user._id });
    const result = userCart.find(cart=>cart.status==="Pending")
    res.status(202).json(result ? result : {message:'nothing'});
  } catch (error) {
    next(error);
  }
});

router.get("/:cartId", authentication, async (req, res, next) => {
  console.log(req.user);
  try {
    const { cartId } = req.params;
    if (cartId.length != 24) {
      res.status(400).json({ message: "wrong ID format" });
      return;
    }

    const userCart = await Cart.find({ _id: cartId, userId: req.user._id }).populate('products.productId');
    if (userCart.length === 0) {
      res.status(404).json({ message: "cart not found" });
      return;
    }
    res.status(200).json(userCart);
  } catch (error) {
    next(error);
  }
});

//
router.post("/", authentication, async (req, res, next) => {
  console.log('---->body', req.body)
  try {
    const userCart = await Cart.find({
      userId: req.user._id,
      status: "Pending",
    });

    if (userCart.length !== 0) {
      res.status(405).json({ reason: "User already have a cart" });
      return;
    }
    const createdCart = await Cart.create({
      userId: req.user._id,
      products: req.body,
    });
    res.status(201).json(createdCart);
  } catch (error) {
    next(error);
  }
});

//verify there's a cart
router.patch(
  "/:cartId",
  authentication,
  id24FormatCheck,
  async (req, res, next) => {
    try {
      const { cartId } = req.params;
      console.log("cartId : ", cartId);
      const foundCart = await Cart.findById(cartId);

      if (foundCart === null) {
        res.status(404).json({ message: "cart not found" });
        return;
      }

      if (foundCart.userId.toString() != req.user._id.toString()) {
        console.log("wrong user ID");

        res.status(404).json({ message: "you're not the owner of the cart !" });
        return;
      }

      const newProductContent = req.body;
      newProductContent.forEach((item, index, arr) => {
        if (item.quantity === 0) {
          arr.splice(index, 1);
        }
      });

      const newCart = await Cart.findOneAndUpdate(
        { userId: req.user._id },
        { products: newProductContent },
        { new: true }
      );
      res.status(200).json({
        message: "Successfully updated",
        result: newCart,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.put("/:cartId", authentication, async (req, res, next) => {
  try {
    const { cartId } = req.params;
    console.log("cartId : ", cartId);
    const foundCart = await Cart.findById(cartId);

    if (foundCart === null) {
      res.status(404).json({ message: "cart not found" });
      return;
    }
    if (foundCart.userId.toString() != req.user._id.toString()) {
      console.log("wrong user ID");
      res.status(404).json({ message: "you're not the owner of the cart !" });
      return;
    }
    if(foundCart.status==='Payed'){
      res.status(404).json({message:"already payed !"})
      return
    }
    const updatedCart = await Cart.findByIdAndUpdate(cartId, {
      status: "Payed",
    },{new:true});
    res.status(201).json(updatedCart)
  } catch (error) {
    next(error);
  }
});

router.delete("/:cartId", authentication, async (req, res, next) => {
  try {
    const { cartId } = req.params;

    console.log(cartId, req.user._id);
    const foundCart = await Cart.find({ _id: cartId, userId: req.user._id });
    if (foundCart.length === 0) {
      res.status(404).json({ message: "cart not found !" });
      return;
    }

    await Cart.findOneAndDelete({ userId: req.user._id });
    res.status(200).json({ message: "cart deleted !" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
