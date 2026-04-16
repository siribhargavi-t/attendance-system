import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext";

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

  // Removed Geolocation logic as requested

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Profile
      </h2>
      {/* Profile Image */}
      <div className="flex flex-col items-center mb-4">
        <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mb-2 flex items-center justify-center">
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="text-4xl text-gray-400">👤</span>
          )}
        </div>
        {editing && (
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-sm"
          />
        )}
      </div>
      {/* Name */}
      <div className="mb-3">
        <label className="text-sm text-gray-500">Name</label>
        {editing ? (
          <>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded"
              autoFocus
            />
            {errors.name && (
              <div className="text-red-600 text-sm mt-1">{errors.name}</div>
            )}
          </>
        ) : (
          <p className="text-gray-800 dark:text-white">{name}</p>
        )}
      </div>
      {/* Email */}
      <div className="mb-3">
        <label className="text-sm text-gray-500">Email</label>
        {editing ? (
          <>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 rounded"
            />
            {errors.email && (
              <div className="text-red-600 text-sm mt-1">{errors.email}</div>
            )}
          </>
        ) : (
          <p className="text-gray-800 dark:text-white">{email}</p>
        )}
      </div>
      {/* Student fields */}
      {user?.role === "student" && (
        <>
          <div className="mb-3">
            <label className="text-sm text-gray-500">Class</label>
            {editing ? (
              <>
                <input
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  className="w-full border p-2 rounded"
                />
                {errors.class && (
                  <div className="text-red-600 text-sm mt-1">{errors.class}</div>
                )}
              </>
            ) : (
              <p className="text-gray-800 dark:text-white">{studentClass}</p>
            )}
          </div>
          <div className="mb-3">
            <label className="text-sm text-gray-500">Roll No</label>
            {editing ? (
              <>
                <input
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  className="w-full border p-2 rounded"
                />
                {errors.rollNo && (
                  <div className="text-red-600 text-sm mt-1">{errors.rollNo}</div>
                )}
              </>
            ) : (
              <p className="text-gray-800 dark:text-white">{rollNo}</p>
            )}
          </div>
        </>
      )}
      {/* Faculty fields */}
      {user?.role === "faculty" && (
        <div className="mb-3">
          <label className="text-sm text-gray-500">Department</label>
          {editing ? (
            <>
              <input
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full border p-2 rounded"
              />
              {errors.department && (
                <div className="text-red-600 text-sm mt-1">{errors.department}</div>
              )}
            </>
          ) : (
            <p className="text-gray-800 dark:text-white">{department}</p>
          )}
        </div>
      )}
      {/* Admin fields */}
      {user?.role === "admin" && (
        <div className="mb-3">
          <label className="text-sm text-gray-500">System Role</label>
          {editing ? (
            <>
              <input
                value={adminRole}
                onChange={(e) => setAdminRole(e.target.value)}
                className="w-full border p-2 rounded"
              />
              {errors.adminRole && (
                <div className="text-red-600 text-sm mt-1">{errors.adminRole}</div>
              )}
            </>
          ) : (
            <p className="text-gray-800 dark:text-white">{adminRole}</p>
          )}
        </div>
      )}
      {editing ? (
        <button
          type="button"
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Edit
        </button>
      )}
      {/* Mark attendance explicitly removed */}
    </div>
  );
};

export default Profile;
