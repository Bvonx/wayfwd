import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import Section from '../components/Section';
import LoadingSpinner from '../components/LoadingSpinner';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

const Signup = () => {
    const { signup, googleSignIn: signupWithGoogle } = useAuth();
    const { success, error: showError } = useToast();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    // Password strength calculation
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

    const validateForm = () => {
        const newErrors = {};

        // First name validation
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        // Last name validation
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/[A-Z]/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one uppercase letter';
        } else if (!/[a-z]/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one lowercase letter';
        } else if (!/[0-9]/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one number';
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        // Terms validation
        if (!acceptedTerms) {
            newErrors.terms = 'You must accept the terms and conditions';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            await signup(formData.firstName, formData.lastName, formData.email, formData.password);
            success('Account created successfully! Welcome to WayFwrd.');
            navigate('/courses', { replace: true });
        } catch (err) {
            showError(err.message || 'Registration failed. Please try again.');
            setErrors({ form: err.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="pt-24 min-h-screen flex items-center justify-center py-12">
            <Section title="Join WayFwrd" id="signup">
                <div className="bg-brand-surface p-8 rounded-xl border border-brand-text/10 max-w-md mx-auto w-full shadow-2xl">
                    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                        {/* Form Error */}
                        {errors.form && (
                            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                                <p className="text-red-400 text-sm">{errors.form}</p>
                            </div>
                        )}

                        {/* Google Sign Up */}
                        <button
                            type="button"
                            onClick={async () => {
                                setIsLoading(true);
                                try {
                                    await signupWithGoogle();
                                    success('Account created successfully! Welcome to WayFwrd.');
                                    navigate('/courses', { replace: true });
                                } catch (error) {
                                    console.error("Google Sign Up Error:", error);
                                    showError('Failed to sign up with Google');
                                } finally {
                                    setIsLoading(false);
                                }
                            }}
                            disabled={isLoading}
                            className="w-full bg-white text-gray-900 font-bold py-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 mb-4"
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                            Sign up with Google
                        </button>

                        <div className="relative flex items-center justify-center my-6">
                            <div className="border-t border-brand-text/10 w-full"></div>
                            <span className="bg-brand-surface px-3 text-sm text-brand-muted absolute">OR</span>
                        </div>

                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-brand-text mb-2">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className={`w-full bg-brand-dark border rounded-lg px-4 py-3 text-brand-text focus:outline-none transition-colors ${errors.firstName
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-brand-text/10 focus:border-brand-primary'
                                        }`}
                                    placeholder="John"
                                    disabled={isLoading}
                                    autoComplete="given-name"
                                />
                                {errors.firstName && (
                                    <p className="mt-1 text-xs text-red-400">{errors.firstName}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-brand-text mb-2">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className={`w-full bg-brand-dark border rounded-lg px-4 py-3 text-brand-text focus:outline-none transition-colors ${errors.lastName
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-brand-text/10 focus:border-brand-primary'
                                        }`}
                                    placeholder="Doe"
                                    disabled={isLoading}
                                    autoComplete="family-name"
                                />
                                {errors.lastName && (
                                    <p className="mt-1 text-xs text-red-400">{errors.lastName}</p>
                                )}
                            </div>
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
                                disabled={isLoading}
                                autoComplete="email"
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-400">{errors.email}</p>
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
                                    disabled={isLoading}
                                    autoComplete="new-password"
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

                            {/* Password Strength Indicator */}
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
                                        Password strength: {passwordStrength.label}
                                    </p>
                                </div>
                            )}

                            {errors.password && (
                                <p className="mt-1 text-xs text-red-400">{errors.password}</p>
                            )}

                            {/* Password Requirements */}
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

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-brand-text mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`w-full bg-brand-dark border rounded-lg px-4 py-3 pr-12 text-brand-text focus:outline-none transition-colors ${errors.confirmPassword
                                        ? 'border-red-500 focus:border-red-500'
                                        : formData.confirmPassword && formData.password === formData.confirmPassword
                                            ? 'border-green-500 focus:border-green-500'
                                            : 'border-brand-text/10 focus:border-brand-primary'
                                        }`}
                                    placeholder="••••••••"
                                    disabled={isLoading}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-text transition-colors"
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Terms Checkbox */}
                        <div>
                            <label className={`flex items-start gap-3 cursor-pointer ${errors.terms ? 'text-red-400' : 'text-brand-muted'}`}>
                                <input
                                    type="checkbox"
                                    checked={acceptedTerms}
                                    onChange={(e) => {
                                        setAcceptedTerms(e.target.checked);
                                        if (errors.terms) {
                                            setErrors(prev => ({ ...prev, terms: '' }));
                                        }
                                    }}
                                    className="mt-1 rounded bg-brand-dark border-brand-text/10 text-brand-primary focus:ring-brand-primary focus:ring-offset-0"
                                />
                                <span className="text-sm">
                                    I agree to the{' '}
                                    <Link to="/terms" className="text-brand-primary hover:text-cyan-400 transition-colors">
                                        Terms of Service
                                    </Link>
                                    {' '}and{' '}
                                    <Link to="/privacy" className="text-brand-primary hover:text-cyan-400 transition-colors">
                                        Privacy Policy
                                    </Link>
                                </span>
                            </label>
                            {errors.terms && (
                                <p className="mt-1 text-xs text-red-400">{errors.terms}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-brand-primary text-brand-dark font-bold py-3 rounded-lg hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <LoadingSpinner size="sm" />
                                    <span>Creating account...</span>
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-brand-muted text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-brand-primary hover:text-cyan-400 font-bold transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>
            </Section>
        </div>
    );
};

export default Signup;
