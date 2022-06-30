const router = require("express").Router();
const Product = require("../models/Product.model");

const Guitar = require("../models/Guitar.model");
const String = require("../models/String.model");
const Woodwind = require("../models/Woodwind.model");

router.get("/", async (req, res, next) => {
  try {
    const ans = await Product.find();
    res.status(200).json({ length: ans.length });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("id", id);
    const ans = await Product.findById(id);
    res.status(200).json(ans);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.post("/:family", async (req, res, next) => {
  try {
    const families = ["woodwind", "guitar", "string"];
    const { family } = req.params;
    let ans = null;
    if (!families.includes(family)) {
      res.status(400).json({ message: "bad family!" });
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
    res.status(200).json(ans);
  } catch (e) {
    next(e);
  }
});

router.put("/:id", async (req, res, next) => {
    try{
        const {id} = req.params
        console.log()
    }catch(e){

    }
});

module.exports = router;
