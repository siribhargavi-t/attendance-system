import React from "react";

const base =
  "px-4 py-2 rounded transition shadow-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2";
const variants = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md focus:ring-blue-500",
  success:
    "bg-green-600 text-white hover:bg-green-700 hover:shadow-md focus:ring-green-500",
  danger:
    "bg-red-600 text-white hover:bg-red-700 hover:shadow-md focus:ring-red-500",
};

const Button = ({ children, variant = "primary", className = "", ...props }) => (
  <button className={`${base} ${variants[variant]} ${className}`} {...props}>
    {children}
  </button>
);

export default Button;