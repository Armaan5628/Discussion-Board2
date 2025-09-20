const mongoose = require("mongoose");

const DiscussionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    user: { type: String, required: true },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    likes: { type: [String], default: [] },     // usernames who liked
    dislikes: { type: [String], default: [] }   // usernames who disliked
  },
  { timestamps: true }
);

module.exports = mongoose.model("Discussion", DiscussionSchema);
