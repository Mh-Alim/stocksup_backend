import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const nameCodeSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  code: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

nameCodeSchema.methods.getJWTToken = async function (next) {
  return await jwt.sign({ id: this._id }, "dhfsdahfskdhfksdhfsd", {
    expiresIn: "7d",
  });
};
var CodeModel = mongoose.model("Code", nameCodeSchema);

export default CodeModel;
