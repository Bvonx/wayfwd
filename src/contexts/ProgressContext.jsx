/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ProgressContext = createContext(null);

const STORAGE_KEY = 'wayfwrd_progress';

export const ProgressProvider = ({ children }) => {

    const [progress, setProgress] = useState({
        completedModules: {}, // { courseId: Set of moduleIds }
        quizScores: {}, // { `${courseId}:${moduleId}`: score }
        lastAccessedCourse: null,
        lastAccessedModule: null
    });
    const [isLoading, setIsLoading] = useState(true);

    // Load progress from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Convert arrays back to Sets
                const completedModules = {};
                Object.entries(parsed.completedModules || {}).forEach(([courseId, moduleIds]) => {
                    completedModules[courseId] = new Set(moduleIds);
                });
                setProgress({
                    ...parsed,
                    completedModules
                });
            }
        } catch (error) {
            console.error('Failed to load progress:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Persist progress when it changes
    useEffect(() => {
        if (isLoading) return;

        const toStore = {
            ...progress,
            completedModules: {}
        };

        // Convert Sets to arrays for JSON serialization
        Object.entries(progress.completedModules).forEach(([courseId, moduleSet]) => {
            toStore.completedModules[courseId] = Array.from(moduleSet);
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    }, [progress, isLoading]);

    const markModuleComplete = useCallback((courseId, moduleId, quizScore = null) => {
        setProgress(prev => {
            const newCompletedModules = { ...prev.completedModules };

            if (!newCompletedModules[courseId]) {
                newCompletedModules[courseId] = new Set();
            }
            newCompletedModules[courseId] = new Set([...newCompletedModules[courseId], moduleId]);

            const newQuizScores = { ...prev.quizScores };
            if (quizScore !== null) {
                newQuizScores[`${courseId}:${moduleId}`] = quizScore;
            }

            return {
                ...prev,
                completedModules: newCompletedModules,
                quizScores: newQuizScores
            };
        });
    }, []);

    const isModuleComplete = useCallback((courseId, moduleId) => {
        return progress.completedModules[courseId]?.has(moduleId) || false;
    }, [progress.completedModules]);

    const getQuizScore = useCallback((courseId, moduleId) => {
        return progress.quizScores[`${courseId}:${moduleId}`] || null;
    }, [progress.quizScores]);

    const getCourseProgress = useCallback((courseId, totalModules) => {
        const completed = progress.completedModules[courseId]?.size || 0;
        return {
            completed,
            total: totalModules,
            percentage: totalModules > 0 ? Math.round((completed / totalModules) * 100) : 0
        };
    }, [progress.completedModules]);

    const setLastAccessed = useCallback((courseId, moduleId = null) => {
        setProgress(prev => ({
            ...prev,
            lastAccessedCourse: courseId,
            lastAccessedModule: moduleId
        }));
    }, []);

    const resetProgress = useCallback(() => {
        setProgress({
            completedModules: {},
            quizScores: {},
            lastAccessedCourse: null,
            lastAccessedModule: null
        });
    }, []);

    const value = React.useMemo(() => ({
        progress,
        isLoading,
        markModuleComplete,
        isModuleComplete,
        getQuizScore,
        getCourseProgress,
        setLastAccessed,
        resetProgress
    }), [progress, isLoading, markModuleComplete, isModuleComplete, getQuizScore, getCourseProgress, setLastAccessed, resetProgress]);

    return (
        <ProgressContext.Provider value={value}>
            {children}
        </ProgressContext.Provider>
    );
};

export const useProgress = () => {
    const context = useContext(ProgressContext);
    if (!context) {
        throw new Error('useProgress must be used within a ProgressProvider');
    }
    return context;
};

export default ProgressContext;
