//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
//connection to the mongoose db
mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const itemsShema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
});
//create model
const Item = mongoose.model("Item", itemsShema);
//create default items
const work = new Item({
  name: "work out",
});
const lunch = new Item({
  name: "Eat lunch at 1",
});
const meditation = new Item({
  name: "meditate and relax at 4pm",
});
//store the default items in an array
const defaultItems = [work, lunch, meditation];
 
let workItems = ["Go running", "get a job this month"];
//get home page route
app.get("/", function (req, res) {
  Item.find({}, function (err, foundItems) {
    if (foundItems === 0) {
   Item.insertMany(defaultItems, function (err) {
     if (err) {
       console.log(err);
     } else {
       console.log("Data saved to the db");
     }
   });
      res.redirect('/');
    } else {
        res.render("list", { listTitle: day, newListItems: foundItems });
      }
     });
  
    let day = date.getDate();
  });

//post action to home page
app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName
  });
  item.save();
  res.redirect('/');
});
app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId, function (err) {
    if (err)
      console.log(err);
    console.log("Item deleted successfully");
    res.redirect("/");
  })
});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work list", newListItems: workItems });
});

app.listen(3000, function () {
  console.log("Server started on port 3000.");
});
