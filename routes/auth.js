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
  const user = await User.findById("5ffc8b2f56455621e88f77ea");
  req.session.user = user;
  req.session.isSignIn = true;
  req.session.save(err => {
    if (err) {
      throw new Error(err);
    } else {
      res.redirect("/");
    }
  });
});

router.get("/logout", async (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login");
  });
});

module.exports = router;
