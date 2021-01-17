const { Router } = require("express");

const User = require("../models/user");

const isProtectedRoute = require("../middlewares/isProtectedRoute");

const router = Router();

router.get("/", isProtectedRoute, async (req, res) => {
  return res.render("profile", {
    title: "Профиль",
    isProfile: true,
    user: req.user.toObject(),
  });
});

router.post("/", isProtectedRoute, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const toChange = {
      name: req.body.name,
    };
    if (req.file) {
      toChange.avatarUrl = req.file.path;
    }
    Object.assign(user, toChange);
    await user.save();
    res.redirect("/profile");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
