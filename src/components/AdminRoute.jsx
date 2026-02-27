import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const AdminRoute = ({ children }) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-brand-dark pt-20">
                <LoadingSpinner size="lg" text="Verifying admin credentials..." />
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if the user has the admin role
    if (user?.role !== 'admin') {
        // Redirect to courses (or home) if authenticated but not an admin
        // We use replace so they can't 'back' into this page
        return <Navigate to="/courses" replace />;
    }

    return children;
};

export default AdminRoute;
