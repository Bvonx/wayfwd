import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../contexts/ProgressContext';
import { useToast } from '../components/Toast';
import { COURSES } from '../data/courses';
import {
    User,
    Mail,
    Calendar,
    LogOut,
    Shield,
    Award,
    BookOpen,
    ChevronRight,
    Settings,
    Lock,
    ShieldCheck
} from 'lucide-react';

const Profile = () => {
    const { user, logout, updateUser } = useAuth();
    const { progress, getCourseProgress, resetProgress } = useProgress();
    const { success, error } = useToast();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || ''
    });

    const handleLogout = () => {
        logout();
        success('You have been logged out');
        navigate('/');
    };

    const handleSave = async () => {
        if (!formData.firstName.trim()) {
            error('First name is required');
            return;
        }

        try {
            await updateUser({
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim()
            });
            setIsEditing(false);
            success('Profile updated successfully');
        } catch (err) {
            error('Failed to update profile');
            console.error(err);
        }
    };

    const handleResetProgress = () => {
        if (window.confirm('Are you sure you want to reset all your learning progress? This cannot be undone.')) {
            resetProgress();
            success('Progress has been reset');
        }
    };

    // Calculate overall stats
    const totalModulesCompleted = Object.values(progress.completedModules)
        .reduce((acc, set) => acc + set.size, 0);

    const averageScore = Object.values(progress.quizScores).length > 0
        ? Math.round(Object.values(progress.quizScores).reduce((a, b) => a + b, 0) / Object.values(progress.quizScores).length)
        : 0;

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Conditional Background Video for Admin */}
            {user?.role === 'admin' && (
                <div className="absolute inset-0 z-0">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover opacity-40 mix-blend-screen pointer-events-none"
                    >
                        <source src="/videos/GTR_Liberty_Showroom_Video.mp4" type="video/mp4" />
                    </video>
                    {/* Overlay to ensure readability */}
                    <div className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm"></div>
                </div>
            )}

            <div className="relative z-10 pt-24 pb-12">
                <div className="max-w-4xl mx-auto px-6 py-12">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
                        <div>
                            <h1 className="text-3xl font-display font-bold text-brand-text mb-2">Profile Settings</h1>
                            <p className="text-brand-muted">Manage your account and track your progress</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Profile Card */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-brand-surface/40 backdrop-blur-md border border-brand-text/10 rounded-xl p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-brand-text">Account Information</h2>
                                    {!isEditing && (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="text-brand-primary text-sm font-medium hover:text-cyan-400 transition-colors"
                                        >
                                            Edit
                                        </button>
                                    )}
                                </div>

                                {isEditing ? (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-brand-text mb-2">First Name</label>
                                                <input
                                                    type="text"
                                                    value={formData.firstName}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                                                    className="w-full bg-brand-dark border border-brand-text/10 rounded-lg px-4 py-3 text-brand-text focus:outline-none focus:border-brand-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-brand-text mb-2">Last Name</label>
                                                <input
                                                    type="text"
                                                    value={formData.lastName}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                                                    className="w-full bg-brand-dark border border-brand-text/10 rounded-lg px-4 py-3 text-brand-text focus:outline-none focus:border-brand-primary"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={handleSave}
                                                className="px-4 py-2 bg-brand-primary text-brand-dark font-bold rounded-lg hover:bg-cyan-400 transition-colors"
                                            >
                                                Save Changes
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setFormData({
                                                        firstName: user?.firstName || '',
                                                        lastName: user?.lastName || ''
                                                    });
                                                }}
                                                className="px-4 py-2 border border-brand-text/20 text-brand-text rounded-lg hover:bg-brand-text/10 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 p-4 bg-brand-dark/50 rounded-lg">
                                            <div className="w-16 h-16 bg-brand-primary/20 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                                                {user?.photoURL ? (
                                                    <img src={user.photoURL} alt={user.firstName} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-2xl font-bold text-brand-primary">
                                                        {user?.firstName?.charAt(0) || 'U'}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="text-lg font-bold text-brand-text break-words">
                                                        {user?.firstName && user?.lastName
                                                            ? `${user.firstName} ${user.lastName}`
                                                            : user?.firstName || 'User'}
                                                    </h3>
                                                    {user?.authProvider === 'google' ? (
                                                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white bg-[#4285F4] rounded-full shrink-0">
                                                            Google
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-dark bg-brand-primary rounded-full shrink-0">
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
                                                <span className={`inline-block px-2 py-1 text-xs font-bold rounded-full ${user?.tier === 'pro'
                                                    ? 'bg-brand-secondary/20 text-brand-secondary'
                                                    : 'bg-brand-primary/20 text-brand-primary'
                                                    }`}>
                                                    {user?.tier === 'pro' ? 'Pro Member' : 'Community Member'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="flex items-center gap-3 text-brand-text">
                                                <Mail className="w-5 h-5 text-brand-muted shrink-0" />
                                                <span className="truncate">{user?.email || 'No email provided'}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-brand-text">
                                                <Calendar className="w-5 h-5 text-brand-muted shrink-0" />
                                                <span>Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Security Section */}
                            <div className="bg-brand-surface/40 backdrop-blur-md border border-brand-text/10 rounded-xl p-6">
                                <h2 className="text-xl font-bold text-brand-text mb-6">Security</h2>
                                <div className="space-y-4">
                                    {/* 2FA Section */}
                                    <div className="p-4 bg-brand-dark/50 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Shield className={`w-5 h-5 ${user?.twoFactorEnabled ? 'text-green-500' : 'text-brand-muted'}`} />
                                                <div>
                                                    <span className="text-brand-text">Two-Factor Authentication</span>
                                                    <p className="text-xs text-brand-muted mt-0.5">
                                                        {user?.twoFactorEnabled
                                                            ? 'Extra layer of security enabled'
                                                            : 'Add extra security to your account'
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            {user?.twoFactorEnabled ? (
                                                <span className="px-3 py-1 text-xs font-bold text-green-500 bg-green-500/10 rounded-full">
                                                    Enabled
                                                </span>
                                            ) : (
                                                <Link
                                                    to="/setup-2fa"
                                                    className="px-3 py-1 text-xs font-bold text-brand-primary bg-brand-primary/10 rounded-full hover:bg-brand-primary/20 transition-colors"
                                                >
                                                    Enable
                                                </Link>
                                            )}
                                        </div>
                                    </div>

                                    <button className="w-full flex items-center justify-between p-4 bg-brand-dark/50 rounded-lg hover:bg-brand-dark transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <Lock className="w-5 h-5 text-brand-muted" />
                                            <span className="text-brand-text">Change Password</span>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-brand-muted group-hover:text-brand-text transition-colors" />
                                    </button>
                                </div>
                            </div>

                            {/* Danger Zone */}
                            <div className="bg-brand-surface/40 backdrop-blur-md border border-red-500/20 rounded-xl p-6">
                                <h2 className="text-xl font-bold text-red-400 mb-4">Danger Zone</h2>
                                <button
                                    onClick={handleResetProgress}
                                    className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm"
                                >
                                    Reset All Progress
                                </button>
                            </div>
                        </div>

                        {/* Stats Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-brand-surface/40 backdrop-blur-md border border-brand-text/10 rounded-xl p-6">
                                <h2 className="text-lg font-bold text-brand-text mb-6">Your Stats</h2>
                                <div className="space-y-6">
                                    <div className="text-center p-4 bg-brand-dark/50 rounded-lg">
                                        <div className="text-3xl font-bold text-brand-primary mb-1">
                                            {totalModulesCompleted}
                                        </div>
                                        <div className="text-sm text-brand-muted">Modules Completed</div>
                                    </div>
                                    <div className="text-center p-4 bg-brand-dark/50 rounded-lg">
                                        <div className="text-3xl font-bold text-brand-secondary mb-1">
                                            {averageScore}%
                                        </div>
                                        <div className="text-sm text-brand-muted">Average Quiz Score</div>
                                    </div>
                                </div>
                            </div>

                            {/* Course Progress */}
                            <div className="bg-brand-surface/40 backdrop-blur-md border border-brand-text/10 rounded-xl p-6">
                                <h2 className="text-lg font-bold text-brand-text mb-6">Course Progress</h2>
                                <div className="space-y-4">
                                    {COURSES.map(course => {
                                        const { completed, total, percentage } = getCourseProgress(course.id, course.modules.length);
                                        return (
                                            <Link
                                                key={course.id}
                                                to={`/lesson/${course.id}`}
                                                className="block p-3 bg-brand-dark/50 rounded-lg hover:bg-brand-dark transition-colors"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-brand-text truncate">{course.title}</span>
                                                    <span className="text-xs text-brand-muted">{completed}/{total}</span>
                                                </div>
                                                <div className="h-2 bg-brand-surface rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full transition-all"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Upgrade CTA */}
                            {user?.tier !== 'pro' && (
                                <div className="backdrop-blur-md bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 border border-brand-primary/30 rounded-xl p-6 text-center">
                                    <Award className="w-10 h-10 text-brand-secondary mx-auto mb-3" />
                                    <h3 className="font-bold text-brand-text mb-2">Upgrade to Pro</h3>
                                    <p className="text-sm text-brand-muted mb-4">
                                        Unlock all courses, labs, and unlimited AI access
                                    </p>
                                    <Link
                                        to="/pricing"
                                        className="inline-block px-4 py-2 bg-brand-primary text-brand-dark font-bold rounded-lg hover:bg-cyan-400 transition-colors text-sm"
                                    >
                                        View Plans
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
