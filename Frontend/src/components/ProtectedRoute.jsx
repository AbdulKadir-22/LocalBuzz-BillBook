import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * A component that guards routes requiring authentication.
 * It checks for user info in localStorage.
 */
const ProtectedRoute = () => {
    const userInfo = localStorage.getItem('userInfo');

    // If user is logged in, render the nested child routes.
    // Otherwise, redirect them to the login page.
    return userInfo ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;