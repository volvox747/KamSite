const express = require('express');
const mongoose=require('mongoose');
const path = require('path');   

const app=express();

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');





app.listen(3000,()=>{console.log("Connected to server 3000");})