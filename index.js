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

// Models
const User = require("./models/user");

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

app.use(async (req, res, next) => {
  try {
    const user = await User.findById("5ffc8b2f56455621e88f77ea");
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
  }
});

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

    const candidate = await User.findOne();

    if (!candidate) {
      const user = new User({
        name: "vadim",
        email: "test@mail.ru",
        cart: [],
      });
      await user.save();
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
