const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
   caption: String,

   image: String,
   title: String,
   price: Number,
   description: String,
   category: String,
   sold: Boolean,
   dateOfSale: Date,
});

module.exports = mongoose.model("Product", Schema);
