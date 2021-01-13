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

// Routes
const homeRouter = require("./routes/home");
const coursesRouter = require("./routes/courses");
const addCourseRouter = require("./routes/addCourse");
const cartRouter = require("./routes/cart");
const ordersRouter = require("./routes/orders");
const authRouter = require("./routes/auth");

// MiddleWares
const variablesMiddleware = require("./middlewares/variables");
const userMiddleware = require("./middlewares/user");

const app = express();
const PORT = process.env.PORT || 3000;

const MONGODB_URI =
  "mongodb+srv://vadim:PQfBXnZM5UYOGSiZ@cluster0.ewsyq.mongodb.net/shop?retryWrites=true&w=majority";

const hbs = hbsExpress.create({
  defaultLayout: "main",
  extname: "hbs",
  handlebars: allowInsecurePrototypeAccess(handlebars),
});

const store = new MongoStore({
  collection: "sessions",
  uri: MONGODB_URI,
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "secret val",
    resave: false,
    saveUninitialized: false,
    store,
  })
);
app.use(csrf());

app.use(variablesMiddleware);
app.use(userMiddleware);

app.use("/", homeRouter);
app.use("/courses", coursesRouter);
app.use("/addCourse", addCourseRouter);
app.use("/cart", cartRouter);
app.use("/orders", ordersRouter);
app.use("/auth", authRouter);

async function start() {
  try {
    await mongoose.connect(MONGODB_URI, {
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
