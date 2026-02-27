import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { COURSES } from '../data/courses';

import LoadingSpinner from '../components/LoadingSpinner';
import { useProgress } from '../contexts/ProgressContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import { api } from '../services/api';
import {
    CheckCircle,
    XCircle,
    ArrowRight,
    ArrowLeft,
    BookOpen,
    Trophy,
    ChevronLeft,
    Home,
    Award
} from 'lucide-react';

// Enhanced markdown renderer with better styling
const MarkdownRenderer = ({ content }) => {
    return (
        <div className="prose prose-invert max-w-none">
            {content.split('\n').map((line, i) => {
                const trimmed = line.trim();
                if (trimmed.startsWith('###')) {
                    return (
                        <h3 key={i} className="text-xl font-bold text-brand-text mt-6 mb-3">
                            {trimmed.replace('###', '').trim()}
                        </h3>
                    );
                }
                if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
                    return (
                        <p key={i} className="text-brand-primary font-semibold my-2">
                            {trimmed.replace(/\*\*/g, '')}
                        </p>
                    );
                }
                if (trimmed.startsWith('-')) {
                    return (
                        <li key={i} className="ml-4 text-brand-text mb-1 list-disc list-inside">
                            {trimmed.replace('-', '').trim()}
                        </li>
                    );
                }
                if (trimmed.match(/^\d+\./)) {
                    return (
                        <li key={i} className="ml-4 text-brand-text mb-1 list-decimal list-inside">
                            {trimmed.replace(/^\d+\./, '').trim()}
                        </li>
                    );
                }
                if (trimmed === '') return null;

                // Handle inline code
                const withCode = trimmed.replace(/`([^`]+)`/g, '<code class="bg-brand-dark px-2 py-0.5 rounded text-brand-primary font-mono text-sm">$1</code>');
                return (
                    <p key={i} className="text-brand-text mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: withCode }} />
                );
            })}
        </div>
    );
};

const Lesson = () => {
    const { courseId } = useParams();
    const { markModuleComplete, isModuleComplete, getQuizScore, setLastAccessed } = useProgress();
    const { user, isAuthenticated } = useAuth();
    const { success } = useToast();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch course data from local file
    useEffect(() => {
        const foundCourse = COURSES.find(c => c.id === courseId);
        if (foundCourse) {
            setCourse(foundCourse);
        }
        setLoading(false);
    }, [courseId]);

    const [activeModuleIndex, setActiveModuleIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);
    const [certificate, setCertificate] = useState(null);

    // Update last accessed on mount
    useEffect(() => {
        if (course) {
            setLastAccessed(course.id, course.modules[activeModuleIndex]?.id);
        }
    }, [course, activeModuleIndex, setLastAccessed]);

    if (loading) return <LoadingSpinner />;

    if (!course) {
        return (
            <div className="pt-24 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-brand-text mb-4">Course Not Found</h1>
                    <p className="text-brand-muted mb-8">The course you're looking for doesn't exist.</p>
                    <Link
                        to="/courses"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-brand-dark font-bold rounded-lg hover:bg-cyan-400 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Browse Courses
                    </Link>
                </div>
            </div>
        );
    }

    const activeModule = course.modules[activeModuleIndex];

    const handleOptionSelect = (questionIndex, optionIndex) => {
        if (showResults) return;
        setAnswers(prev => ({
            ...prev,
            [questionIndex]: optionIndex
        }));
    };

    const calculateScore = () => {
        if (!activeModule.quiz) return 0;
        let correct = 0;
        activeModule.quiz.forEach((q, idx) => {
            if (answers[idx] === q.answer) correct++;
        });
        return Math.round((correct / activeModule.quiz.length) * 100);
    };

    const handleCheckAnswers = () => {
        setShowResults(true);
        const score = calculateScore();

        // Mark module as complete with score
        markModuleComplete(courseId, activeModule.id, score);

        if (score === 100) {
            success('Perfect score! 🎉');
        } else if (score >= 70) {
            success(`Good job! You scored ${score}%`);
        }
    };

    const handleNextModule = async () => {
        setShowResults(false);
        setAnswers({});

        if (activeModuleIndex < course.modules.length - 1) {
            setActiveModuleIndex(prev => prev + 1);
        } else {
            // Course complete! Generate certificate if authenticated
            setShowCelebration(true);

            if (isAuthenticated && user) {
                try {
                    const cert = await api.generateCertificate(user.id, courseId, course.title);
                    setCertificate(cert);
                    success('Certificate earned! 🎉');
                } catch (err) {
                    console.error('Failed to generate certificate:', err);
                }
            }
        }
    };

    const handlePrevModule = () => {
        if (activeModuleIndex > 0) {
            setActiveModuleIndex(prev => prev - 1);
            setShowResults(false);
            setAnswers({});
        }
    };

    const handleModuleSelect = (idx) => {
        setActiveModuleIndex(idx);
        setShowResults(false);
        setAnswers({});
    };

    // Celebration Modal
    if (showCelebration) {
        return (
            <div className="pt-24 min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-6">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center animate-bounce">
                        <Trophy className="w-12 h-12 text-brand-dark" />
                    </div>
                    <h1 className="text-4xl font-bold text-brand-text mb-4">Course Complete! 🎉</h1>
                    <p className="text-brand-muted mb-6">
                        Congratulations! You've completed <span className="text-brand-primary font-semibold">{course.title}</span>.
                        Keep learning and growing your cybersecurity skills.
                    </p>

                    {/* Certificate earned */}
                    {certificate && (
                        <div className="mb-6 p-4 bg-brand-primary/10 border border-brand-primary/30 rounded-lg">
                            <div className="flex items-center justify-center gap-2 text-brand-primary mb-2">
                                <Award className="w-5 h-5" />
                                <span className="font-semibold">Certificate Earned!</span>
                            </div>
                            <Link
                                to={`/certificate/${certificate.id}`}
                                className="text-sm text-brand-primary hover:text-cyan-400 underline"
                            >
                                View & Download Certificate
                            </Link>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {certificate ? (
                            <Link
                                to={`/certificate/${certificate.id}`}
                                className="px-6 py-3 bg-brand-primary text-brand-dark font-bold rounded-lg hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2"
                            >
                                <Award className="w-4 h-4" />
                                View Certificate
                            </Link>
                        ) : (
                            <Link
                                to="/courses"
                                className="px-6 py-3 bg-brand-primary text-brand-dark font-bold rounded-lg hover:bg-cyan-400 transition-colors"
                            >
                                Browse More Courses
                            </Link>
                        )}
                        <button
                            onClick={() => {
                                setShowCelebration(false);
                                setActiveModuleIndex(0);
                            }}
                            className="px-6 py-3 border border-brand-text/20 text-brand-text font-medium rounded-lg hover:bg-brand-text/10 transition-colors"
                        >
                            Review Course
                        </button>
                    </div>

                    {certificate && (
                        <Link
                            to="/courses"
                            className="mt-4 inline-block text-brand-muted hover:text-brand-text text-sm"
                        >
                            Continue to More Courses →
                        </Link>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 min-h-screen pb-12">
            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-6 mb-6">
                <nav className="flex items-center gap-2 text-sm text-brand-muted">
                    <Link to="/" className="hover:text-brand-text transition-colors">
                        <Home className="w-4 h-4" />
                    </Link>
                    <ChevronLeft className="w-4 h-4 rotate-180" />
                    <Link to="/courses" className="hover:text-brand-text transition-colors">Courses</Link>
                    <ChevronLeft className="w-4 h-4 rotate-180" />
                    <span className="text-brand-text">{course.title}</span>
                </nav>
            </div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-brand-surface border border-brand-text/10 rounded-xl p-6 sticky top-24">
                        <h2 className="text-xl font-bold text-brand-text mb-2">{course.title}</h2>
                        <p className="text-sm text-brand-muted mb-4">{course.level}</p>

                        {/* Progress Bar */}
                        <div className="mb-6">
                            <div className="flex justify-between text-xs text-brand-muted mb-1">
                                <span>Progress</span>
                                <span>
                                    {course.modules.filter(m => isModuleComplete(courseId, m.id)).length}/{course.modules.length}
                                </span>
                            </div>
                            <div className="h-2 bg-brand-dark rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full transition-all"
                                    style={{
                                        width: `${(course.modules.filter(m => isModuleComplete(courseId, m.id)).length / course.modules.length) * 100}%`
                                    }}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            {course.modules.map((mod, idx) => {
                                const completed = isModuleComplete(courseId, mod.id);
                                const score = getQuizScore(courseId, mod.id);

                                return (
                                    <button
                                        key={mod.id}
                                        onClick={() => handleModuleSelect(idx)}
                                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${idx === activeModuleIndex
                                            ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/50'
                                            : completed
                                                ? 'text-brand-text hover:bg-brand-text/5 bg-green-500/5'
                                                : 'text-brand-text hover:bg-brand-text/5'
                                            }`}
                                    >
                                        {completed ? (
                                            <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                        ) : (
                                            <BookOpen className="w-4 h-4 shrink-0" />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <span className="text-sm font-medium block truncate">{mod.title}</span>
                                            {score !== null && (
                                                <span className="text-xs text-brand-muted">Quiz: {score}%</span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    <div className="bg-brand-surface border border-brand-text/10 rounded-xl p-8 min-h-[600px]">
                        <div className="flex items-center justify-between mb-8 border-b border-brand-text/10 pb-4">
                            <h1 className="text-3xl font-display font-bold text-brand-text">
                                {activeModule.title}
                            </h1>
                            <span className="text-sm text-brand-muted">
                                Module {activeModuleIndex + 1} of {course.modules.length}
                            </span>
                        </div>

                        {/* Lesson Content */}
                        <div className="mb-12">
                            <MarkdownRenderer content={activeModule.content} />
                        </div>

                        {/* Quiz Section */}
                        {activeModule.quiz && (
                            <div className="bg-black/20 rounded-xl p-6 border border-brand-text/5">
                                <h3 className="text-xl font-bold text-brand-text mb-6 flex items-center gap-2">
                                    <CheckCircle className="text-brand-secondary w-5 h-5" />
                                    Knowledge Check
                                    {showResults && (
                                        <span className={`ml-auto text-sm font-normal px-3 py-1 rounded-full ${calculateScore() >= 70
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-red-500/20 text-red-400'
                                            }`}>
                                            Score: {calculateScore()}%
                                        </span>
                                    )}
                                </h3>

                                <div className="space-y-8">
                                    {activeModule.quiz.map((q, qIdx) => (
                                        <div key={qIdx} className="space-y-3">
                                            <p className="font-medium text-brand-text flex items-start gap-3">
                                                <span className="text-brand-primary font-bold">{qIdx + 1}.</span>
                                                {q.question}
                                            </p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {q.options.map((opt, optIdx) => (
                                                    <button
                                                        key={optIdx}
                                                        disabled={showResults}
                                                        onClick={() => handleOptionSelect(qIdx, optIdx)}
                                                        className={`px-4 py-3 rounded-lg text-left text-sm transition-all flex items-center gap-3 ${showResults
                                                            ? optIdx === q.answer
                                                                ? 'bg-green-500/20 border border-green-500 text-green-400'
                                                                : answers[qIdx] === optIdx
                                                                    ? 'bg-red-500/20 border border-red-500 text-red-400'
                                                                    : 'bg-brand-text/5 text-brand-muted opacity-50'
                                                            : answers[qIdx] === optIdx
                                                                ? 'bg-brand-primary/20 border border-brand-primary text-brand-primary'
                                                                : 'bg-brand-text/5 text-brand-text hover:bg-brand-text/10 border border-transparent'
                                                            }`}
                                                    >
                                                        {showResults && optIdx === q.answer && (
                                                            <CheckCircle className="w-4 h-4 shrink-0" />
                                                        )}
                                                        {showResults && answers[qIdx] === optIdx && optIdx !== q.answer && (
                                                            <XCircle className="w-4 h-4 shrink-0" />
                                                        )}
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Quiz Controls */}
                                <div className="mt-8 pt-6 border-t border-brand-text/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                                    {!showResults ? (
                                        <button
                                            onClick={handleCheckAnswers}
                                            className="px-6 py-2 bg-brand-primary text-brand-dark font-bold rounded-lg hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            disabled={Object.keys(answers).length !== activeModule.quiz.length}
                                        >
                                            Check Answers
                                        </button>
                                    ) : (
                                        <div className="flex flex-col sm:flex-row items-center gap-4">
                                            <span className="text-brand-secondary font-medium">
                                                {calculateScore() >= 70 ? '✓ Module Complete!' : 'Keep practicing!'}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        <button
                                            onClick={handlePrevModule}
                                            disabled={activeModuleIndex === 0}
                                            className="flex items-center gap-2 px-4 py-2 bg-brand-text/10 text-brand-text rounded-lg hover:bg-brand-text/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            Previous
                                        </button>
                                        <button
                                            onClick={handleNextModule}
                                            className="flex items-center gap-2 px-4 py-2 bg-brand-text/10 text-brand-text font-bold rounded-lg hover:bg-brand-text/20 transition-colors"
                                        >
                                            {activeModuleIndex === course.modules.length - 1 ? 'Finish Course' : 'Next Module'}
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* No Quiz - Just navigation */}
                        {!activeModule.quiz && (
                            <div className="flex justify-between items-center pt-8 border-t border-brand-text/10">
                                <button
                                    onClick={handlePrevModule}
                                    disabled={activeModuleIndex === 0}
                                    className="flex items-center gap-2 px-4 py-2 bg-brand-text/10 text-brand-text rounded-lg hover:bg-brand-text/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Previous Module
                                </button>
                                <button
                                    onClick={handleNextModule}
                                    className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-brand-dark font-bold rounded-lg hover:bg-cyan-400 transition-colors"
                                >
                                    {activeModuleIndex === course.modules.length - 1 ? 'Finish Course' : 'Next Module'}
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Lesson;
