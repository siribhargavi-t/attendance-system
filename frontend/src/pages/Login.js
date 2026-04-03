import "./Login.css";
import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/login",
        {
          email,
          password,
        }
      );

      console.log(res.data);

      // store token
      localStorage.setItem("token", res.data.token);

      alert("Login Successful ✅");

      // optional: redirect
      window.location.href = "/Attendance";

    } catch (err) {
      console.error(err);
      alert("Invalid credentials ❌");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;