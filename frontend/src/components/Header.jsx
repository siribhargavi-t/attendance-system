function Header() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="header">
      <h3>Attendance Management System</h3>
      <p>Logged in as: {user?.role}</p>
    </div>
  );
}

export default Header;