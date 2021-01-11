const express = require("express");
const hbsExpress = require("express-handlebars");
const handlebars = require("handlebars");
const mongoose = require("mongoose");
const path = require("path");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

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
  handlebars: allowInsecurePrototypeAccess(handlebars),
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

async function start() {
  try {
    const url =
      "mongodb+srv://vadim:PQfBXnZM5UYOGSiZ@cluster0.ewsyq.mongodb.net/shop?retryWrites=true&w=majority";
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
