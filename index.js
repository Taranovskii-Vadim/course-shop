const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  fs.readFile(path.join(__dirname, "views", "index.html"), (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.end(data);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
