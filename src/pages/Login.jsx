import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import { useRateLimiter } from '../hooks/useRateLimiter';
import Section from '../components/Section';
import LoadingSpinner from '../components/LoadingSpinner';
import RateLimitAlert from '../components/RateLimitAlert';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const Login = () => {
    const { login, googleSignIn } = useAuth();
    const { success, error: showError } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const rateLimiter = useRateLimiter('login');

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rateLimiter.isLimited) {
            showError(`Please wait ${rateLimiter.formatRemainingTime()} before trying again`);
            return;
        }

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            await login(formData.email, formData.password);
            success('Welcome back!');
            const from = location.state?.from?.pathname || '/courses';
            navigate(from, { replace: true });
        } catch (err) {
            if (err.message.includes('too-many-requests')) {
                rateLimiter.setLimited(Date.now() + 15 * 60 * 1000);
            }
            console.error(err);
            showError('Failed to sign in. Please check your credentials.');
            setErrors({ form: 'Failed to sign in. Please check your credentials.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            await googleSignIn();
            success('Welcome back!');
            const from = location.state?.from?.pathname || '/courses';
            navigate(from, { replace: true });
        } catch (error) {
            console.error(error);
            console.error("Google Sign In Error:", error);
            showError('Failed to sign in with Google');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="pt-24 min-h-screen flex items-center justify-center">
            <Section title="Welcome Back" id="login">
                <div className="bg-brand-surface p-8 rounded-xl border border-brand-text/10 max-w-md mx-auto w-full shadow-2xl">
                    {rateLimiter.isLimited && (
                        <RateLimitAlert
                            remainingSeconds={rateLimiter.remainingSeconds}
                            formatRemainingTime={rateLimiter.formatRemainingTime}
                        />
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                        {/* Form Error */}
                        {errors.form && (
                            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                                <p className="text-red-400 text-sm">{errors.form}</p>
                            </div>
                        )}

                        {/* Google Sign In */}
                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                            className="w-full bg-white text-gray-900 font-bold py-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 mb-4"
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                            Sign in with Google
                        </button>

                        <div className="relative flex items-center justify-center my-6">
                            <div className="border-t border-brand-text/10 w-full"></div>
                            <span className="bg-brand-surface px-3 text-sm text-brand-muted absolute">OR</span>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-brand-text mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full bg-brand-dark border rounded-lg px-4 py-3 text-brand-text focus:outline-none transition-colors ${errors.email
                                    ? 'border-red-500 focus:border-red-500'
                                    : 'border-brand-text/10 focus:border-brand-primary'
                                    }`}
                                placeholder="name@example.com"
                                disabled={isLoading || rateLimiter.isLimited}
                                autoComplete="email"
                            />
                            {errors.email && (
                                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-brand-text mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full bg-brand-dark border rounded-lg px-4 py-3 pr-12 text-brand-text focus:outline-none transition-colors ${errors.password
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-brand-text/10 focus:border-brand-primary'
                                        }`}
                                    placeholder="••••••••"
                                    disabled={isLoading || rateLimiter.isLimited}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-text transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center text-brand-muted hover:text-brand-text cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="mr-2 rounded bg-brand-dark border-brand-text/10 text-brand-primary focus:ring-brand-primary focus:ring-offset-0"
                                />
                                Remember me
                            </label>
                            <Link
                                to="/forgot-password"
                                className="text-brand-primary hover:text-cyan-400 transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || rateLimiter.isLimited}
                            className="w-full bg-brand-primary text-brand-dark font-bold py-3 rounded-lg hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <LoadingSpinner size="sm" />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-brand-muted text-sm">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-brand-primary hover:text-cyan-400 font-bold transition-colors">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </Section>
        </div>
    );
};

export default Login;
