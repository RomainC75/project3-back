const router = require("express").Router();
const Cart = require("../models/Cart.model")

router.get("/", (req, res, next) => {
    Cart.findById(req.params._id)
  res.json("All good in here");
});

// You put the next routes here 👇
// example: router.use("/auth", authRoutes)

module.exports = router;
