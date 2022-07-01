const router = require("express").Router();
const Cart = require("../models/Cart.model");
const authentication = require("../middleware/authentication.mid");

router.get("/", authentication, async (req, res, next) => {
  try {
    console.log(req.user._id);
    const userCart = await Cart.find({userId : req.user._id});
    res.json(userCart);
  } catch (error) {
    next(error);
  }
});

//
router.post("/", authentication, async (req, res, next) => {
  try {
    const userCart = await Cart.find({userId : req.user._id, status : "Pending"});
    if (userCart.length !== 0) {
        res.status(405).json({reason : 'User already have a cart'});
    } else {
        const createdCart = await Cart.create({
            userId: req.user._id,
            products: req.body,
        });
        res.status(201).json({ message: `${createdCart} created ;)` });
    }
  } catch (error) {
    next(error);
  }
});

//verirfy there's a cart

router.patch("/", authentication, async (req, res, next) => {
  try {
    const newContent = req.body;
    newContent.forEach((item, index, arr) => {
         if(item.quantity === 0) {
            arr.splice(index, 1);  
    }})
    
      const newCart = await Cart.findOneAndUpdate({ userId: req.user._id }, {products: newContent});
       res.status(200).json({
           message : "Successfully updated",
           result : newCart
       })
    } catch (error) {
    next(error);
  }
});

// You put the next routes here 👇
// example: router.use("/auth", authRoutes)

module.exports = router;
