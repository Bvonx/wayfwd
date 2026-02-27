import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { useToast } from '../components/Toast';
import { seedCourses } from '../admin/seedCourses';
import {
    Settings as SettingsIcon,
    Sun,
    Moon,
    Bell,
    BellOff,
    Mail,
    Globe,
    Eye,
    EyeOff,
    Shield,
    Zap,
    ZapOff,
    Type,
    Contrast,
    ChevronRight,
    RotateCcw,
    Trash2,
    Download,
    LogOut,
    Lock,
    User,
    CheckCircle,
    Database,
    ShieldCheck
} from 'lucide-react';

// Toggle Switch Component (defined outside Settings to prevent recreation on render)
const ToggleSwitch = ({ enabled, onChange, disabled = false }) => (
    <button
        onClick={() => !disabled && onChange(!enabled)}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            } ${enabled ? 'bg-brand-primary' : 'bg-brand-text/10'}`}
    >
        <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
        />
    </button>
);

// Setting Row Component (defined outside Settings to prevent recreation on render)
const SettingRow = ({ icon: Icon, label, description, children }) => (
    <div className="flex items-center justify-between p-4 bg-brand-dark/50 rounded-lg">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-brand-surface flex items-center justify-center">
                {Icon && <Icon className="w-5 h-5 text-brand-primary" />}
            </div>
            <div>
                <p className="text-brand-text font-medium">{label}</p>
                {description && <p className="text-sm text-brand-muted">{description}</p>}
            </div>
        </div>
        {children}
    </div>
);

const Settings = () => {
    const { user, logout } = useAuth();
    const { settings, updateSetting, resetSettings, requestNotificationPermission } = useSettings();
    const { success, error, info } = useToast();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('appearance');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleLogout = () => {
        logout();
        success('You have been logged out');
        navigate('/');
    };

    const handleResetSettings = () => {
        if (window.confirm('Reset all settings to defaults? This cannot be undone.')) {
            resetSettings();
            success('Settings reset to defaults');
        }
    };

    const handleExportData = () => {
        const data = {
            user: {
                firstName: user?.firstName,
                lastName: user?.lastName,
                email: user?.email,
                createdAt: user?.createdAt
            },
            settings,
            exportedAt: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `wayfwrd-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        success('Data exported successfully');
    };

    const handleNotificationToggle = async () => {
        if (!settings.browserNotifications) {
            const result = await requestNotificationPermission();
            if (result.granted) {
                success('Browser notifications enabled');
            } else {
                error(result.error || 'Could not enable notifications');
            }
        } else {
            updateSetting('browserNotifications', false);
            info('Browser notifications disabled');
        }
    };

    const sections = [
        { id: 'appearance', label: 'Appearance', icon: Sun },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'privacy', label: 'Privacy', icon: Eye },
        { id: 'accessibility', label: 'Accessibility', icon: Zap },
        { id: 'language', label: 'Language', icon: Globe },
        { id: 'account', label: 'Account', icon: User },
    ];

    return (
        <div className="pt-24 min-h-screen">
            <div className="max-w-5xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-brand-text mb-2">Settings</h1>
                        <p className="text-brand-muted">Customize your WayFwrd experience</p>
                    </div>
                    <button
                        onClick={handleResetSettings}
                        className="flex items-center gap-2 px-4 py-2 text-brand-muted hover:text-brand-text transition-colors"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Reset All
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1">
                        <nav className="bg-brand-surface border border-brand-text/10 rounded-xl p-2 sticky top-24">
                            {sections.map(({ id, label, icon: SectionIcon }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveSection(id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeSection === id
                                        ? 'bg-brand-primary/10 text-brand-primary'
                                        : 'text-brand-text hover:bg-brand-text/5 hover:text-brand-text'
                                        }`}
                                >
                                    {SectionIcon && <SectionIcon className="w-5 h-5" />}
                                    <span className="font-medium">{label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Settings Content */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Appearance Section */}
                        {activeSection === 'appearance' && (
                            <div className="bg-brand-surface border border-brand-text/10 rounded-xl p-6">
                                <h2 className="text-xl font-bold text-brand-text mb-6 flex items-center gap-2">
                                    <Sun className="w-5 h-5 text-brand-primary" />
                                    Appearance
                                </h2>
                                <div className="space-y-4">
                                    <SettingRow
                                        icon={settings.theme === 'dark' ? Moon : Sun}
                                        label="Theme"
                                        description="Switch between dark and light mode"
                                    >
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => updateSetting('theme', 'light')}
                                                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${settings.theme === 'light'
                                                    ? 'bg-brand-primary text-brand-dark'
                                                    : 'bg-brand-dark text-brand-text hover:text-brand-text'
                                                    }`}
                                            >
                                                <Sun className="w-4 h-4" />
                                                Light
                                            </button>
                                            <button
                                                onClick={() => updateSetting('theme', 'dark')}
                                                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${settings.theme === 'dark'
                                                    ? 'bg-brand-primary text-brand-dark'
                                                    : 'bg-brand-dark text-brand-text hover:text-brand-text'
                                                    }`}
                                            >
                                                <Moon className="w-4 h-4" />
                                                Dark
                                            </button>
                                        </div>
                                    </SettingRow>
                                </div>
                            </div>
                        )}

                        {/* Notifications Section */}
                        {activeSection === 'notifications' && (
                            <div className="bg-brand-surface border border-brand-text/10 rounded-xl p-6">
                                <h2 className="text-xl font-bold text-brand-text mb-6 flex items-center gap-2">
                                    <Bell className="w-5 h-5 text-brand-primary" />
                                    Notifications
                                </h2>
                                <div className="space-y-4">
                                    <SettingRow
                                        icon={Mail}
                                        label="Email Notifications"
                                        description="Receive updates via email"
                                    >
                                        <ToggleSwitch
                                            enabled={settings.emailNotifications}
                                            onChange={(v) => updateSetting('emailNotifications', v)}
                                        />
                                    </SettingRow>

                                    <SettingRow
                                        icon={settings.browserNotifications ? Bell : BellOff}
                                        label="Browser Notifications"
                                        description="Get push notifications in your browser"
                                    >
                                        <ToggleSwitch
                                            enabled={settings.browserNotifications}
                                            onChange={handleNotificationToggle}
                                        />
                                    </SettingRow>

                                    <SettingRow
                                        icon={CheckCircle}
                                        label="Course Updates"
                                        description="Notify when courses are updated"
                                    >
                                        <ToggleSwitch
                                            enabled={settings.courseUpdates}
                                            onChange={(v) => updateSetting('courseUpdates', v)}
                                        />
                                    </SettingRow>

                                    <SettingRow
                                        icon={Mail}
                                        label="Weekly Digest"
                                        description="Receive a weekly summary email"
                                    >
                                        <ToggleSwitch
                                            enabled={settings.weeklyDigest}
                                            onChange={(v) => updateSetting('weeklyDigest', v)}
                                        />
                                    </SettingRow>
                                </div>
                            </div>
                        )}

                        {/* Privacy Section */}
                        {activeSection === 'privacy' && (
                            <div className="bg-brand-surface border border-brand-text/10 rounded-xl p-6">
                                <h2 className="text-xl font-bold text-brand-text mb-6 flex items-center gap-2">
                                    <Eye className="w-5 h-5 text-brand-primary" />
                                    Privacy & Security
                                </h2>
                                <div className="space-y-4">
                                    <SettingRow
                                        icon={Eye}
                                        label="Profile Visibility"
                                        description="Control who can see your profile"
                                    >
                                        <select
                                            value={settings.profileVisibility}
                                            onChange={(e) => updateSetting('profileVisibility', e.target.value)}
                                            className="bg-brand-dark border border-brand-text/10 text-brand-text rounded-lg px-4 py-2 focus:outline-none focus:border-brand-primary"
                                        >
                                            <option value="public">Public</option>
                                            <option value="friends">Friends Only</option>
                                            <option value="private">Private</option>
                                        </select>
                                    </SettingRow>

                                    <SettingRow
                                        icon={settings.showActivityStatus ? Eye : EyeOff}
                                        label="Activity Status"
                                        description="Show when you're online"
                                    >
                                        <ToggleSwitch
                                            enabled={settings.showActivityStatus}
                                            onChange={(v) => updateSetting('showActivityStatus', v)}
                                        />
                                    </SettingRow>

                                    <SettingRow
                                        icon={settings.showProgress ? Eye : EyeOff}
                                        label="Show Progress"
                                        description="Display your learning progress publicly"
                                    >
                                        <ToggleSwitch
                                            enabled={settings.showProgress}
                                            onChange={(v) => updateSetting('showProgress', v)}
                                        />
                                    </SettingRow>

                                    <Link
                                        to="/setup-2fa"
                                        className="flex items-center justify-between p-4 bg-brand-dark/50 rounded-lg hover:bg-brand-dark transition-colors group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-brand-surface flex items-center justify-center">
                                                <Shield className={`w-5 h-5 ${user?.twoFactorEnabled ? 'text-green-500' : 'text-brand-primary'}`} />
                                            </div>
                                            <div>
                                                <p className="text-brand-text font-medium">Two-Factor Authentication</p>
                                                <p className="text-sm text-brand-muted">
                                                    {user?.twoFactorEnabled ? 'Enabled - Your account is secured' : 'Add extra security to your account'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {user?.twoFactorEnabled && (
                                                <span className="px-3 py-1 text-xs font-bold text-green-500 bg-green-500/10 rounded-full">
                                                    Enabled
                                                </span>
                                            )}
                                            <ChevronRight className="w-5 h-5 text-brand-muted group-hover:text-brand-text transition-colors" />
                                        </div>
                                    </Link>

                                    <Link
                                        to="/profile"
                                        className="flex items-center justify-between p-4 bg-brand-dark/50 rounded-lg hover:bg-brand-dark transition-colors group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-brand-surface flex items-center justify-center">
                                                <Lock className="w-5 h-5 text-brand-primary" />
                                            </div>
                                            <div>
                                                <p className="text-brand-text font-medium">Change Password</p>
                                                <p className="text-sm text-brand-muted">Update your account password</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-brand-muted group-hover:text-brand-text transition-colors" />
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Accessibility Section */}
                        {activeSection === 'accessibility' && (
                            <div className="bg-brand-surface border border-brand-text/10 rounded-xl p-6">
                                <h2 className="text-xl font-bold text-brand-text mb-6 flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-brand-primary" />
                                    Accessibility
                                </h2>
                                <div className="space-y-4">
                                    <SettingRow
                                        icon={settings.reducedMotion ? ZapOff : Zap}
                                        label="Reduced Motion"
                                        description="Minimize animations and transitions"
                                    >
                                        <ToggleSwitch
                                            enabled={settings.reducedMotion}
                                            onChange={(v) => updateSetting('reducedMotion', v)}
                                        />
                                    </SettingRow>

                                    <SettingRow
                                        icon={Contrast}
                                        label="High Contrast"
                                        description="Increase contrast for better visibility"
                                    >
                                        <ToggleSwitch
                                            enabled={settings.highContrast}
                                            onChange={(v) => updateSetting('highContrast', v)}
                                        />
                                    </SettingRow>

                                    <SettingRow
                                        icon={Type}
                                        label="Font Size"
                                        description="Adjust text size across the app"
                                    >
                                        <div className="flex items-center gap-2">
                                            {['small', 'medium', 'large'].map((size) => (
                                                <button
                                                    key={size}
                                                    onClick={() => updateSetting('fontSize', size)}
                                                    className={`px-3 py-1 rounded-lg text-sm capitalize transition-colors ${settings.fontSize === size
                                                        ? 'bg-brand-primary text-brand-dark'
                                                        : 'bg-brand-dark text-brand-text hover:text-brand-text'
                                                        }`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </SettingRow>
                                </div>
                            </div>
                        )}

                        {/* Language Section */}
                        {activeSection === 'language' && (
                            <div className="bg-brand-surface border border-brand-text/10 rounded-xl p-6">
                                <h2 className="text-xl font-bold text-brand-text mb-6 flex items-center gap-2">
                                    <Globe className="w-5 h-5 text-brand-primary" />
                                    Language & Region
                                </h2>
                                <div className="space-y-4">
                                    <SettingRow
                                        icon={Globe}
                                        label="Language"
                                        description="Choose your preferred language"
                                    >
                                        <select
                                            value={settings.language}
                                            onChange={(e) => {
                                                const newLang = e.target.value;
                                                const langNames = {
                                                    en: 'English',
                                                    sw: 'Swahili',
                                                    fr: 'French',
                                                    ar: 'Arabic',
                                                    pt: 'Portuguese'
                                                };
                                                updateSetting('language', newLang);
                                                success(`Language set to ${langNames[newLang]}`);
                                            }}
                                            className="bg-brand-dark border border-brand-text/10 text-brand-text rounded-lg px-4 py-2 focus:outline-none focus:border-brand-primary"
                                        >
                                            <option value="en">English</option>
                                            <option value="sw">Swahili</option>
                                            <option value="fr">French</option>
                                            <option value="ar">Arabic</option>
                                            <option value="pt">Portuguese</option>
                                        </select>
                                    </SettingRow>

                                    {/* Info note about translations */}
                                    <div className="p-4 bg-brand-primary/10 border border-brand-primary/20 rounded-lg">
                                        <p className="text-sm text-brand-text">
                                            <span className="font-semibold text-brand-primary">Coming Soon:</span> Full translations are in development. Your language preference will be saved and applied as translations become available.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Account Section */}
                        {activeSection === 'account' && (
                            <div className="space-y-6">
                                <div className="bg-brand-surface border border-brand-text/10 rounded-xl p-6">
                                    <h2 className="text-xl font-bold text-brand-text mb-6 flex items-center gap-2">
                                        <User className="w-5 h-5 text-brand-primary" />
                                        Account
                                    </h2>
                                    <div className="space-y-4">
                                        <Link
                                            to="/profile"
                                            className="flex items-center justify-between p-4 bg-brand-dark/50 rounded-lg hover:bg-brand-dark transition-colors group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full overflow-hidden bg-brand-primary/20 flex items-center justify-center shrink-0">
                                                    {user?.photoURL ? (
                                                        <img src={user.photoURL} alt={user.firstName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-xl font-bold text-brand-primary">
                                                            {user?.firstName?.charAt(0) || 'U'}
                                                        </span>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-brand-text font-medium text-lg">
                                                            {user?.firstName && user?.lastName
                                                                ? `${user.firstName} ${user.lastName}`
                                                                : user?.firstName || 'User'}
                                                        </p>
                                                        {user?.authProvider === 'google' ? (
                                                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white bg-[#4285F4] rounded-full">
                                                                Google
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-dark bg-brand-primary rounded-full">
                                                                Email
                                                            </span>
                                                        )}
                                                        {user?.role === 'admin' && (
                                                            <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-900 bg-gradient-to-r from-green-400 to-green-300 rounded-full shrink-0 shadow-[0_0_10px_rgba(74,222,128,0.3)]">
                                                                <ShieldCheck className="w-3 h-3" />
                                                                Verified Admin
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-brand-muted">{user?.email || 'No email provided'}</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-brand-muted group-hover:text-brand-text transition-colors" />
                                        </Link>

                                        <button
                                            onClick={handleExportData}
                                            className="w-full flex items-center justify-between p-4 bg-brand-dark/50 rounded-lg hover:bg-brand-dark transition-colors group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-brand-surface flex items-center justify-center">
                                                    <Download className="w-5 h-5 text-brand-primary" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-brand-text font-medium">Export Data</p>
                                                    <p className="text-sm text-brand-muted">Download all your account data</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-brand-muted group-hover:text-brand-text transition-colors" />
                                        </button>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center justify-between p-4 bg-brand-dark/50 rounded-lg hover:bg-brand-dark transition-colors group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                                                    <LogOut className="w-5 h-5 text-red-400" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-red-400 font-medium">Sign Out</p>
                                                    <p className="text-sm text-brand-muted">Log out of your account</p>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                {/* Database Management (for admins/devs) */}
                                {user && (
                                    <div className="bg-brand-surface border border-purple-500/20 rounded-xl p-6">
                                        <h2 className="text-xl font-bold text-purple-400 mb-6 flex items-center gap-2">
                                            <Database className="w-5 h-5" />
                                            Developer Tools
                                        </h2>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-brand-dark/50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <Database className="w-5 h-5 text-purple-400" />
                                                    <div>
                                                        <p className="font-medium text-brand-text">Database Management</p>
                                                        <p className="text-sm text-brand-muted">Initialize or reset course content</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={async () => {
                                                        try {
                                                            const result = await seedCourses();
                                                            if (result.success) {
                                                                success(`Successfully seeded ${result.count} courses!`);
                                                            } else {
                                                                error('Seeding failed: ' + result.error);
                                                            }
                                                        } catch (error) {
                                                            error('Seeding failed');
                                                        }
                                                    }}
                                                    className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
                                                >
                                                    Seed Database
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Danger Zone */}
                                <div className="bg-brand-surface border border-red-500/20 rounded-xl p-6">
                                    <h2 className="text-xl font-bold text-red-400 mb-6 flex items-center gap-2">
                                        <Trash2 className="w-5 h-5" />
                                        Danger Zone
                                    </h2>
                                    <div className="space-y-4">
                                        {!showDeleteConfirm ? (
                                            <button
                                                onClick={() => setShowDeleteConfirm(true)}
                                                className="flex items-center gap-3 px-4 py-3 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                                <span>Delete Account</span>
                                            </button>
                                        ) : (
                                            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                                                <p className="text-red-400 font-medium mb-3">Are you sure? This action cannot be undone.</p>
                                                <p className="text-sm text-brand-muted mb-4">
                                                    This will permanently delete your account, all your progress, certificates, and personal data.
                                                </p>
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => {
                                                            // In a real app, this would call an API
                                                            error('Account deletion is disabled in demo mode');
                                                            setShowDeleteConfirm(false);
                                                        }}
                                                        className="px-4 py-2 bg-red-500 text-brand-dark font-bold rounded-lg hover:bg-red-600 transition-colors"
                                                    >
                                                        Yes, Delete My Account
                                                    </button>
                                                    <button
                                                        onClick={() => setShowDeleteConfirm(false)}
                                                        className="px-4 py-2 border border-brand-text/20 text-brand-text rounded-lg hover:bg-brand-text/10 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
