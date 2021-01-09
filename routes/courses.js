const { Router } = require("express");
const Course = require("../models/course");

const router = Router();

router.get("/", async (req, res) => {
  const courses = await Course.getCourses();
  res.render("courses", {
    title: "Список курсов",
    isCourses: true,
    courses,
  });
});

module.exports = router;
