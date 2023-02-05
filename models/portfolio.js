import mongoose from "mongoose";

const portfolio = mongoose.Schema({
  name: String,
  about: String,
  creator: String,
  tags: [String],
  //   selectedFile: String,
});

var Portfolio = mongoose.model("Portfolio", portfolio);

export default Portfolio;
