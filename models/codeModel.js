import mongoose from "mongoose";

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

var CodeModel = mongoose.model("Code", nameCodeSchema);

export default CodeModel;
