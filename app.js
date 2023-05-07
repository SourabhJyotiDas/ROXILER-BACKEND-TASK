const express = require('express');
const mongoose = require('mongoose');
const app = express();

require("dotenv").config({path:"config/config.env"});


// Using Middlewares
app.use(express.json({ limit: "50mb" }));

// importing Routes
const product = require("./routes/product.js")

// usign Routes
app.use("/api/v1",product)
// app.use("/api/v1",user)


module.exports = app;