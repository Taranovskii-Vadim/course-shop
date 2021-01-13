const { Router } = require("express");
const Course = require("../models/course");

const router = Router();

// MiddleWares
const isProtectedRoute = require("../middlewares/isProtectedRoute");

router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.render("courses", {
      title: "Список курсов",
      isCourses: true,
      courses,
    });
  } catch (e) {
    console.log(e);
  }
});

router.get("/:id/edit", isProtectedRoute, async (req, res) => {
  try {
    if (!req.query.allow) {
      res.redirect("/courses");
    } else {
      const course = await Course.findById(req.params.id);
      res.render("courseEdit", {
        title: `Редактировать курс по ${course.title}`,
        course,
      });
    }
  } catch (e) {
    console.log(e);
  }
});

router.post("/edit", isProtectedRoute, async (req, res) => {
  try {
    const { id } = req.body;
    delete req.body.id;
    await Course.findByIdAndUpdate(id, req.body);
    res.redirect("/courses");
  } catch (e) {
    console.log(e);
  }
});

router.post("/remove", isProtectedRoute, async (req, res) => {
  try {
    await Course.deleteOne({ _id: req.body.id });
    res.redirect("/courses");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
