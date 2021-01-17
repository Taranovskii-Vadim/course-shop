const { Router } = require("express");
const crypt = require("bcryptjs");
const { validationResult } = require("express-validator");

const User = require("../models/user");
const { registerValidators, loginValidators } = require("../utils/validators");

const router = Router();

router.get("/login", async (req, res) => {
  res.render("./auth/login", {
    title: "Вход",
    isLogin: true,
    registerErr: req.flash("registerErr"),
    loginErr: req.flash("loginErr"),
  });
});

router.post("/signIn", loginValidators, async (req, res) => {
  try {
    const { email } = req.body;
    const candidate = await User.findOne({ email });
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash("loginErr", errors.array()[0].msg);
      return res.redirect("/auth/login");
    }

    req.session.user = candidate;
    req.session.isSignIn = true;
    req.session.save(err => {
      if (err) {
        throw new Error(err);
      } else {
        res.redirect("/");
      }
    });
  } catch (e) {
    console.log(e);
  }
});

router.post("/signUp", registerValidators, async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash("registerErr", errors.array()[0].msg);
      return res.status(422).redirect("/auth/login#signUp");
    }

    const hashPassword = await crypt.hash(password, 10);
    const user = new User({ email, name, password: hashPassword, cart: [] });
    await user.save();
    res.redirect("/auth/login");
  } catch (e) {
    console.log(e);
  }
});

router.get("/logout", async (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login");
  });
});

module.exports = router;
