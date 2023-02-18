//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const URL = process.env.url;
mongoose.set('strictQuery', false);
mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected !")
  }
})

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your ToDoList"
})
const item2 = new Item({
  name: "Hit + button to add new item."
})
const item3 = new Item({
  name: "<--Hit this to delete item."
})

const defaultItems = [item1, item2, item3];

const Work = mongoose.model("Work", itemsSchema);

var listHeading = "";

app.get("/", function (req, res) {
  Item.find({} , (err, itmeslist) => {
    if (itmeslist.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Inserted !");
        }
      });
    }
    if (err) {
      console.log(err);
    } else {
      listHeading = "Today";
      res.render("list", { listTitle: "Today", newListItems: itmeslist });
    }
  });
});

app.post("/", function (req, res) {

  const newitem = req.body.newItem;

  if (req.body.list === "Work List") {
    const item = new Work({
      name: newitem
    });
    item.save();
    res.redirect("/work");
  } else {
    const item = new Item({
      name: newitem
    });
    item.save();
    res.redirect("/");
  }
});

app.post("/delete", (req, res) => {
  const id = req.body.checkbox;
  if (listHeading === "Work List") {
    Work.findByIdAndRemove(id, (err) => {
      if (!err) {
        console.log("Successfully delted checked item.");
        res.redirect("/work");
      }
    });
  } else {
    Item.findByIdAndRemove(id, (err) => {
      if (!err) {
        console.log("Successfully delted checked item.");
        res.redirect("/");
      }
    });
  }

});

app.get("/work", function (req, res) {
  Work.find((err, worklist) => {
    if (err) {
      console.log(err);
    } else {
      listHeading = "Work List";
      res.render("list", { listTitle: "Work List", newListItems: worklist });
    }
  });

});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(4500, function () {
  console.log("Server started on port 4500");
});
