import React from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/dashboard");
  };

  return (
    <div>
      <h2>Login</h2>
      <input type="text" placeholder="Username" /><br /><br />
      <input type="password" placeholder="Password" /><br /><br />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;