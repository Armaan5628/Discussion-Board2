import React, { useState } from "react";

export default function PostForm({ onAddPost }) {
  const [text, setText] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddPost(text.trim());
    setText("");
  };

  return (
    <form onSubmit={submit} className="post-form">
      <input
        placeholder="Write a post..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="post-input"
      />
      <button type="submit" className="post-add-btn">
        Add Post
      </button>
    </form>
  );
}
