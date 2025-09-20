// Frontend/src/App.js
import React, { useState } from "react";
import Auth from "./Auth";
import DiscussionBoard from "./DiscussionBoard";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="App">
      {!user ? (
        <Auth setUser={setUser} />
      ) : (
        <DiscussionBoard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
