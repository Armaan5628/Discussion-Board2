const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    user: { type: String, required: true },
    discussion: { type: mongoose.Schema.Types.ObjectId, ref: "Discussion" },
    likes: { type: [String], default: [] },     // usernames who liked
    dislikes: { type: [String], default: [] }   // usernames who disliked
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
