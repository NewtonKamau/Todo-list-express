//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const _ = require("lodash");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
//connection to the mongoose db
mongoose.connect(
  "mongodb+srv://admin-newton:admin123@cluster0.smtqs.azure.mongodb.net/todolistDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
let day = date.getDate();
//create schema
const itemsShema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
});
//create model
const Item = mongoose.model("Item", itemsShema);
//create default items
const welcome = new Item({
  name: "Welcome to your to do list app",
});
const add = new Item({
  name: "Press + to add new item",
});
const clear = new Item({
  name: "press the  checkbox to delete an item",
});
//store the default items in an array
const defaultItems = [welcome, add, clear];

//list schema
const listSchema = {
  name: String,
  items: [itemsShema],
};
//list model
const List = mongoose.model("List", listSchema);

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
      res.redirect("/");
    } else {
      res.render("list", { listTitle: day, newListItems: foundItems });
    }
  });

  
});
//dynamic route
app.get("/:customListName", function (req, res) {
  //get the link parameters and store in a variable
  const customListName = _.capitalize(req.params.customListName);
  //check if the link exist before creating one in the db
  List.findOne({ name: customListName }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        //create a new  list
        const list = new List({
          name: customListName,
          items: defaultItems,
        });
        //save the new route url
        list.save();
        //redirect to same new route with the default list
        res.redirect("/" + customListName);
      } else {
         res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
      }
    }
  });
});

//post action to home page
app.post("/", function (req, res) {
  //get the body items
  const itemName = req.body.newItem;
  const listName = req.body.list;
  //create a new item
  const item = new Item({
    name: itemName,
  });
  //check the route title ,save new list based on the title 
  if (listName === day) {
     item.save();
     res.redirect("/");
  } else {
    List.findOne({ name: listName }, function (err, foundList) {
      if (err)
       console.log(err);
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
 
});
//delete item from the db 
app.post("/delete", function (req, res) {
  //grab the the clicked check box
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === day) {
      //use findAndRemove() taking the item id
      Item.findByIdAndRemove(checkedItemId, function (err) {
        if (err) console.log(err);
        console.log("Item deleted successfully");
        res.redirect("/");
      });
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } },
      function (err, foundList) {
        if (!err) res.redirect("/" + listName);
      }
    );
    }
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000.");
});
