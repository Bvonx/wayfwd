import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ProgressChart from '../components/charts/ProgressChart';
import RadarChart from '../components/charts/RadarChart';
import StreakCalendar from '../components/StreakCalendar';
import {
    BarChart3,
    Clock,
    BookOpen,
    Trophy,
    Target,
    Flame,
    TrendingUp,
    Award
} from 'lucide-react';

const Analytics = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const fetchAnalytics = async () => {
            try {
                const data = await api.getAnalytics(user.id);
                setAnalytics(data);
            } catch (err) {
                console.error('Failed to fetch analytics:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalytics();
    }, [user, isAuthenticated, navigate]);

    if (isLoading) {
        return (
            <div className="pt-24 min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" text="Loading analytics..." />
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="pt-24 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-brand-text mb-4">Unable to load analytics</h2>
                    <Link to="/courses" className="text-brand-primary hover:text-cyan-400">
                        Go to Courses
                    </Link>
                </div>
            </div>
        );
    }

    const formatTime = (minutes) => {
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    };

    // Prepare chart data
    const weeklyData = analytics.activityData.slice(-7).map(d => ({
        label: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
        value: d.minutes
    }));

    const skillsData = Object.entries(analytics.skills).map(([key, value]) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        value
    }));

    return (
        <div className="pt-24 min-h-screen pb-12">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-brand-text mb-2 flex items-center gap-3">
                        <BarChart3 className="w-8 h-8 text-brand-primary" />
                        Learning Analytics
                    </h1>
                    <p className="text-brand-muted">
                        Track your progress and see how you're improving over time.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-brand-surface border border-brand-text/10 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-brand-primary/20 rounded-lg">
                                <Clock className="w-5 h-5 text-brand-primary" />
                            </div>
                            <span className="text-sm text-brand-muted">Learning Time</span>
                        </div>
                        <p className="text-2xl font-bold text-brand-text">
                            {formatTime(analytics.totalLearningMinutes)}
                        </p>
                    </div>

                    <div className="bg-brand-surface border border-brand-text/10 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-green-500/20 rounded-lg">
                                <BookOpen className="w-5 h-5 text-green-500" />
                            </div>
                            <span className="text-sm text-brand-muted">Modules Done</span>
                        </div>
                        <p className="text-2xl font-bold text-brand-text">
                            {analytics.completedModules}
                        </p>
                    </div>

                    <div className="bg-brand-surface border border-brand-text/10 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-yellow-500/20 rounded-lg">
                                <Target className="w-5 h-5 text-yellow-500" />
                            </div>
                            <span className="text-sm text-brand-muted">Avg. Quiz Score</span>
                        </div>
                        <p className="text-2xl font-bold text-brand-text">
                            {analytics.averageQuizScore}%
                        </p>
                    </div>

                    <div className="bg-brand-surface border border-brand-text/10 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-orange-500/20 rounded-lg">
                                <Flame className="w-5 h-5 text-orange-500" />
                            </div>
                            <span className="text-sm text-brand-muted">Current Streak</span>
                        </div>
                        <p className="text-2xl font-bold text-brand-text">
                            {analytics.currentStreak} days
                        </p>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Weekly Activity */}
                    <div className="bg-brand-surface border border-brand-text/10 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-brand-text mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-brand-primary" />
                            This Week's Activity
                        </h3>
                        <ProgressChart
                            data={weeklyData}
                            height={180}
                            color="brand-primary"
                        />
                    </div>

                    {/* Skills Radar */}
                    <div className="bg-brand-surface border border-brand-text/10 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-brand-text mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5 text-brand-secondary" />
                            Skill Distribution
                        </h3>
                        <div className="flex justify-center">
                            <RadarChart
                                data={skillsData}
                                size={220}
                            />
                        </div>
                    </div>
                </div>

                {/* Streak Calendar */}
                <div className="bg-brand-surface border border-brand-text/10 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-bold text-brand-text mb-4 flex items-center gap-2">
                        <Flame className="w-5 h-5 text-orange-500" />
                        Activity Calendar
                    </h3>
                    <div className="overflow-x-auto">
                        <StreakCalendar
                            data={analytics.activityData}
                            weeks={12}
                        />
                    </div>
                    <div className="mt-4 pt-4 border-t border-brand-text/10 flex items-center justify-between text-sm">
                        <span className="text-brand-muted">
                            Longest streak: <span className="text-brand-text font-bold">{analytics.longestStreak} days</span>
                        </span>
                        <span className="text-brand-muted">
                            Total active days: <span className="text-brand-text font-bold">
                                {analytics.activityData.filter(d => d.minutes > 0).length}
                            </span>
                        </span>
                    </div>
                </div>

                {/* Achievements Section */}
                <div className="bg-brand-surface border border-brand-text/10 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-brand-text mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-brand-secondary" />
                        Achievements
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className={`p-4 rounded-lg text-center ${analytics.completedModules >= 1
                            ? 'bg-yellow-500/20 border border-yellow-500/30'
                            : 'bg-brand-text/5 border border-brand-text/10 opacity-50'
                            }`}>
                            <div className="text-3xl mb-2">🎯</div>
                            <p className="font-semibold text-brand-text text-sm">First Step</p>
                            <p className="text-xs text-brand-muted">Complete 1 module</p>
                        </div>
                        <div className={`p-4 rounded-lg text-center ${analytics.completedCourses >= 1
                            ? 'bg-green-500/20 border border-green-500/30'
                            : 'bg-brand-text/5 border border-brand-text/10 opacity-50'
                            }`}>
                            <div className="text-3xl mb-2">🏆</div>
                            <p className="font-semibold text-brand-text text-sm">Course Master</p>
                            <p className="text-xs text-brand-muted">Complete a course</p>
                        </div>
                        <div className={`p-4 rounded-lg text-center ${analytics.currentStreak >= 7
                            ? 'bg-orange-500/20 border border-orange-500/30'
                            : 'bg-brand-text/5 border border-brand-text/10 opacity-50'
                            }`}>
                            <div className="text-3xl mb-2">🔥</div>
                            <p className="font-semibold text-brand-text text-sm">On Fire</p>
                            <p className="text-xs text-brand-muted">7 day streak</p>
                        </div>
                        <div className={`p-4 rounded-lg text-center ${analytics.averageQuizScore >= 90
                            ? 'bg-purple-500/20 border border-purple-500/30'
                            : 'bg-brand-text/5 border border-brand-text/10 opacity-50'
                            }`}>
                            <div className="text-3xl mb-2">🧠</div>
                            <p className="font-semibold text-brand-text text-sm">Quiz Master</p>
                            <p className="text-xs text-brand-muted">90%+ avg score</p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-8 text-center">
                    <Link
                        to="/courses"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-brand-dark font-bold rounded-full hover:bg-cyan-400 transition-colors"
                    >
                        <BookOpen className="w-4 h-4" />
                        Continue Learning
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
