import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Mail, CheckCircle, RefreshCw, ArrowRight } from 'lucide-react';

const VerifyEmail = () => {
    const { user, updateUser } = useAuth();
    const { success, error: showError } = useToast();
    const navigate = useNavigate();

    const [verificationCode, setVerificationCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    // Redirect if already verified or not logged in
    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (user.emailVerified) {
            navigate('/courses');
        }
    }, [user, navigate]);

    // Cooldown timer for resend
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const handleVerify = async (e) => {
        e.preventDefault();

        if (!verificationCode.trim()) {
            showError('Please enter the verification code');
            return;
        }

        setIsLoading(true);

        try {
            await api.verifyEmail(user.id, verificationCode.trim());
            setIsVerified(true);
            updateUser({ emailVerified: true });
            success('Email verified successfully!');

            // Redirect after short delay
            setTimeout(() => navigate('/courses'), 2000);
        } catch (err) {
            showError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendCooldown > 0) return;

        setIsResending(true);

        try {
            await api.resendVerificationEmail(user.id);
            success('Verification email sent! Check your inbox.');
            setResendCooldown(60); // 60 second cooldown
        } catch (err) {
            showError(err.message);
        } finally {
            setIsResending(false);
        }
    };

    if (!user) return null;

    if (isVerified) {
        return (
            <div className="pt-24 min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-6">
                    <div className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-brand-text mb-4">Email Verified!</h1>
                    <p className="text-brand-muted mb-6">
                        Your email has been verified. Redirecting to courses...
                    </p>
                    <LoadingSpinner size="sm" />
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
                    <h1 className="text-3xl font-bold text-brand-text mb-2">Check Your Email</h1>
                    <p className="text-brand-muted">
                        We've sent a verification code to{' '}
                        <span className="text-brand-text font-medium">{user.email}</span>
                    </p>
                </div>

                <div className="bg-brand-surface border border-brand-text/10 rounded-xl p-6">
                    <form onSubmit={handleVerify} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-brand-text mb-2">
                                Verification Code
                            </label>
                            <input
                                type="text"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                                placeholder="Enter 6-character code"
                                className="w-full bg-brand-dark border border-brand-text/10 rounded-lg px-4 py-3 text-brand-text text-center text-xl tracking-widest font-mono focus:outline-none focus:border-brand-primary"
                                maxLength={6}
                                disabled={isLoading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !verificationCode.trim()}
                            className="w-full bg-brand-primary text-brand-dark font-bold py-3 rounded-lg hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <LoadingSpinner size="sm" />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    Verify Email
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-brand-text/10 text-center">
                        <p className="text-brand-muted text-sm mb-3">
                            Didn't receive the code?
                        </p>
                        <button
                            onClick={handleResend}
                            disabled={isResending || resendCooldown > 0}
                            className="inline-flex items-center gap-2 text-brand-primary hover:text-cyan-400 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isResending ? (
                                <>
                                    <LoadingSpinner size="sm" />
                                    Sending...
                                </>
                            ) : resendCooldown > 0 ? (
                                <>
                                    <RefreshCw className="w-4 h-4" />
                                    Resend in {resendCooldown}s
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="w-4 h-4" />
                                    Resend Code
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <p className="mt-6 text-center text-brand-muted text-sm">
                    Wrong email?{' '}
                    <Link to="/signup" className="text-brand-primary hover:text-cyan-400">
                        Sign up again
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default VerifyEmail;
