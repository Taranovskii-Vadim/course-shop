const { Router } = require("express");
const crypt = require("bcryptjs");

const User = require("../models/user");

const router = Router();

router.get("/login", async (req, res) => {
  res.render("./auth/login", {
    title: "Вход",
    isLogin: true,
    registerErr: req.flash("registerErr"),
    loginErr: req.flash("loginErr"),
  });
});

router.post("/signIn", async (req, res) => {
  try {
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });
    if (candidate) {
      const isSame = await crypt.compare(password, candidate.password);
      if (isSame) {
        req.session.user = candidate;
        req.session.isSignIn = true;
        req.session.save(err => {
          if (err) {
            throw new Error(err);
          } else {
            res.redirect("/");
          }
        });
      } else {
        req.flash("loginErr", "Неверный пароль");
        res.redirect("/auth/login");
      }
    } else {
      req.flash("loginErr", "Пользователь не существует");
      res.redirect("/auth/login");
    }
  } catch (e) {
    console.log(e);
  }
});

router.post("/signUp", async (req, res) => {
  try {
    const { email, name, password, confirm } = req.body;
    const candidate = await User.findOne({ email });
    if (candidate) {
      req.flash("registerErr", "Пользователь уже существует");
      res.redirect("/auth/login#signUp");
    } else {
      const hashPassword = await crypt.hash(password, 10);
      const user = new User({ email, name, password: hashPassword, cart: [] });
      await user.save();
      res.redirect("/auth/login");
    }
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
