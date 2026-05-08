import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
    const userData = localStorage.getItem('user');
    
    if (!userData) {
        return <Navigate to="/" replace />;
    }

    const user = JSON.parse(userData);
    const userRole = user.role?.toUpperCase();

    // If a specific role is required and the user doesn't have it, redirect to login
    if (role && userRole !== role.toUpperCase()) {
        console.warn(`Access Denied: Required ${role}, Found ${userRole}`);
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;