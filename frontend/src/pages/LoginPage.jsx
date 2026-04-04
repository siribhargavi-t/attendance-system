import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginUser from "../UseCase/loginUser";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const user = await loginUser(email, password);
    localStorage.setItem("user", JSON.stringify(user));
    navigate("/dashboard");
  };

  return (
  <div style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh"
  }}>
    <div className="card" style={{ width: "320px" }}>
      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="primary" onClick={handleLogin}>
        Login
      </button>
    </div>
  </div>
);
}

export default LoginPage;

