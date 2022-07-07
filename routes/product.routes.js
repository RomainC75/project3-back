const router = require("express").Router();
const Product = require("../models/Product.model");
const Guitar = require("../models/Guitar.model");
const String = require("../models/String.model");
const Woodwind = require("../models/Woodwind.model");
const Review = require("../models/Review.model");
const id24FormatCheck = require('../middleware/id24FormatCheck.mid')
const authentication = require('../middleware/authentication.mid')

router.get("/", async (req, res, next) => {
  try {

    const ans = await Product.find(req.query);
    const ansPlusGlobalRate = await Promise.all(ans.map(async(product)=>{
      const reviews = await Review.find({productId:product._id})
      const globalRate = reviews.reduce((accu, current)=>{
        return accu+current.rate
      },0)
      const myproduct = product.toObject()
      return {
        ...myproduct,
        globalRate: reviews.length===0 ? 0 : globalRate/reviews.length,
        reviewsQty:reviews.length
      }
    }))
    
    res.status(200).json(ansPlusGlobalRate);
  } catch (e) {
    next(e);
  }
});


router.get("/:id", id24FormatCheck, async (req, res, next) => {
  const {id} = req.params
  try {
    const ans = await Product.findById(id);
    if (ans === null) {
      res.status(404).json({ message: "ID not found !" });
      return
    }
    res.status(200).json(ans)
  } catch (e) {
    next(e);
  }
});

router.post("/:family", authentication,async (req, res, next) => {
  try {
    const families = ["woodwind", "guitar", "string"];
    const { family } = req.params;
    let ans = null;
    if (!families.includes(family)) {
      res.status(400).json({ message: "bad family!" });
      return
    }
    switch (family) {
      case "woodwind":
        ans = await Woodwind.create(req.body);
        break;
      case "guitar":
        ans = await Guitar.create(req.body);
        break;
      case "string":
        ans = await String.create(req.body);
        break;
    }
    res.status(201).json(ans);
  } catch (e) {
    next(e);
  }
});

router.put("/:id", id24FormatCheck,authentication, async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Product.findById(id);
    if (item === null) {
      res.status(400).json({ message: "ID not found !" });
      return
    }
    const ans = await Product.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    res.status(200).json(ans);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", id24FormatCheck, authentication, async (req, res, next) => {
  try {
    const { id } = req.params;

    const item = await Product.findById(id);
    if (item === null) {
      res.status(400).json({ message: "ID not found !" });
      return
    }
    const ans = await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "object deleted !" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
