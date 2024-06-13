import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/login", {
        username,
        password,
      });
      const token = response.data.token;
      localStorage.setItem("token", token);
      setSuccess(true);
      console.log("Login successful. Token:", token);
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Invalid username or password. Please try again.");
    }
  };

  if (localStorage.getItem("token")) {
    // If token is present, redirect to the Dashboard
    navigate("/dashboard");
  }

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn">
          Submit
        </button>
      </form>
      {/* Dialog box for successful login */}
      {success && (
        <div className="success-dialog">
          <p>Login Successful! Redirecting...</p>
        </div>
      )}
    </div>
  );
};

export default Login;
