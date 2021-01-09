const { Router } = require("express");
const Course = require("../models/course");

const router = Router();

router.get("/", (req, res) => {
  res.render("addCourse", {
    title: "Добавить курс",
  });
});

router.post("/", (req, res) => {
  const course = new Course(req.body.title, req.body.price, req.body.img);
  course.save();
  res.redirect("/courses");
});

module.exports = router;
