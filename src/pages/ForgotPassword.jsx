import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useToast } from '../components/Toast';
import { useRateLimiter } from '../hooks/useRateLimiter';
import RateLimitAlert from '../components/RateLimitAlert';
import LoadingSpinner from '../components/LoadingSpinner';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
    const { success, error: showError } = useToast();
    const rateLimiter = useRateLimiter('passwordReset');

    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rateLimiter.isLimited) {
            showError(`Please wait ${rateLimiter.formatRemainingTime()} before trying again`);
            return;
        }

        if (!email.trim()) {
            showError('Please enter your email address');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError('Please enter a valid email address');
            return;
        }

        setIsLoading(true);

        try {
            await api.requestPasswordReset(email);
            setIsSubmitted(true);
            success('If an account exists, a reset link has been sent');
        } catch (err) {
            if (err.message.includes('Too many')) {
                rateLimiter.setLimited(Date.now() + 60 * 60 * 1000);
            }
            showError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="pt-24 min-h-screen flex items-center justify-center">
                <div className="max-w-md w-full mx-auto px-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-brand-text mb-4">Check Your Email</h1>
                    <p className="text-brand-muted mb-8">
                        If an account exists for <span className="text-brand-text">{email}</span>,
                        we've sent instructions to reset your password.
                    </p>

                    <div className="bg-brand-surface border border-brand-text/10 rounded-xl p-6 mb-6">
                        <p className="text-sm text-brand-muted mb-4">
                            <strong className="text-brand-text">Note:</strong> For this demo, the reset token
                            is logged to the browser console. In production, it would be sent via email.
                        </p>
                        <p className="text-xs text-brand-muted">
                            Check your browser's developer console (F12) to see the token.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Link
                            to="/login"
                            className="block w-full py-3 bg-brand-primary text-brand-dark font-bold rounded-lg hover:bg-cyan-400 transition-colors"
                        >
                            Back to Login
                        </Link>
                        <button
                            onClick={() => setIsSubmitted(false)}
                            className="block w-full py-3 border border-brand-text/20 text-brand-text font-medium rounded-lg hover:bg-brand-text/10 transition-colors"
                        >
                            Try Different Email
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full mx-auto px-6">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-6 bg-brand-primary/20 rounded-full flex items-center justify-center">
                        <Mail className="w-8 h-8 text-brand-primary" />
                    </div>
                    <h1 className="text-3xl font-bold text-brand-text mb-2">Forgot Password?</h1>
                    <p className="text-brand-muted">
                        No worries! Enter your email and we'll send you reset instructions.
                    </p>
                </div>

                <div className="bg-brand-surface border border-brand-text/10 rounded-xl p-6">
                    {rateLimiter.isLimited && (
                        <RateLimitAlert
                            remainingSeconds={rateLimiter.remainingSeconds}
                            formatRemainingTime={rateLimiter.formatRemainingTime}
                        />
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-brand-text mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full bg-brand-dark border border-brand-text/10 rounded-lg px-4 py-3 text-brand-text focus:outline-none focus:border-brand-primary"
                                disabled={isLoading || rateLimiter.isLimited}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || rateLimiter.isLimited}
                            className="w-full bg-brand-primary text-brand-dark font-bold py-3 rounded-lg hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <LoadingSpinner size="sm" />
                                    Sending...
                                </>
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>
                    </form>
                </div>

                <Link
                    to="/login"
                    className="mt-6 flex items-center justify-center gap-2 text-brand-muted hover:text-brand-text transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                </Link>
            </div>
        </div>
    );
};

export default ForgotPassword;
