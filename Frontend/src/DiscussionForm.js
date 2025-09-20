import React, { useState } from "react";

export default function DiscussionForm({ onAddDiscussion }) {
  const [title, setTitle] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddDiscussion(title.trim());
    setTitle("");
  };

  return (
    <form onSubmit={submit} className="discussion-form">
      <input
        placeholder="Start a new discussion..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="discussion-input"
      />
      <button type="submit" className="discussion-add-btn">
        Add
      </button>
    </form>
  );
}
