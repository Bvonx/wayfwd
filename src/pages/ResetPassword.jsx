import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { useToast } from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { success, error: showError } = useToast();

    const token = searchParams.get('token');

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    // Password strength
    const getPasswordStrength = (password) => {
        if (!password) return { score: 0, label: '', color: '' };

        let score = 0;
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;

        if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-red-500' };
        if (score <= 4) return { score: 2, label: 'Medium', color: 'bg-yellow-500' };
        return { score: 3, label: 'Strong', color: 'bg-green-500' };
    };

    const passwordStrength = getPasswordStrength(formData.password);

    // Validate token on mount
    useEffect(() => {
        if (!token) {
            showError('Invalid reset link. Please request a new one.');
            navigate('/forgot-password');
        }
    }, [token, navigate, showError]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/[A-Z]/.test(formData.password)) {
            newErrors.password = 'Password must contain an uppercase letter';
        } else if (!/[a-z]/.test(formData.password)) {
            newErrors.password = 'Password must contain a lowercase letter';
        } else if (!/[0-9]/.test(formData.password)) {
            newErrors.password = 'Password must contain a number';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            await api.resetPassword(token, formData.password);
            setIsSuccess(true);
            success('Password reset successfully!');
        } catch (err) {
            showError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    if (isSuccess) {
        return (
            <div className="pt-24 min-h-screen flex items-center justify-center">
                <div className="max-w-md w-full mx-auto px-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-brand-text mb-4">Password Reset!</h1>
                    <p className="text-brand-muted mb-8">
                        Your password has been successfully reset. You can now sign in with your new password.
                    </p>
                    <Link
                        to="/login"
                        className="inline-block px-8 py-3 bg-brand-primary text-brand-dark font-bold rounded-lg hover:bg-cyan-400 transition-colors"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full mx-auto px-6">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-6 bg-brand-primary/20 rounded-full flex items-center justify-center">
                        <Lock className="w-8 h-8 text-brand-primary" />
                    </div>
                    <h1 className="text-3xl font-bold text-brand-text mb-2">Reset Password</h1>
                    <p className="text-brand-muted">
                        Enter your new password below.
                    </p>
                </div>

                <div className="bg-brand-surface border border-brand-text/10 rounded-xl p-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-medium text-brand-text mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={`w-full bg-brand-dark border rounded-lg px-4 py-3 pr-12 text-brand-text focus:outline-none ${errors.password ? 'border-red-500' : 'border-brand-text/10 focus:border-brand-primary'
                                        }`}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-text"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Password Strength */}
                            {formData.password && (
                                <div className="mt-2">
                                    <div className="flex gap-1 mb-1">
                                        {[1, 2, 3].map(level => (
                                            <div
                                                key={level}
                                                className={`h-1 flex-1 rounded-full transition-colors ${level <= passwordStrength.score
                                                    ? passwordStrength.color
                                                    : 'bg-brand-text/10'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className={`text-xs ${passwordStrength.score === 1 ? 'text-red-400' :
                                        passwordStrength.score === 2 ? 'text-yellow-400' : 'text-green-400'
                                        }`}>
                                        {passwordStrength.label}
                                    </p>
                                </div>
                            )}

                            {errors.password && (
                                <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.password}
                                </p>
                            )}

                            {/* Requirements */}
                            <div className="mt-3 space-y-1">
                                {[
                                    { test: formData.password.length >= 8, text: 'At least 8 characters' },
                                    { test: /[A-Z]/.test(formData.password), text: 'One uppercase letter' },
                                    { test: /[a-z]/.test(formData.password), text: 'One lowercase letter' },
                                    { test: /[0-9]/.test(formData.password), text: 'One number' }
                                ].map((req, i) => (
                                    <div key={i} className={`flex items-center gap-2 text-xs ${req.test ? 'text-green-400' : 'text-brand-muted'
                                        }`}>
                                        <CheckCircle className={`w-3 h-3 ${req.test ? 'opacity-100' : 'opacity-30'}`} />
                                        {req.text}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-brand-text mb-2">
                                Confirm New Password
                            </label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className={`w-full bg-brand-dark border rounded-lg px-4 py-3 text-brand-text focus:outline-none ${errors.confirmPassword
                                    ? 'border-red-500'
                                    : formData.confirmPassword && formData.password === formData.confirmPassword
                                        ? 'border-green-500'
                                        : 'border-brand-text/10 focus:border-brand-primary'
                                    }`}
                                disabled={isLoading}
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-brand-primary text-brand-dark font-bold py-3 rounded-lg hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <LoadingSpinner size="sm" />
                                    Resetting...
                                </>
                            ) : (
                                'Reset Password'
                            )}
                        </button>
                    </form>
                </div>

                <Link
                    to="/login"
                    className="mt-6 block text-center text-brand-muted hover:text-brand-text transition-colors"
                >
                    Back to Login
                </Link>
            </div>
        </div>
    );
};

export default ResetPassword;
