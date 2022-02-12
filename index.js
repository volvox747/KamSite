const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

//@ Connecting to MongoDB 
mongoose.connect("mongodb://localhost:27017/kam-site").then(() => {
  console.log("Connected to MongoDB");
}).catch(e=>{new Error(e).message})

const app = express();

//@ setting the views and view engine 
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");



//@ Connecting the server 
app.listen(3000, () => {
  console.log("Connected to server 3000");
});
