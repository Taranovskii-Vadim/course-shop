const express = require("express");
const hbsExpress = require("express-handlebars");
const path = require("path");

// Routes
const homeRouter = require("./routes/home");
const coursesRouter = require("./routes/courses");
const addCourseRouter = require("./routes/addCourse");
const cartRouter = require("./routes/cart");

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

app.use("/", homeRouter);
app.use("/courses", coursesRouter);
app.use("/addCourse", addCourseRouter);
app.use("/cart", cartRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
