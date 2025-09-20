// Frontend/src/PostList.js
import React from "react";

function PostList({ posts, currentUser, refresh }) {
  const del = async (id) => {
    await fetch(`http://localhost:5000/api/posts/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: currentUser }),
    });
    refresh();
  };

  const vote = async (id, type) => {
    await fetch(`http://localhost:5000/api/posts/${id}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: currentUser, type }),
    });
    refresh();
  };

  return (
    <ul className="post-list">
      {posts.map((p) => (
        <li key={p._id} className="post-item">
          <div className="post-content">
            {p.content} <span className="author">(by {p.user})</span>
          </div>
          <div className="actions">
            <button
              className={`vote-btn ${p.likes?.includes(currentUser) ? "liked" : ""}`}
              onClick={() => vote(p._id, "like")}
            >
              👍 {p.likes?.length || 0}
            </button>
            <button
              className={`vote-btn ${p.dislikes?.includes(currentUser) ? "disliked" : ""}`}
              onClick={() => vote(p._id, "dislike")}
            >
              👎 {p.dislikes?.length || 0}
            </button>
            {p.user === currentUser && (
              <button className="delete-btn" onClick={() => del(p._id)}>
                🗑
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default PostList;
