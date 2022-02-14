//@ Importing "Express" and assigning top level 'express() class' to 'app' variable 
const express = require("express");
const app = express();



//@ To accept data from "forms" we use this middleware,if not the req.body will 'undefined' 
app.use(express.urlencoded({extended:true}))



//@ Importing m'method-override' pck to do additional request such as PUT,PATCH,DELETE 
const methodOverride = require('method-override');
app.use(methodOverride('_method'));




//@ Importing "Mongoose" and Connecting to "MongoDB" 
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/kam-site").then(() => {
  console.log("Connected to MongoDB");
}).catch(e=>{new Error(e).message})




//@ Importing "path" in-build module and Setting the views and view engine 
const path = require("path");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");



//@ Importing route and using as a middleware 
const post = require("./routes/makeCampground");
app.use('/',post);



//@ Connecting the server 
app.listen(3000, () => {
  console.log("Connected to server 3000");
});
