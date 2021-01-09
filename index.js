const express = require("express");
const hbsExpress = require("express-handlebars");

// Routes
const HomeRouter = require("./routes/home");

const app = express();
const PORT = process.env.PORT || 3000;

const hbs = hbsExpress.create({
  defaultLayout: "main",
  extname: "hbs",
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use("/", HomeRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
