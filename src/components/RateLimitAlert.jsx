import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';

const RateLimitAlert = ({ remainingSeconds, formatRemainingTime, onRetry }) => {
    if (remainingSeconds <= 0) return null;

    return (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
                <div className="p-2 bg-red-500/20 rounded-full shrink-0">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold text-red-400 mb-1">Too Many Attempts</h4>
                    <p className="text-sm text-red-300/80 mb-3">
                        You've made too many attempts. Please wait before trying again.
                    </p>
                    <div className="flex items-center gap-2 text-red-400">
                        <Clock className="w-4 h-4" />
                        <span className="font-mono text-lg">{formatRemainingTime()}</span>
                    </div>
                </div>
            </div>
            {onRetry && remainingSeconds <= 0 && (
                <button
                    onClick={onRetry}
                    className="mt-4 w-full py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors font-medium"
                >
                    Try Again
                </button>
            )}
        </div>
    );
};

export default RateLimitAlert;
