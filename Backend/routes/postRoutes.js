const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const Discussion = require("../models/Discussion");

// Create post inside a discussion
router.post("/:discussionId", async (req, res) => {
  try {
    const { content, user } = req.body; // user = username string
    const discussionId = req.params.discussionId;

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) return res.status(404).json({ message: "Discussion not found" });

    const post = new Post({
      content,
      user,
      discussion: discussionId,
      likes: [],
      dislikes: [],
    });

    await post.save();
    discussion.posts.push(post._id);
    await discussion.save();

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all posts for a discussion
router.get("/:discussionId", async (req, res) => {
  try {
    const posts = await Post.find({ discussion: req.params.discussionId }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete post (optional auth check by username)
router.delete("/:id", async (req, res) => {
  try {
    const { username } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (username && post.user !== username) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Toggle like/dislike on a post
router.post("/:id/vote", async (req, res) => {
  try {
    const actor = (req.body.userId || req.body.user || "").toString().trim();
    const { type } = req.body; // "like" or "dislike"
    if (!actor) return res.status(400).json({ message: "Missing userId/user" });
    if (!["like", "dislike"].includes(type)) {
      return res.status(400).json({ message: "Invalid vote type" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const hasLiked = post.likes.includes(actor);
    const hasDisliked = post.dislikes.includes(actor);

    if (type === "like") {
      if (hasLiked) {
        post.likes = post.likes.filter(u => u !== actor);
      } else {
        post.dislikes = post.dislikes.filter(u => u !== actor);
        post.likes.push(actor);
      }
    } else {
      if (hasDisliked) {
        post.dislikes = post.dislikes.filter(u => u !== actor);
      } else {
        post.likes = post.likes.filter(u => u !== actor);
        post.dislikes.push(actor);
      }
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
