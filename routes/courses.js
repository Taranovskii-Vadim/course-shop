const { Router } = require("express");
const Course = require("../models/course");

const router = Router();

// MiddleWares
const isProtectedRoute = require("../middlewares/isProtectedRoute");

const { isOwner } = require("./helpers");

router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.render("courses", {
      title: "Список курсов",
      isCourses: true,
      currentUserId: req.user ? req.user._id.toString() : null,
      courses,
    });
  } catch (e) {
    console.log(e);
  }
});

router.get("/:id/edit", isProtectedRoute, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect("/courses");
  }
  try {
    const course = await Course.findById(req.params.id);

    if (!isOwner(course, req)) {
      return res.redirect("/courses");
    }

    res.render("courseEdit", {
      title: `Редактировать курс по ${course.title}`,
      course,
    });
  } catch (e) {
    console.log(e);
  }
});

router.post("/edit", isProtectedRoute, async (req, res) => {
  try {
    const { id } = req.body;
    delete req.body.id;
    const course = await Course.findById(id);
    if (!isOwner(course, req)) {
      return res.redirect("/courses");
    }
    Object.assign(course, req.body);
    await course.save();
    res.redirect("/courses");
  } catch (e) {
    console.log(e);
  }
});

router.post("/remove", isProtectedRoute, async (req, res) => {
  try {
    await Course.deleteOne({ _id: req.body.id, userId: req.user._id });
    res.redirect("/courses");
  } catch (e) {
    console.log(e);
  }
});

router.get("/:id", isProtectedRoute, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    res.render("course", {
      layout: "empty",
      title: `Курс по ${course.title}`,
      course,
    });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
