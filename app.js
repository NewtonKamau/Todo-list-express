//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");


app.get("/", function (req, res) {
    var today = new Date();
    var currentDay = new Date().getDate();
    var day = "";
    if (currentDay == 9 || currentDay == 5) {
        day = "The weekend is here , parte after parte";
          res.render("list", { kindOfDay: day });

    } else {
        res.send("You have to work harder and longer man");
    }
});

app.listen(3000, function () {
    console.log("Server started on port 3000.");
});
