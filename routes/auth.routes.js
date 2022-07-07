const router = require("express").Router();
const nodemailer = require("nodemailer");
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const possibleCredentials = require("../middleware/possibleCredentials.mid");
const authentication = require("../middleware/authentication.mid");
const Wishlist = require("../models/Wishlist.model");

require("dotenv").config();


let transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAILGMAIL,
    pass: process.env.EMAILGMAIL_PASS,
  },
});

router.get("/verify", authentication, async (req, res, next) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (e) {
    next(e);
  }
});

//create a Cart
router.post("/signup", possibleCredentials, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const recordedUser = await User.findOne({ email });

    if (recordedUser !== null) {
      res
        .status(400)
        .json({ message: "user already exists ! try another one!" });
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const emailValidationCode = Math.random() * 1000;
    const ans = await User.create({
      email,
      password: hash,
      emailValidationCode,
      address : {country :"", number : "", street : "", zipcode : "", city : "" }
    });
    const wishListAns = await Wishlist.create({
      userId: ans._id,
      products: [],
    });

    res.status(201).json(ans);

    const emailToken = jwt.sign(
      { email: email, emailValidationCode },
      process.env.TOKEN_SECRET,
      { expiresIn: "3d" }
    );
    //email
    transporter
      .sendMail({
        from: process.env.EMAILGMAIL,
        to: email,
        subject: "email verification",
        text: "email verification",
        html: `<b>Awesome Message</b> <a href="${process.env.BACKENDADDRESS}/emailconfirmation/${emailToken}">Click on the link below :</a>`,
      })
      .then((info) => console.log("-->email sent :-) !!", info))
      .catch((error) => console.log("-->nodemailer error : ", error));
  } catch (e) {
    next(e);
  }
});

router.post("/signin", possibleCredentials, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const recordedUser = await User.findOne({ email });
    if (recordedUser === null) {
      res.status(404).json({ message: "user not found !" });
      return;
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      recordedUser.password
    );
    if (!isPasswordValid) {
      res.status(404).json({ message: "wrong email/password" });
      return;
    }
    if (!recordedUser.isMailValidated) {
      res.status(404).json({ message: "email not validated" });
      return;
    }
    res.status(200).json({
      userId: recordedUser._id,
      token: jwt.sign({ userId: recordedUser._id }, process.env.TOKEN_SECRET, {
        expiresIn: "10h",
      }),
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
