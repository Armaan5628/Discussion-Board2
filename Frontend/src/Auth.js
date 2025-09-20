// Frontend/src/Auth.js
import React, { useState } from "react";
import "./Auth.css";

function Auth({ setUser }) {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/login";
    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user); // user object {username, email, phone}
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <h2>{isSignup ? "Sign Up" : "Login"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {isSignup && (
          <>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone (North America)"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </>
        )}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>
      </form>
      <button onClick={() => setIsSignup(!isSignup)}>
        {isSignup ? "Already have an account? Login" : "Need an account? Sign Up"}
      </button>
      <button
        className="cancel-btn"
        onClick={() => (window.location.href = "https://www.google.ca")}
      >
        Cancel
      </button>
    </div>
  );
}

export default Auth;
