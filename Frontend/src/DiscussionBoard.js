import React, { useState, useEffect } from "react";
import DiscussionForm from "./DiscussionForm";
import PostForm from "./PostForm";
import "./DiscussionBoard.css";

function DiscussionBoard({ user, onLogout }) {
  const [discussions, setDiscussions] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);

  const actor = user?.username || user; // ensure we always send a username string

  // Fetch discussions
  const fetchDiscussions = async () => {
    const res = await fetch("http://localhost:5000/api/discussions");
    const data = await res.json();
    setDiscussions(data);
  };

  useEffect(() => {
    fetchDiscussions();
  }, []);

  // Add discussion
  const addDiscussion = async (title) => {
    const res = await fetch("http://localhost:5000/api/discussions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, user: actor }),
    });
    const data = await res.json();
    if (res.ok) setDiscussions([data, ...discussions]);
  };

  // Select discussion + load its posts
  const selectDiscussion = async (d) => {
    setSelectedDiscussion(d);
    const res = await fetch(`http://localhost:5000/api/posts/${d._id}`);
    const data = await res.json();
    setPosts(data);
  };

  // Add post
  const addPost = async (content) => {
    if (!selectedDiscussion) return;
    const res = await fetch(`http://localhost:5000/api/posts/${selectedDiscussion._id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, user: actor }),
    });
    const newPost = await res.json();
    if (res.ok) {
      setPosts([newPost, ...posts]);
      fetchDiscussions(); // refresh post badge count
    }
  };

  // Delete discussion
  const handleDeleteDiscussion = async (id) => {
    const res = await fetch(`http://localhost:5000/api/discussions/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: actor }),
    });
    if (res.ok) {
      setDiscussions(discussions.filter((x) => x._id !== id));
      if (selectedDiscussion?._id === id) {
        setSelectedDiscussion(null);
        setPosts([]);
      }
    }
  };

  // Delete post
  const handleDeletePost = async (postId) => {
    const res = await fetch(`http://localhost:5000/api/posts/${postId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: actor }),
    });
    if (res.ok) {
      setPosts(posts.filter((p) => p._id !== postId));
      fetchDiscussions(); // keep counts in sync
    }
  };

  // Vote discussion (toggle)
  const voteDiscussion = async (id, type) => {
    const res = await fetch(`http://localhost:5000/api/discussions/${id}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: actor, type }),
    });
    const updated = await res.json();
    if (res.ok) {
      setDiscussions(discussions.map((d) => (d._id === id ? updated : d)));
    }
  };

  // Vote post (toggle)
  const votePost = async (postId, type) => {
    const res = await fetch(`http://localhost:5000/api/posts/${postId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: actor, type }),
    });
    const updated = await res.json();
    if (res.ok) {
      setPosts(posts.map((p) => (p._id === postId ? updated : p)));
    }
  };

  return (
    <div className="board-container">
      {/* Header */}
      <div className="board-header-section">
        <h1>Welcome, {actor}</h1>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>

      {/* Discussions */}
      <div className="discussions-section">
        <h2>All Discussions</h2>
        <DiscussionForm onAddDiscussion={addDiscussion} />
        <ul className="discussion-list">
          {discussions.map((d) => (
            <li key={d._id} className="discussion-item">
              <div className="discussion-title-container" onClick={() => selectDiscussion(d)}>
                <span className="discussion-title">{d.title}</span>
                <span className="post-badge">{d.posts?.length || 0} posts</span>
              </div>
              <div className="actions">
                <button
                  className={`vote-btn ${d.likes?.includes(actor) ? "liked" : ""}`}
                  onClick={() => voteDiscussion(d._id, "like")}
                >
                  👍 {d.likes?.length || 0}
                </button>
                <button
                  className={`vote-btn ${d.dislikes?.includes(actor) ? "disliked" : ""}`}
                  onClick={() => voteDiscussion(d._id, "dislike")}
                >
                  👎 {d.dislikes?.length || 0}
                </button>
                {d.user === actor && (
                  <button className="delete-btn" onClick={() => handleDeleteDiscussion(d._id)}>
                    🗑 Delete
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Posts */}
      {selectedDiscussion && (
        <div className="posts-section">
          <h2>Posts in "{selectedDiscussion.title}"</h2>
          <PostForm onAddPost={addPost} />
          <ul className="post-list">
            {posts.map((p) => (
              <li key={p._id} className="post-item">
                <span>{p.content} (by {p.user})</span>
                <div className="actions">
                  <button
                    className={`vote-btn ${p.likes?.includes(actor) ? "liked" : ""}`}
                    onClick={() => votePost(p._id, "like")}
                  >
                    👍 {p.likes?.length || 0}
                  </button>
                  <button
                    className={`vote-btn ${p.dislikes?.includes(actor) ? "disliked" : ""}`}
                    onClick={() => votePost(p._id, "dislike")}
                  >
                    👎 {p.dislikes?.length || 0}
                  </button>
                  {p.user === actor && (
                    <button className="delete-post-btn" onClick={() => handleDeletePost(p._id)}>
                      🗑
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default DiscussionBoard;
