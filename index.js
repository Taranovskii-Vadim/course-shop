const express = require("express");
const hbsExpress = require("express-handlebars");
const handlebars = require("handlebars");
const mongoose = require("mongoose");
const path = require("path");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const compression = require("compression");

// Routes
const homeRouter = require("./routes/home");
const coursesRouter = require("./routes/courses");
const addCourseRouter = require("./routes/addCourse");
const cartRouter = require("./routes/cart");
const ordersRouter = require("./routes/orders");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");

// MiddleWares
const variablesMiddleware = require("./middlewares/variables");
const userMiddleware = require("./middlewares/user");
const errorMiddleware = require("./middlewares/error");
const fileMiddleware = require("./middlewares/file");

const keys = require("./keys");

const app = express();
const PORT = process.env.PORT || 3000;

const hbs = hbsExpress.create({
  defaultLayout: "main",
  extname: "hbs",
  handlebars: allowInsecurePrototypeAccess(handlebars),
  helpers: require("./utils/hbsUtils"),
});

const store = new MongoStore({
  collection: "sessions",
  uri: keys.MONGODB_URI,
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: keys.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store,
  })
);
app.use(fileMiddleware.single("avatar"));
app.use(csrf());
app.use(flash());
app.use(compression());

app.use(variablesMiddleware);
app.use(userMiddleware);

app.use("/", homeRouter);
app.use("/courses", coursesRouter);
app.use("/addCourse", addCourseRouter);
app.use("/cart", cartRouter);
app.use("/orders", ordersRouter);
app.use("/auth", authRouter);
app.use("/profile", profileRouter);

app.use(errorMiddleware);

async function start() {
  try {
    await mongoose.connect(keys.MONGODB_URI, {
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
