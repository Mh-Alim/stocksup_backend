import mongoose from "mongoose";

const portfolio = mongoose.Schema({
  name: String,
  about: String,
  creator: String,
  tags: [String],
  stock: {
    type: Number,
    default: 100,
  },

  //   selectedFile: String,
});

var Portfolio = mongoose.model("Portfolio", portfolio);

export default Portfolio;
