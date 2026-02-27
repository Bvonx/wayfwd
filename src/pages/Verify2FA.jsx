import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';
import TwoFactorInput from '../components/TwoFactorInput';
import { Shield, Key } from 'lucide-react';

const Verify2FA = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { setUserFromToken } = useAuth();
    const { success, error: showError } = useToast();

    // Get the pending auth data from navigation state
    const pendingAuth = location.state?.pendingAuth;

    const [isLoading, setIsLoading] = useState(false);
    const [useBackup, setUseBackup] = useState(false);
    const [backupCode, setBackupCode] = useState('');
    const [rememberDevice, setRememberDevice] = useState(false);

    // Redirect if no pending auth
    React.useEffect(() => {
        if (!pendingAuth) {
            navigate('/login');
        }
    }, [pendingAuth, navigate]);

    const handleCodeComplete = async (code) => {
        setIsLoading(true);

        try {
            const result = await api.verify2FA(pendingAuth.userId, code, rememberDevice);
            setUserFromToken(result.user, result.token);
            success('Welcome back!');

            const from = location.state?.from?.pathname || '/courses';
            navigate(from, { replace: true });
        } catch (err) {
            showError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackupSubmit = async (e) => {
        e.preventDefault();

        if (!backupCode.trim()) {
            showError('Please enter a backup code');
            return;
        }

        setIsLoading(true);

        try {
            const result = await api.verify2FA(pendingAuth.userId, backupCode.trim().toUpperCase(), rememberDevice);
            setUserFromToken(result.user, result.token);
            success('Welcome back!');

            const from = location.state?.from?.pathname || '/courses';
            navigate(from, { replace: true });
        } catch (err) {
            showError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!pendingAuth) return null;

    return (
        <div className="pt-24 min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full mx-auto px-6">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-6 bg-brand-primary/20 rounded-full flex items-center justify-center">
                        {useBackup ? (
                            <Key className="w-8 h-8 text-brand-primary" />
                        ) : (
                            <Shield className="w-8 h-8 text-brand-primary" />
                        )}
                    </div>
                    <h1 className="text-3xl font-bold text-brand-text mb-2">
                        {useBackup ? 'Enter Backup Code' : 'Two-Factor Authentication'}
                    </h1>
                    <p className="text-brand-muted">
                        {useBackup
                            ? 'Enter one of your backup codes to sign in'
                            : 'Enter the code from your authenticator app'
                        }
                    </p>
                </div>

                <div className="bg-brand-surface border border-brand-text/10 rounded-xl p-6">
                    {isLoading ? (
                        <div className="py-8 text-center">
                            <LoadingSpinner size="lg" text="Verifying..." />
                        </div>
                    ) : useBackup ? (
                        <form onSubmit={handleBackupSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-brand-text mb-2">
                                    Backup Code
                                </label>
                                <input
                                    type="text"
                                    value={backupCode}
                                    onChange={(e) => setBackupCode(e.target.value.toUpperCase())}
                                    placeholder="XXXXXXXX"
                                    className="w-full bg-brand-dark border border-brand-text/10 rounded-lg px-4 py-3 text-brand-text text-center font-mono tracking-widest focus:outline-none focus:border-brand-primary"
                                    maxLength={8}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-brand-primary text-brand-dark font-bold rounded-lg hover:bg-cyan-400 transition-colors"
                            >
                                Verify
                            </button>

                            <button
                                type="button"
                                onClick={() => setUseBackup(false)}
                                className="w-full py-3 text-brand-muted hover:text-brand-text transition-colors"
                            >
                                Use Authenticator Instead
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <TwoFactorInput
                                onComplete={handleCodeComplete}
                                disabled={isLoading}
                            />

                            {/* Remember Device */}
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberDevice}
                                    onChange={(e) => setRememberDevice(e.target.checked)}
                                    className="rounded bg-brand-dark border-brand-text/10 text-brand-primary focus:ring-brand-primary"
                                />
                                <span className="text-sm text-brand-muted">
                                    Trust this device for 30 days
                                </span>
                            </label>

                            <button
                                onClick={() => setUseBackup(true)}
                                className="w-full py-3 text-brand-muted hover:text-brand-text transition-colors text-sm"
                            >
                                Lost access to your authenticator? Use a backup code
                            </button>
                        </div>
                    )}
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

export default Verify2FA;
