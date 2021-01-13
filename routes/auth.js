const { Router } = require("express");
const User = require("../models/user");

const router = Router();

router.get("/login", async (req, res) => {
  res.render("./auth/login", {
    title: "Вход",
    isLogin: true,
  });
});

router.post("/signIn", async (req, res) => {
  try {
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });
    if (candidate) {
      if (password === candidate.password) {
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
        res.redirect("/auth/login");
      }
    } else {
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
      res.redirect("/auth/login");
    } else {
      const user = new User({ email, name, password, cart: [] });
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
