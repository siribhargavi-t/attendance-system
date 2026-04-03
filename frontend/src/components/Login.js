import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password should not be empty");
      return;
    }
    setError("");

    try {
      console.log(email, password);
      const response = await axios.post("http://localhost:5000/api/students/login", {
        email,
        password,
      });

      console.log(response);
      console.log(response.data);

      if (response.data.success === true) {
        alert(response.data.message);
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      console.log(err);
      if (err.response) {
        setError(err.response.data.message || "An error occurred");
      } else {
        setError("Server error");
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;