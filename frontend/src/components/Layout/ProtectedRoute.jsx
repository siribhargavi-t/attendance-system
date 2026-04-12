import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Make sure this path is correct

export const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useAuth();

    if (loading) {
        // While the context is checking for a user (e.g., on page load),
        // show a loading indicator to prevent a flicker.
        return <div>Loading...</div>;
    }

    if (!user) {
        // If there is no authenticated user, redirect them to the main login selection page.
        return <Navigate to="/" replace />;
    }

    if (user.role === role) {
        // If the user's role matches the required role for this route, allow access.
        return children;
    }

    // If the user is logged in but their role does NOT match,
    // redirect them to their own specific dashboard. This prevents access to unauthorized pages.
    switch (user.role) {
        case 'admin':
            return <Navigate to="/admin/dashboard" replace />;
        case 'faculty':
            return <Navigate to="/faculty/dashboard" replace />;
        case 'student':
            return <Navigate to="/student/dashboard" replace />;
        default:
            // If the user has an unknown role, send them back to the login page.
            return <Navigate to="/" replace />;
    }
};