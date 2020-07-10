//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  var today = new Date();
  var options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  var day = today.toLocaleDateString("en-US", options);
  console.log(day);
  res.render("list", { kindOfDay: day });
});
app.post("/", function (req, res) {
  var item = req.body.newItem;
  console.log(item);
  
  res.write("You have saved your task.");
  res.write("Don't just sit down and wait, Go do it ");
  res.send();
});

app.listen(3000, function () {
  console.log("Server started on port 3000.");
});
