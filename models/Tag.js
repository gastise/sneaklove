const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TagSchema = new Schema(
  {
    label: String
  },
  { timestamps: true }
);

const TagModel = mongoose.model("tag", TagSchema);

module.exports = TagModel;