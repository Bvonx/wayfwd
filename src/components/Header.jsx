import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Menu, X, User, LogOut, Settings, ChevronDown,
    BarChart3, Award, Shield, ShieldAlert
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Courses', href: '/courses' },
        { name: 'AI Assistant', href: '/assistant' },
        { name: 'Pricing', href: '/pricing' },
    ];

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
        navigate('/');
    };

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-brand-dark/90 backdrop-blur-md border-b border-brand-text/10">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link
                    to="/"
                    className="text-2xl font-display font-bold text-brand-text tracking-widest hover:text-brand-primary transition-colors"
                >
                    WAYFWRD
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.href}
                            className={`text-sm font-medium transition-colors uppercase tracking-wider ${isActive(link.href)
                                ? 'text-brand-primary'
                                : 'text-brand-text hover:text-brand-text'
                                }`}

                        >
                            {link.name}
                        </Link>
                    ))}

                    {isAuthenticated ? (
                        <div className="flex items-center gap-6">
                            {user?.role === 'admin' && (
                                <Link
                                    to="/admin"
                                    className="hidden lg:flex items-center gap-2 px-4 py-2 bg-brand-surface/50 border border-purple-500/30 text-purple-400 rounded-full hover:bg-purple-500/10 hover:border-purple-500/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all"
                                >
                                    <ShieldAlert className="w-4 h-4" />
                                    <span className="text-sm font-bold tracking-wide uppercase">Admin Space</span>
                                </Link>
                            )}
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 px-4 py-2 bg-brand-surface border border-brand-text/10 rounded-full hover:border-brand-primary/50 transition-colors"
                                >
                                    <div className="w-7 h-7 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center">
                                        <span className="text-xs font-bold text-brand-dark">
                                            {user?.firstName?.[0]?.toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                    <span className="text-sm text-brand-text font-medium max-w-[100px] truncate">
                                        {user?.firstName || 'User'}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 text-brand-muted transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {showUserMenu && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setShowUserMenu(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-56 bg-brand-surface border border-brand-text/10 rounded-xl shadow-xl z-50 overflow-hidden">
                                            <div className="p-4 border-b border-brand-text/10">
                                                <p className="text-brand-text font-medium truncate">{user?.firstName} {user?.lastName}</p>
                                                <p className="text-sm text-brand-muted truncate">{user?.email}</p>
                                                {user?.twoFactorEnabled && (
                                                    <span className="inline-flex items-center gap-1 mt-2 text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                                                        <Shield className="w-3 h-3" />
                                                        2FA Enabled
                                                    </span>
                                                )}
                                            </div>
                                            <div className="py-2">
                                                <Link
                                                    to="/profile"
                                                    onClick={() => setShowUserMenu(false)}
                                                    className="flex items-center gap-3 px-4 py-2 text-brand-text hover:bg-brand-text/5 hover:text-brand-text transition-colors"
                                                >
                                                    <User className="w-4 h-4" />
                                                    <span>Profile</span>
                                                </Link>
                                                <Link
                                                    to="/analytics"
                                                    onClick={() => setShowUserMenu(false)}
                                                    className="flex items-center gap-3 px-4 py-2 text-brand-text hover:bg-brand-text/5 hover:text-brand-text transition-colors"
                                                >
                                                    <BarChart3 className="w-4 h-4" />
                                                    <span>Analytics</span>
                                                </Link>
                                                <Link
                                                    to="/certificates"
                                                    onClick={() => setShowUserMenu(false)}
                                                    className="flex items-center gap-3 px-4 py-2 text-brand-text hover:bg-brand-text/5 hover:text-brand-text transition-colors"
                                                >
                                                    <Award className="w-4 h-4" />
                                                    <span>Certificates</span>
                                                </Link>
                                                <Link
                                                    to="/settings"
                                                    onClick={() => setShowUserMenu(false)}
                                                    className="flex items-center gap-3 px-4 py-2 text-brand-text hover:bg-brand-text/5 hover:text-brand-text transition-colors"
                                                >
                                                    <Settings className="w-4 h-4" />
                                                    <span>Settings</span>
                                                </Link>
                                            </div>
                                            <div className="border-t border-brand-text/10 py-2">
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10 w-full transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    <span>Sign Out</span>
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link
                                to="/login"
                                className="text-sm font-medium text-brand-text hover:text-brand-text transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/signup"
                                className="px-5 py-2 bg-brand-primary text-brand-dark font-bold rounded-full text-sm hover:bg-cyan-400 transition-colors"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-brand-text p-2"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label={isOpen ? 'Close menu' : 'Open menu'}
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>

                {/* Mobile Nav */}
                {isOpen && (
                    <div className="absolute top-full left-0 w-full bg-brand-dark border-b border-brand-text/10 md:hidden flex flex-col items-center py-6 space-y-6 shadow-2xl">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                className={`text-lg font-medium transition-colors ${isActive(link.href) ? 'text-brand-primary' : 'text-brand-text'
                                    } `}
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {isAuthenticated ? (
                            <>
                                {user?.role === 'admin' && (
                                    <Link
                                        to="/admin"
                                        className="flex items-center gap-2 text-lg font-bold text-purple-400 hover:text-purple-300 transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <ShieldAlert className="w-5 h-5" />
                                        Admin Space
                                    </Link>
                                )}
                                <Link
                                    to="/profile"
                                    className="text-lg font-medium text-brand-text hover:text-brand-text transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Profile
                                </Link>
                                <Link
                                    to="/analytics"
                                    className="text-lg font-medium text-brand-text hover:text-brand-text transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Analytics
                                </Link>
                                <Link
                                    to="/certificates"
                                    className="text-lg font-medium text-brand-text hover:text-brand-text transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Certificates
                                </Link>
                                <Link
                                    to="/settings"
                                    className="text-lg font-medium text-brand-text hover:text-brand-text transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Settings
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsOpen(false);
                                    }}
                                    className="text-lg font-medium text-red-400"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-lg font-medium text-brand-text"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-8 py-3 bg-brand-primary text-brand-dark font-bold rounded-full"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
