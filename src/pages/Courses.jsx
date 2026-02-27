import React from 'react';
import { Link } from 'react-router-dom';
import { useProgress } from '../contexts/ProgressContext';
import { useAuth } from '../contexts/AuthContext';
import { COURSES } from '../data/courses';
import { CheckCircle, Lock, Sparkles } from 'lucide-react';

const Courses = () => {
    const { getCourseProgress, progress } = useProgress();
    const { isAuthenticated } = useAuth();
    const courses = COURSES; // Use local data for instant load

    if (!isAuthenticated) {
        return (
            <div className="pt-24 min-h-screen flex flex-col pt-32">
                <div className="max-w-7xl mx-auto px-6 py-12 w-full">
                    <div className="bg-brand-surface rounded-xl border border-brand-text/10 overflow-hidden max-w-3xl mx-auto shadow-2xl">
                        <div className="p-12 text-center">
                            <div className="w-20 h-20 mx-auto mb-6 bg-brand-primary/20 rounded-full flex items-center justify-center">
                                <Lock className="w-10 h-10 text-brand-primary" />
                            </div>
                            <h2 className="text-2xl font-bold text-brand-text mb-4">Sign In to Access the Course Catalog</h2>
                            <p className="text-brand-muted mb-8 max-w-md mx-auto">
                                Create a free account to access our curriculum, track your progress, and earn certificates.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    to="/signup"
                                    className="px-8 py-3 bg-brand-primary text-brand-dark font-bold rounded-full hover:bg-cyan-400 transition-colors"
                                >
                                    Create Free Account
                                </Link>
                                <Link
                                    to="/login"
                                    className="px-8 py-3 border border-brand-text/20 text-brand-text font-medium rounded-full hover:bg-brand-text/10 transition-colors"
                                >
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 min-h-screen">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-text mb-4">
                        Course Catalog
                    </h1>
                    <p className="text-brand-muted max-w-2xl text-lg">
                        From your first command to advanced penetration testing. Our curriculum is designed
                        to take you from novice to pro, with a focus on defense and ethical practice.
                    </p>
                </div>

                {/* Continue Learning Section */}
                {isAuthenticated && progress.lastAccessedCourse && (
                    <div className="mb-12">
                        <h2 className="text-xl font-bold text-brand-text mb-4 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-brand-secondary" />
                            Continue Learning
                        </h2>
                        {(() => {
                            const lastCourse = courses.find(c => c.id === progress.lastAccessedCourse);
                            if (!lastCourse) return null;
                            const { completed, total, percentage } = getCourseProgress(lastCourse.id, lastCourse.modules.length);

                            return (
                                <Link
                                    to={`/lesson/${lastCourse.id}`}
                                    className="block bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 border border-brand-primary/30 rounded-xl p-6 hover:border-brand-primary transition-all group"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <span className="text-xs font-bold text-brand-secondary uppercase tracking-wider mb-2 block">
                                                {lastCourse.level}
                                            </span>
                                            <h3 className="text-2xl font-bold text-brand-text group-hover:text-brand-primary transition-colors">
                                                {lastCourse.title}
                                            </h3>
                                            <p className="text-brand-muted mt-1">{lastCourse.description}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <div className="text-right">
                                                <span className="text-2xl font-bold text-brand-primary">{percentage}%</span>
                                                <span className="text-brand-muted text-sm ml-2">complete</span>
                                            </div>
                                            <div className="w-48 h-2 bg-brand-dark rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-brand-muted">{completed}/{total} modules</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })()}
                    </div>
                )}

                {/* All Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => {
                        const { percentage } = getCourseProgress(course.id, course.modules?.length || 0);
                        const isComplete = percentage === 100;

                        return (
                            <Link key={course.id} to={`/lesson/${course.id}`} className="block group">
                                <div className="relative bg-brand-surface rounded-2xl overflow-hidden border border-brand-text/5 hover:border-brand-primary/50 transition-all hover:-translate-y-1">
                                    {/* Completion Badge */}
                                    {isComplete && (
                                        <div className="absolute top-4 right-4 z-10">
                                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                                <CheckCircle className="w-5 h-5 text-brand-text" />
                                            </div>
                                        </div>
                                    )}

                                    <div className="p-6">
                                        <span className="inline-block px-3 py-1 text-xs font-bold text-brand-dark bg-brand-secondary rounded-full mb-3">
                                            {course.level}
                                        </span>
                                        <h3 className="text-xl font-bold text-brand-text mb-2 group-hover:text-brand-primary transition-colors">
                                            {course.title}
                                        </h3>
                                        <p className="text-brand-muted text-sm leading-relaxed mb-4">
                                            {course.description}
                                        </p>

                                        {/* Progress Bar */}
                                        {isAuthenticated && percentage > 0 && (
                                            <div className="mt-4">
                                                <div className="flex justify-between text-xs text-brand-muted mb-1">
                                                    <span>Progress</span>
                                                    <span>{percentage}%</span>
                                                </div>
                                                <div className="h-1.5 bg-brand-dark rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full transition-all"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Module count */}
                                        <div className="mt-4 pt-4 border-t border-brand-text/5 flex items-center justify-between">
                                            <span className="text-sm text-brand-muted">
                                                {course.modules.length} modules
                                            </span>
                                            <span className="text-brand-primary text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                                                {percentage > 0 && percentage < 100 ? 'Continue' : percentage === 100 ? 'Review' : 'Start'} →
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}

                    {/* Coming Soon Card */}
                    <div className="relative bg-brand-surface/50 border border-brand-text/5 rounded-xl p-6 flex flex-col items-center justify-center text-center group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10">
                            <Lock className="w-10 h-10 text-brand-muted mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-brand-text mb-2">Web App Penetration Testing</h3>
                            <p className="text-brand-muted text-sm mb-4">Coming Soon to Pro Academy</p>
                            <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-xs font-bold rounded-full border border-brand-primary/20">
                                Advanced
                            </span>
                        </div>
                    </div>

                    {/* More Coming Soon */}
                    <div className="relative bg-brand-surface/50 border border-brand-text/5 rounded-xl p-6 flex flex-col items-center justify-center text-center group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10">
                            <Lock className="w-10 h-10 text-brand-muted mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-brand-text mb-2">SOC Analyst Fundamentals</h3>
                            <p className="text-brand-muted text-sm mb-4">Coming Soon to Pro Academy</p>
                            <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-xs font-bold rounded-full border border-brand-primary/20">
                                Intermediate
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Courses;
