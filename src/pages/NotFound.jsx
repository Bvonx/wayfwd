import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <div className="text-center max-w-lg">
                {/* Glitch Effect Number */}
                <div className="relative mb-8">
                    <h1 className="text-[150px] md:text-[200px] font-display font-bold text-brand-surface leading-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl md:text-8xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
                            404
                        </span>
                    </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-brand-text mb-4">
                    Page Not Found
                </h2>

                <p className="text-brand-muted mb-8 leading-relaxed">
                    Looks like you've ventured into uncharted territory.
                    The page you're looking for doesn't exist or has been moved.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/"
                        className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-brand-dark font-bold rounded-full hover:bg-cyan-400 transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        Go Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 px-6 py-3 border border-brand-text/20 text-brand-text font-medium rounded-full hover:bg-brand-text/10 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </button>
                </div>

                {/* Quick Links */}
                <div className="mt-12 pt-8 border-t border-brand-text/10">
                    <p className="text-brand-muted text-sm mb-4">Looking for something specific?</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link to="/courses" className="text-brand-primary hover:text-cyan-400 text-sm font-medium transition-colors">
                            Browse Courses
                        </Link>
                        <span className="text-brand-surface">•</span>
                        <Link to="/assistant" className="text-brand-primary hover:text-cyan-400 text-sm font-medium transition-colors">
                            AI Assistant
                        </Link>
                        <span className="text-brand-surface">•</span>
                        <Link to="/pricing" className="text-brand-primary hover:text-cyan-400 text-sm font-medium transition-colors">
                            Pricing
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
