const express = require("express");
const hbsExpress = require("express-handlebars");
const path = require("path");

// Routes
const HomeRouter = require("./routes/home");
const CoursesRouter = require("./routes/courses");
const AddCourseRouter = require("./routes/addCourse");

const app = express();
const PORT = process.env.PORT || 3000;

const hbs = hbsExpress.create({
  defaultLayout: "main",
  extname: "hbs",
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use("/", HomeRouter);
app.use("/courses", CoursesRouter);
app.use("/addCourse", AddCourseRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
