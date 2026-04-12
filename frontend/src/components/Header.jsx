import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, UserPlus, CalendarCheck } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

const Header = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    let userRole = null;

    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            userRole = decodedToken.user.role;
        } catch (error) {
            console.error("Invalid token:", error);
        }
    }

    const handleLogout = () => {
        // 1. Clear the token from localStorage
        localStorage.removeItem('token');
        // 2. Redirect to the main login/role selection page
        navigate('/'); 
    };

    const renderNavLinks = () => {
        const linkStyle = "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-700";
        switch (userRole) {
            case 'admin':
                return (
                    <>
                        <Link to="/admin/dashboard" className={linkStyle}><LayoutDashboard size={18} className="mr-2" />Dashboard</Link>
                        <Link to="/admin/manage-students" className={linkStyle}><UserPlus size={18} className="mr-2" />Manage Students</Link>
                        <Link to="/admin/mark-attendance" className={linkStyle}><CalendarCheck size={18} className="mr-2" />Mark Attendance</Link>
                    </>
                );
            
            // FIX: Add the case for the 'faculty' role
            case 'faculty':
                return (
                    <>
                        <Link to="/faculty/dashboard" className={linkStyle}><LayoutDashboard size={18} className="mr-2" />Dashboard</Link>
                    </>
                );

            case 'student':
                return (
                    <>
                        <Link to="/student/dashboard" className={linkStyle}><LayoutDashboard size={18} className="mr-2" />Dashboard</Link>
                        <Link to="/student/attendance" className={linkStyle}><CalendarCheck size={18} className="mr-2" />My Attendance</Link>
                    </>
                );
            default:
                return null;
        }
    };

    if (!userRole) return null; // Don't render header on login/register pages

    return (
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">
            <div className="text-xl font-bold">Attendance Portal</div>
            <nav className="flex items-center space-x-2">
                {renderNavLinks()}
                <button onClick={handleLogout} className="flex items-center bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                    <LogOut size={18} className="mr-2" /> Logout
                </button>
            </nav>
        </header>
    );
};

export default Header;