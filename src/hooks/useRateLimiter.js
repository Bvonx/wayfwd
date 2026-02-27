import { useState, useCallback, useEffect } from 'react';

/**
 * Hook for managing rate limiting state on the client side.
 * Works with the API service to track and display rate limit status.
 */
export const useRateLimiter = () => {
    const [state, setState] = useState({
        isLimited: false,
        remainingAttempts: null,
        resetAt: null,
        remainingSeconds: 0
    });

    // Update countdown every second when limited
    useEffect(() => {
        if (!state.isLimited || !state.resetAt) return;

        const interval = setInterval(() => {
            const now = Date.now();
            const remaining = Math.max(0, Math.ceil((state.resetAt - now) / 1000));

            if (remaining <= 0) {
                setState(prev => ({
                    ...prev,
                    isLimited: false,
                    remainingSeconds: 0
                }));
            } else {
                setState(prev => ({
                    ...prev,
                    remainingSeconds: remaining
                }));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [state.isLimited, state.resetAt]);

    const checkLimit = useCallback((apiResponse) => {
        // If the API returns rate limit info, update state
        if (apiResponse?.rateLimited) {
            setState({
                isLimited: true,
                remainingAttempts: 0,
                resetAt: apiResponse.resetAt,
                remainingSeconds: Math.ceil((apiResponse.resetAt - Date.now()) / 1000)
            });
            return false;
        }

        if (apiResponse?.remainingAttempts !== undefined) {
            setState(prev => ({
                ...prev,
                remainingAttempts: apiResponse.remainingAttempts
            }));
        }

        return true;
    }, []);

    const setLimited = useCallback((resetAt) => {
        setState({
            isLimited: true,
            remainingAttempts: 0,
            resetAt,
            remainingSeconds: Math.ceil((resetAt - Date.now()) / 1000)
        });
    }, []);

    const reset = useCallback(() => {
        setState({
            isLimited: false,
            remainingAttempts: null,
            resetAt: null,
            remainingSeconds: 0
        });
    }, []);

    const formatRemainingTime = useCallback(() => {
        const seconds = state.remainingSeconds;
        if (seconds < 60) {
            return `${seconds} second${seconds !== 1 ? 's' : ''}`;
        }
        const minutes = Math.ceil(seconds / 60);
        return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }, [state.remainingSeconds]);

    return {
        isLimited: state.isLimited,
        remainingAttempts: state.remainingAttempts,
        remainingSeconds: state.remainingSeconds,
        formatRemainingTime,
        checkLimit,
        setLimited,
        reset
    };
};

export default useRateLimiter;
