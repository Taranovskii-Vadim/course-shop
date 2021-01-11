const { Router } = require("express");
const Course = require("../models/course");

const router = Router();

router.get("/", async (req, res) => {
  const courses = await Course.find();
  res.render("courses", {
    title: "Список курсов",
    isCourses: true,
    courses,
  });
});

router.get("/:id/edit", async (req, res) => {
  if (!req.query.allow) {
    res.redirect("/courses");
  } else {
    const course = await Course.getCourse(req.params.id);
    res.render("courseEdit", {
      title: `Редактировать курс по ${course.title}`,
      course,
    });
  }
});

router.post("/edit", async (req, res) => {
  await Course.update(req.body);
  res.redirect("/courses");
});

module.exports = router;
