import React from "react";
import { useNavigate } from "react-router-dom";

function SelectRole() {
  const navigate = useNavigate();

  const roles = [
    {
      title: "Admin",
      path: "/login/admin",
      color: "#4f46e5",
      desc: "Manage system, students & reports"
    },
    {
      title: "Student",
      path: "/login/student",
      color: "#16a34a",
      desc: "View attendance & performance"
    },
    {
      title: "Faculty",
      path: "/login/faculty",
      color: "#f59e0b",
      desc: "Mark and manage attendance"
    }
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome 👋</h1>
      <p style={styles.subheading}>Select your role to continue</p>

      <div style={styles.cardContainer}>
        {roles.map((role, index) => (
          <div
            key={index}
            style={{ ...styles.card, borderTop: `5px solid ${role.color}` }}
            onClick={() => navigate(role.path)}
          >
            <h2>{role.title}</h2>
            <p>{role.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    background: "linear-gradient(135deg, #e0e7ff, #f0fdf4)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "sans-serif"
  },
  heading: {
    fontSize: "36px",
    marginBottom: "10px"
  },
  subheading: {
    marginBottom: "40px",
    color: "#555"
  },
  cardContainer: {
    display: "flex",
    gap: "30px",
    flexWrap: "wrap",
    justifyContent: "center"
  },
  card: {
    width: "220px",
    padding: "25px",
    borderRadius: "15px",
    background: "#fff",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    cursor: "pointer",
    transition: "0.3s",
    textAlign: "center"
  }
};

export default SelectRole;