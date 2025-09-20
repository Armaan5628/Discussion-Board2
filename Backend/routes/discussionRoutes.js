const express = require("express");
const router = express.Router();
const Discussion = require("../models/Discussion");

// Get all discussions
router.get("/", async (req, res) => {
  try {
    const discussions = await Discussion.find().sort({ createdAt: -1 });
    res.json(discussions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create discussion
router.post("/", async (req, res) => {
  try {
    const { title, user } = req.body; // user = username string
    const discussion = new Discussion({ title, user, likes: [], dislikes: [], posts: [] });
    await discussion.save();
    res.json(discussion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete discussion (optional auth check by username)
router.delete("/:id", async (req, res) => {
  try {
    const { username } = req.body; // frontend can send the author username
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) return res.status(404).json({ message: "Not found" });

    if (username && discussion.user !== username) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await discussion.deleteOne();
    res.json({ message: "Discussion deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Toggle like/dislike on a discussion
router.post("/:id/vote", async (req, res) => {
  try {
    // accept either userId or user from body; we store usernames in arrays
    const actor = (req.body.userId || req.body.user || "").toString().trim();
    const { type } = req.body; // "like" or "dislike"

    if (!actor) return res.status(400).json({ message: "Missing userId/user" });
    if (!["like", "dislike"].includes(type)) {
      return res.status(400).json({ message: "Invalid vote type" });
    }

    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) return res.status(404).json({ message: "Discussion not found" });

    const hasLiked = discussion.likes.includes(actor);
    const hasDisliked = discussion.dislikes.includes(actor);

    if (type === "like") {
      if (hasLiked) {
        // toggle off like
        discussion.likes = discussion.likes.filter(u => u !== actor);
      } else {
        // move from dislike to like (or just add like)
        discussion.dislikes = discussion.dislikes.filter(u => u !== actor);
        discussion.likes.push(actor);
      }
    } else {
      // type === "dislike"
      if (hasDisliked) {
        // toggle off dislike
        discussion.dislikes = discussion.dislikes.filter(u => u !== actor);
      } else {
        // move from like to dislike (or just add dislike)
        discussion.likes = discussion.likes.filter(u => u !== actor);
        discussion.dislikes.push(actor);
      }
    }

    await discussion.save();
    res.json(discussion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
