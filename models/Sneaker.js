const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SneakerSchema = new Schema(
  {
    name: String,
    ref: String,
    size: Number,
    description: String,
    price: Number,
    picture: {
      type: String,
      default:
        "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-social-media-user-vector-default-avatar-profile-icon-social-media-user-vector-portrait-176194876.jpg",
    },
    category: {
      type: String,
      enum: ["men", "women", "kids"],
    },
    id_tags: [{ type: Schema.Types.ObjectId, ref: "tag" }],
  },
  { timestamps: true }
);

const SneakerModel = mongoose.model("sneaker", SneakerSchema);

module.exports = SneakerModel;
