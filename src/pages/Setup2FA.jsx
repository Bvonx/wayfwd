import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { useToast } from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { Shield, Copy, CheckCircle, AlertTriangle, QrCode } from 'lucide-react';

const Setup2FA = () => {
    const { user, updateUser } = useAuth();
    const { success, error: showError } = useToast();
    const navigate = useNavigate();

    const [step, setStep] = useState('intro'); // intro, setup, backup, confirm
    const [setupData, setSetupData] = useState(null);
    const [verificationCode, setVerificationCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copiedCodes, setCopiedCodes] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (user.twoFactorEnabled) {
            navigate('/profile');
        }
    }, [user, navigate]);

    const handleStartSetup = async () => {
        setIsLoading(true);

        try {
            const data = await api.setup2FA(user.id);
            setSetupData(data);
            setStep('setup');
        } catch (err) {
            showError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const copyBackupCodes = () => {
        const codesText = setupData.backupCodes.join('\n');
        navigator.clipboard.writeText(codesText);
        setCopiedCodes(true);
        success('Backup codes copied to clipboard');
    };

    const handleVerify = async () => {
        if (!verificationCode || verificationCode.length !== 6) {
            showError('Please enter the 6-digit code');
            return;
        }

        setIsLoading(true);

        try {
            await api.confirm2FASetup(user.id, verificationCode);
            updateUser({ twoFactorEnabled: true });
            success('Two-factor authentication enabled!');
            navigate('/profile');
        } catch (err) {
            showError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="pt-24 min-h-screen pb-12">
            <div className="max-w-lg mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-6 bg-brand-primary/20 rounded-full flex items-center justify-center">
                        <Shield className="w-8 h-8 text-brand-primary" />
                    </div>
                    <h1 className="text-3xl font-bold text-brand-text mb-2">
                        {step === 'intro' && 'Enable Two-Factor Authentication'}
                        {step === 'setup' && 'Scan QR Code'}
                        {step === 'backup' && 'Save Backup Codes'}
                        {step === 'confirm' && 'Verify Setup'}
                    </h1>
                    <p className="text-brand-muted">
                        {step === 'intro' && 'Add an extra layer of security to your account'}
                        {step === 'setup' && 'Use your authenticator app to scan this code'}
                        {step === 'backup' && 'Save these codes in a safe place'}
                        {step === 'confirm' && 'Enter a code from your authenticator app'}
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {['intro', 'setup', 'backup', 'confirm'].map((s, i) => (
                        <div key={s} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === s ? 'bg-brand-primary text-brand-dark' :
                                ['intro', 'setup', 'backup', 'confirm'].indexOf(step) > i
                                    ? 'bg-green-500 text-brand-text'
                                    : 'bg-white/10 text-brand-muted'
                                }`}>
                                {['intro', 'setup', 'backup', 'confirm'].indexOf(step) > i ? (
                                    <CheckCircle className="w-4 h-4" />
                                ) : (
                                    i + 1
                                )}
                            </div>
                            {i < 3 && <div className={`w-8 h-0.5 ${['intro', 'setup', 'backup', 'confirm'].indexOf(step) > i
                                ? 'bg-green-500' : 'bg-white/10'
                                }`} />}
                        </div>
                    ))}
                </div>

                <div className="bg-brand-surface border border-brand-text/10 rounded-xl p-6">
                    {/* Step: Intro */}
                    {step === 'intro' && (
                        <div className="space-y-6">
                            <div className="bg-brand-primary/10 border border-brand-primary/30 rounded-lg p-4">
                                <h3 className="font-semibold text-brand-text mb-2">Why enable 2FA?</h3>
                                <ul className="space-y-2 text-sm text-brand-muted">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                        <span>Protect your account even if your password is compromised</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                        <span>Required for advanced features and certifications</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                        <span>Industry best practice for security professionals</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-yellow-500">Before you begin</h4>
                                        <p className="text-sm text-yellow-400/80 mt-1">
                                            You'll need an authenticator app like Google Authenticator,
                                            Authy, or 1Password installed on your phone.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleStartSetup}
                                disabled={isLoading}
                                className="w-full py-3 bg-brand-primary text-brand-dark font-bold rounded-lg hover:bg-cyan-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <LoadingSpinner size="sm" />
                                        Setting up...
                                    </>
                                ) : (
                                    <>
                                        <Shield className="w-4 h-4" />
                                        Begin Setup
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Step: Setup (QR Code) */}
                    {step === 'setup' && setupData && (
                        <div className="space-y-6">
                            <div className="bg-white p-4 rounded-lg mx-auto w-fit">
                                {/* Simulated QR Code */}
                                <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
                                    <div className="text-center">
                                        <QrCode className="w-16 h-16 text-gray-400 mx-auto" />
                                        <p className="text-xs text-gray-500 mt-2">QR Code</p>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center">
                                <p className="text-sm text-brand-muted mb-2">Can't scan? Enter this code manually:</p>
                                <code className="bg-brand-dark px-4 py-2 rounded-lg font-mono text-brand-primary text-sm">
                                    {setupData.secret}
                                </code>
                            </div>

                            {/* Demo mode: show the verification code */}
                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                                <p className="text-sm text-blue-400">
                                    <strong>Demo Mode:</strong> Use this code to verify:
                                    <code className="ml-2 bg-blue-500/20 px-2 py-1 rounded font-mono">
                                        {setupData.setupCode}
                                    </code>
                                </p>
                            </div>

                            <button
                                onClick={() => setStep('backup')}
                                className="w-full py-3 bg-brand-primary text-brand-dark font-bold rounded-lg hover:bg-cyan-400 transition-colors"
                            >
                                Continue
                            </button>
                        </div>
                    )}

                    {/* Step: Backup Codes */}
                    {step === 'backup' && setupData && (
                        <div className="space-y-6">
                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-red-400">Important!</h4>
                                        <p className="text-sm text-red-400/80 mt-1">
                                            Save these backup codes. If you lose access to your authenticator,
                                            you'll need these codes to sign in.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-brand-dark rounded-lg p-4">
                                <div className="grid grid-cols-2 gap-2">
                                    {setupData.backupCodes.map((code, i) => (
                                        <code key={i} className="text-sm font-mono text-brand-text p-2 bg-white/5 rounded">
                                            {code}
                                        </code>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={copyBackupCodes}
                                className="w-full py-3 border border-brand-text/20 text-brand-text font-medium rounded-lg hover:bg-brand-text/10 transition-colors flex items-center justify-center gap-2"
                            >
                                {copiedCodes ? (
                                    <>
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" />
                                        Copy Backup Codes
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => setStep('confirm')}
                                className="w-full py-3 bg-brand-primary text-brand-dark font-bold rounded-lg hover:bg-cyan-400 transition-colors"
                            >
                                I've Saved My Codes
                            </button>
                        </div>
                    )}

                    {/* Step: Confirm */}
                    {step === 'confirm' && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <label className="block text-sm font-medium text-brand-text mb-4">
                                    Enter the 6-digit code from your authenticator app
                                </label>
                                <input
                                    type="text"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="000000"
                                    className="w-full max-w-xs mx-auto bg-brand-dark border border-brand-text/10 rounded-lg px-4 py-3 text-brand-text text-center text-2xl font-mono tracking-widest focus:outline-none focus:border-brand-primary"
                                    maxLength={6}
                                    disabled={isLoading}
                                />
                            </div>

                            <button
                                onClick={handleVerify}
                                disabled={isLoading || verificationCode.length !== 6}
                                className="w-full py-3 bg-brand-primary text-brand-dark font-bold rounded-lg hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <LoadingSpinner size="sm" />
                                        Verifying...
                                    </>
                                ) : (
                                    'Enable 2FA'
                                )}
                            </button>

                            <button
                                onClick={() => setStep('backup')}
                                className="w-full py-3 text-brand-muted hover:text-brand-text transition-colors"
                            >
                                Back
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Setup2FA;
