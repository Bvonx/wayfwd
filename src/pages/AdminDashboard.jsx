import React, { useState, useEffect, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { ShieldAlert, Users, BookOpen, Database, Activity, LayoutDashboard, Plus, Settings as SettingsIcon } from 'lucide-react';
import { seedCourses } from '../admin/seedCourses';
import { useToast } from '../components/Toast';

const AdminDashboard = () => {
    const { user } = useAuth();
    const { success, error } = useToast();
    const [isSeeding, setIsSeeding] = useState(false);
    const [stats, setStats] = useState({ users: 0, courses: 0, completions: 0, health: 99.9 });
    const [recentCourses, setRecentCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchDashboardData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Fetch Users
            const usersSnap = await getDocs(collection(db, 'users'));
            const usersCount = usersSnap.size;

            // Fetch Courses
            const coursesSnap = await getDocs(collection(db, 'courses'));
            const coursesData = coursesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const coursesCount = coursesSnap.size;

            // Fetch User Progress (for completions count)
            const progressSnap = await getDocs(collection(db, 'userProgress'));
            let totalCompletions = 0;
            progressSnap.forEach(doc => {
                const data = doc.data();
                if (data.completedModules) {
                    Object.values(data.completedModules).forEach(modules => {
                        if (Array.isArray(modules)) {
                            totalCompletions += modules.length;
                        }
                    });
                }
            });

            setStats({
                users: usersCount,
                courses: coursesCount,
                completions: totalCompletions,
                health: 99.9
            });

            // Display recent courses
            setRecentCourses(coursesData.slice(0, 5));
        } catch (err) {
            console.error("Error fetching admin stats:", err);
            error("Failed to load live dashboard metrics.");
        } finally {
            setIsLoading(false);
        }
    }, [error]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const handleSeedDatabase = async () => {
        setIsSeeding(true);
        try {
            const result = await seedCourses();
            if (result.success) {
                success(`Successfully seeded ${result.count} courses!`);
                await fetchDashboardData();
            } else {
                error('Seeding failed: ' + result.error);
            }
        } catch (err) {
            error('Database seeding failed');
            console.error(err);
        } finally {
            setIsSeeding(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-brand-dark overflow-hidden">
            {/* Background Video */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-40 mix-blend-screen pointer-events-none"
                >
                    <source src="/videos/Gtr_liberty_floating_rotating_air_delpmaspu_.mp4" type="video/mp4" />
                </video>
                {/* Overlay to ensure readability */}
                <div className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm"></div>
            </div>

            <div className="relative z-10 pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Header */}
                    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-brand-text mb-2 flex items-center gap-3">
                                <ShieldAlert className="w-8 h-8 text-purple-500" />
                                Admin Space
                            </h1>
                            <p className="text-brand-muted">
                                Welcome back, {user?.firstName}. Manage courses, users, and system settings.
                            </p>
                        </div>

                        <button className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-brand-dark font-medium rounded-lg hover:bg-cyan-400 transition-colors">
                            <Plus className="w-5 h-5" />
                            Create New Course
                        </button>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="bg-brand-surface/40 backdrop-blur-md border border-brand-text/10 rounded-xl p-6 relative overflow-hidden group hover:border-brand-primary/50 transition-colors">
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="p-3 bg-blue-500/20 rounded-lg shrink-0">
                                    <Users className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-brand-muted font-medium">Total Users</p>
                                    <p className="text-2xl font-bold text-brand-text">{isLoading ? '...' : stats.users.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                                <Users className="w-24 h-24" />
                            </div>
                        </div>

                        <div className="bg-brand-surface/40 backdrop-blur-md border border-brand-text/10 rounded-xl p-6 relative overflow-hidden group hover:border-brand-primary/50 transition-colors">
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="p-3 bg-purple-500/20 rounded-lg shrink-0">
                                    <BookOpen className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-brand-muted font-medium">Active Courses</p>
                                    <p className="text-2xl font-bold text-brand-text">{isLoading ? '...' : stats.courses.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                                <BookOpen className="w-24 h-24" />
                            </div>
                        </div>

                        <div className="bg-brand-surface/40 backdrop-blur-md border border-brand-text/10 rounded-xl p-6 relative overflow-hidden group hover:border-brand-primary/50 transition-colors">
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="p-3 bg-green-500/20 rounded-lg shrink-0">
                                    <Activity className="w-6 h-6 text-green-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-brand-muted font-medium">Course Completions</p>
                                    <p className="text-2xl font-bold text-brand-text">{isLoading ? '...' : stats.completions.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                                <Activity className="w-24 h-24" />
                            </div>
                        </div>

                        <div className="bg-brand-surface/40 backdrop-blur-md border border-brand-text/10 rounded-xl p-6 relative overflow-hidden group hover:border-brand-primary/50 transition-colors">
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="p-3 bg-yellow-500/20 rounded-lg shrink-0">
                                    <LayoutDashboard className="w-6 h-6 text-yellow-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-brand-muted font-medium">System Health</p>
                                    <p className="text-2xl font-bold text-brand-text">{stats.health}%</p>
                                </div>
                            </div>
                            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                                <LayoutDashboard className="w-24 h-24" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content Area */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Course Management Section */}
                            <div className="bg-brand-surface/40 backdrop-blur-md rounded-xl border border-brand-text/10 overflow-hidden">
                                <div className="p-6 border-b border-brand-text/10 flex justify-between items-center bg-brand-dark/30">
                                    <h2 className="text-xl font-bold text-brand-text flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-brand-primary" />
                                        Recent Courses
                                    </h2>
                                    <button className="text-sm text-brand-primary hover:text-cyan-400 transition-colors">
                                        View All
                                    </button>
                                </div>
                                <div className="p-6">
                                    <p className="text-brand-muted mb-4">You can manage courses here. Displaying recently added modules.</p>
                                    <div className="space-y-4">
                                        {isLoading ? (
                                            <div className="text-brand-muted text-center py-4">Loading courses...</div>
                                        ) : recentCourses.length > 0 ? (
                                            recentCourses.map((course, idx) => (
                                                <div key={course.id || idx} className="flex items-center justify-between p-4 bg-brand-dark/50 rounded-lg border border-brand-text/5 hover:border-brand-primary/30 transition-colors cursor-pointer group">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-lg bg-brand-surface flex items-center justify-center shrink-0">
                                                            <BookOpen className="w-6 h-6 text-brand-muted group-hover:text-brand-primary transition-colors" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-brand-text group-hover:text-cyan-400 transition-colors">{course.title}</p>
                                                            <p className="text-sm text-brand-muted">{course.modules?.length || 0} Modules • {course.difficulty || 'Beginner'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button className="p-2 text-brand-muted hover:text-brand-primary transition-colors">
                                                            Edit
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-brand-muted text-center py-4">No courses active. Try seeding the database!</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Area */}
                        <div className="space-y-8">
                            {/* Database Tools */}
                            <div className="bg-brand-surface/40 backdrop-blur-md rounded-xl border border-purple-500/20 overflow-hidden">
                                <div className="p-6 border-b border-brand-text/10 bg-purple-500/5">
                                    <h2 className="text-lg font-bold text-purple-400 flex items-center gap-2">
                                        <Database className="w-5 h-5" />
                                        Database Commands
                                    </h2>
                                </div>
                                <div className="p-6 space-y-4">
                                    <p className="text-sm text-brand-muted">
                                        Execute system-wide database commands. Use with caution.
                                    </p>

                                    <div className="p-4 bg-brand-dark rounded-lg border border-brand-text/10">
                                        <p className="font-medium text-brand-text mb-1">Seed Courses</p>
                                        <p className="text-xs text-brand-muted mb-4">Initializes or updates the Firestore database with the predefined courses.</p>
                                        <button
                                            onClick={handleSeedDatabase}
                                            disabled={isSeeding}
                                            className="w-full py-2 bg-purple-500/20 text-purple-400 font-medium rounded-lg border border-purple-500/30 hover:bg-purple-500/30 transition-colors disabled:opacity-50 flex justify-center items-center"
                                        >
                                            {isSeeding ? (
                                                <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                "Seed Database"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Settings */}
                            <div className="bg-brand-surface/40 backdrop-blur-md rounded-xl border border-brand-text/10 overflow-hidden">
                                <div className="p-6 border-b border-brand-text/10">
                                    <h2 className="text-lg font-bold text-brand-text flex items-center gap-2">
                                        <SettingsIcon className="w-5 h-5 text-brand-muted" />
                                        System Settings
                                    </h2>
                                </div>
                                <div className="p-0">
                                    <button className="w-full flex items-center justify-between p-4 hover:bg-brand-dark/50 transition-colors border-b border-brand-text/5 text-left">
                                        <span className="text-brand-text">Manage Users</span>
                                        <Users className="w-4 h-4 text-brand-muted" />
                                    </button>
                                    <button className="w-full flex items-center justify-between p-4 hover:bg-brand-dark/50 transition-colors border-b border-brand-text/5 text-left">
                                        <span className="text-brand-text">Global Platform Settings</span>
                                        <SettingsIcon className="w-4 h-4 text-brand-muted" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
