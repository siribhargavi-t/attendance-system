import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/login", { email, password });
      localStorage.setItem("user", JSON.stringify(res.data));

      if (res.data.role === "faculty") navigate("/mark");
      else navigate("/view");
    } catch {
      alert("Login Failed");
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2 style={{ textAlign: "center" }}>Login</h2>

        <input placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} />

        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

export default Login;