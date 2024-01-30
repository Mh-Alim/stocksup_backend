import mongoose from "mongoose";

const portfolio = mongoose.Schema({
  name: String,
  about: String,
  leader: String,
  stock: {
    type: Number,
    default: 100,
  },
});

var Portfolio = mongoose.model("Portfolio", portfolio);




export default Portfolio;