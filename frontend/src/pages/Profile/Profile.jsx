import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, setUser } = useContext(UserContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editing, setEditing] = useState(false);
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [studentClass, setStudentClass] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [department, setDepartment] = useState("");
  const [adminRole, setAdminRole] = useState("");
  const navigate = useNavigate();

  // Load profile from localStorage on mount
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      setUser(userData);
      setName(userData.name || "");
      setEmail(userData.email || "");
      setImage(userData.image || "");
      setPreview(userData.image || "");
      setStudentClass(userData.class || "");
      setRollNo(userData.rollNo || "");
      setDepartment(userData.department || "");
      setAdminRole(userData.adminRole || "");
    }
  }, [setUser]);

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Validation function
  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email)) errs.email = "Invalid email format";
    if (user?.role === "student") {
      if (!studentClass.trim()) errs.class = "Class is required";
      if (!rollNo.trim()) errs.rollNo = "Roll No is required";
    }
    if (user?.role === "faculty") {
      if (!department.trim()) errs.department = "Department is required";
    }
    if (user?.role === "admin") {
      if (!adminRole.trim()) errs.adminRole = "System role is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Save profile to localStorage and context
  const handleSave = () => {
    if (!validate()) return;
    const updatedUser = {
      ...user,
      name,
      email,
      image,
      ...(user?.role === "student"
        ? { class: studentClass, rollNo }
        : user?.role === "faculty"
        ? { department }
        : user?.role === "admin"
        ? { adminRole }
        : {}),
    };
    // Save to localStorage
    localStorage.setItem("userData", JSON.stringify(updatedUser));
    // Update context
    setUser(updatedUser);
    setEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto my-10 bg-white/80 dark:bg-gray-900/70 backdrop-blur shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-700 px-8 py-10 md:px-16 md:py-14 transition-all">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 bg-gradient-to-r from-indigo-400 to-purple-500 text-white px-5 py-2 rounded-xl shadow-md font-semibold text-base transition-all hover:scale-105 hover:from-indigo-500 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-600"
      >
        <span className="text-lg">←</span>
        Back
      </button>
      <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-gray-900 dark:text-white text-center tracking-tight drop-shadow-lg">
        Profile
      </h2>
      {/* Profile Image */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 p-1 shadow-xl mb-2">
          <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden">
            {preview ? (
              <img
                src={preview}
                alt="Profile"
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-5xl md:text-6xl text-gray-400">👤</span>
            )}
          </div>
        </div>
        {editing && (
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2 text-sm text-gray-700 dark:text-gray-200"
          />
        )}
      </div>
      {/* Name */}
      <div className="mb-5">
        <label className="text-sm font-semibold text-gray-500 dark:text-gray-300 mb-1 block">Name</label>
        {editing ? (
          <>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-900/60 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-600 text-gray-900 dark:text-white transition"
              autoFocus
            />
            {errors.name && (
              <div className="text-red-600 text-sm mt-1">{errors.name}</div>
            )}
          </>
        ) : (
          <p className="text-lg font-medium text-gray-800 dark:text-white">{name}</p>
        )}
      </div>
      {/* Email */}
      <div className="mb-5">
        <label className="text-sm font-semibold text-gray-500 dark:text-gray-300 mb-1 block">Email</label>
        {editing ? (
          <>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-900/60 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-600 text-gray-900 dark:text-white transition"
            />
            {errors.email && (
              <div className="text-red-600 text-sm mt-1">{errors.email}</div>
            )}
          </>
        ) : (
          <p className="text-lg font-medium text-gray-800 dark:text-white">{email}</p>
        )}
      </div>
      {/* Student fields */}
      {user?.role === "student" && (
        <>
          <div className="mb-5">
            <label className="text-sm font-semibold text-gray-500 dark:text-gray-300 mb-1 block">Class</label>
            {editing ? (
              <>
                <input
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-900/60 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-600 text-gray-900 dark:text-white transition"
                />
                {errors.class && (
                  <div className="text-red-600 text-sm mt-1">{errors.class}</div>
                )}
              </>
            ) : (
              <p className="text-lg font-medium text-gray-800 dark:text-white">{studentClass}</p>
            )}
          </div>
          <div className="mb-5">
            <label className="text-sm font-semibold text-gray-500 dark:text-gray-300 mb-1 block">Roll No</label>
            {editing ? (
              <>
                <input
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-900/60 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-600 text-gray-900 dark:text-white transition"
                />
                {errors.rollNo && (
                  <div className="text-red-600 text-sm mt-1">{errors.rollNo}</div>
                )}
              </>
            ) : (
              <p className="text-lg font-medium text-gray-800 dark:text-white">{rollNo}</p>
            )}
          </div>
        </>
      )}
      {/* Faculty fields */}
      {user?.role === "faculty" && (
        <div className="mb-5">
          <label className="text-sm font-semibold text-gray-500 dark:text-gray-300 mb-1 block">Department</label>
          {editing ? (
            <>
              <input
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-900/60 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-600 text-gray-900 dark:text-white transition"
              />
              {errors.department && (
                <div className="text-red-600 text-sm mt-1">{errors.department}</div>
              )}
            </>
          ) : (
            <p className="text-lg font-medium text-gray-800 dark:text-white">{department}</p>
          )}
        </div>
      )}
      {/* Admin fields */}
      {user?.role === "admin" && (
        <div className="mb-5">
          <label className="text-sm font-semibold text-gray-500 dark:text-gray-300 mb-1 block">System Role</label>
          {editing ? (
            <>
              <input
                value={adminRole}
                onChange={(e) => setAdminRole(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-900/60 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-600 text-gray-900 dark:text-white transition"
              />
              {errors.adminRole && (
                <div className="text-red-600 text-sm mt-1">{errors.adminRole}</div>
              )}
            </>
          ) : (
            <p className="text-lg font-medium text-gray-800 dark:text-white">{adminRole}</p>
          )}
        </div>
      )}
      <div className="flex justify-center mt-8">
        {editing ? (
          <button
            type="button"
            onClick={handleSave}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-xl shadow-lg font-semibold text-lg transition-all hover:scale-105 hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-600"
          >
            Save
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="bg-gradient-to-r from-indigo-400 to-purple-500 text-white px-8 py-3 rounded-xl shadow-lg font-semibold text-lg transition-all hover:scale-105 hover:from-indigo-500 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-600"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
