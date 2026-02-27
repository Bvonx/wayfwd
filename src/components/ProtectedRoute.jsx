import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requireAuth = true }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-brand-dark">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-brand-muted text-sm">Verifying session...</p>
                </div>
            </div>
        );
    }

    if (requireAuth && !isAuthenticated) {
        // Redirect to login, preserving the intended destination
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If route requires user to NOT be authenticated (like login page when already logged in)
    if (!requireAuth && isAuthenticated) {
        const from = location.state?.from?.pathname || '/courses';
        return <Navigate to={from} replace />;
    }

    return children;
};

export default ProtectedRoute;
