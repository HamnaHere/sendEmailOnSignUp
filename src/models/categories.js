//models

const { string } = require("joi");
const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  title: {
    type: String,
    required: true,
  },
});

const Categories = mongoose.model("Users", categoriesSchema);

module.exports = Categories;
