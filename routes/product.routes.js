const router = require("express").Router();
const Product = require("../models/Product.model");

const Guitar = require("../models/Guitar.model");
const String = require("../models/String.model");
const Woodwind = require("../models/Woodwind.model");

router.get("/", async (req, res, next) => {
  try {
    console.log(req.query);
    const ans = await Product.find(req.query);
    res.status(200).json(ans);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("id", id);
    if (id.length != 24) {
      res.status(400).json({
        message: "bad ID length",
      });
      return;
    }
    const ans = await Product.findById(id);
    if (ans === null) {
      res.status(400).json({ message: "ID not found !" });
      return
    }
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

router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id.length !== 24) {
      res.status(400).json({ message: "bad id length" });
      return
    }
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

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id.length !== 24) {
      res.status(400).json({ message: "bad id length" });
      return
    }
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
