import React, { useState, useContext } from 'react';
import API from "../../services/api";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Assuming you use an AuthContext
import { jwtDecode } from 'jwt-decode'; // You will need this package

const RoleSelection = () => {
    const [role, setRole] = useState('student');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth(); // Using login function from context

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const payload = { email, password };
            const { data } = await API.post('/api/auth/login', payload);

            // Save the token to localStorage
            localStorage.setItem('token', data.token);
            
            // Update auth context if you are using one
            login(data.token);

            // --- THIS IS THE REDIRECTION LOGIC ---
            // 1. Decode the token to get the user's role
            const decodedToken = jwtDecode(data.token);
            const userRole = decodedToken.user.role;

            // 2. Navigate based on the role
            switch (userRole) {
                case 'admin':
                    navigate('/admin/dashboard');
                    break;
                case 'faculty':
                    navigate('/faculty/dashboard');
                    break;
                case 'student':
                    navigate('/student/dashboard');
                    break;
                default:
                    // Fallback to a generic page or login if role is unknown
                    navigate('/');
                    break;
            }

        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
            console.error("Login error:", err);
        }
    };

    // ... rest of the component's JSX for the form ...
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                <form onSubmit={handleLogin}>
                    {/* ... email and password input fields ... */}
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className="w-full px-3 py-2 border rounded-md"
                            required 
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700">Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="w-full px-3 py-2 border rounded-md"
                            required 
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RoleSelection;