import React from 'react';

const LoadingSpinner = ({ size = 'md', text = null, className = '' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
        xl: 'w-16 h-16 border-4'
    };

    return (
        <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
            <div
                className={`${sizeClasses[size]} border-brand-primary border-t-transparent rounded-full animate-spin`}
            />
            {text && (
                <p className="text-brand-muted text-sm animate-pulse">{text}</p>
            )}
        </div>
    );
};

export default LoadingSpinner;
