// Frontend/src/DiscussionList.js
import React from "react";

function DiscussionList({ discussions, currentUser, onSelect, onDelete, onVote }) {
  return (
    <ul className="discussion-list">
      {discussions.map((d) => (
        <li key={d._id} className="discussion-item">
          <div
            className="discussion-title-container"
            onClick={() => onSelect(d)}
          >
            <span className="discussion-title">{d.title}</span>
            <span className="post-badge">{d.posts?.length || 0} posts</span>
          </div>

          <div className="actions">
            <button
              className="vote-btn"
              onClick={() => onVote(d._id, "like")}
            >
              👍 {d.likes?.length || 0}
            </button>
            <button
              className="vote-btn"
              onClick={() => onVote(d._id, "dislike")}
            >
              👎 {d.dislikes?.length || 0}
            </button>
            {d.user === currentUser && (
              <button
                className="delete-btn"
                onClick={() => onDelete(d._id)}
              >
                🗑 Delete
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default DiscussionList;
