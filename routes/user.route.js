const router = require("express").Router();

const authentication = require("../middleware/authentication.mid");
const User = require("../models/User.model");

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
  console.log(req.body);
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

router.delete("/", authentication, async (req, res, next) => {
  console.log(req.body);
  try {
    await User.findByIdAndDelete(req.user._id);
    res.status(200).json({ message: "deleted" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
