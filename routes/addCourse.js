const { Router } = require("express");
const Course = require("../models/course");

// MiddleWares
const isProtectedRoute = require("../middlewares/isProtectedRoute");

const router = Router();

router.get("/", isProtectedRoute, (req, res) => {
  res.render("addCourse", {
    title: "Добавить курс",
    isAdd: true,
  });
});

router.post("/", isProtectedRoute, async (req, res) => {
  try {
    const course = new Course({
      title: req.body.title,
      price: req.body.price,
      img: req.body.img,
      userId: req.user,
    });
    await course.save();
    res.redirect("/courses");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
