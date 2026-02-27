import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });

        // Log error to console (in production, send to error tracking service)
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        // You could send to an error tracking service here
        // errorTrackingService.log({ error, errorInfo });
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-brand-dark flex items-center justify-center p-6">
                    <div className="max-w-md w-full text-center">
                        {/* Error Icon */}
                        <div className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-10 h-10 text-red-500" />
                        </div>

                        <h1 className="text-3xl font-bold text-brand-text mb-4">
                            Something went wrong
                        </h1>

                        <p className="text-brand-muted mb-8">
                            We're sorry, but something unexpected happened.
                            Please try again or return to the home page.
                        </p>

                        {/* Error details (only in development) */}
                        {import.meta.env.MODE === 'development' && this.state.error && (
                            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-left">
                                <p className="text-red-400 font-mono text-sm mb-2">
                                    {this.state.error.toString()}
                                </p>
                                {this.state.errorInfo && (
                                    <pre className="text-xs text-red-300/70 overflow-auto max-h-32">
                                        {this.state.errorInfo.componentStack}
                                    </pre>
                                )}
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={this.handleRetry}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-primary text-brand-dark font-bold rounded-full hover:bg-cyan-400 transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Try Again
                            </button>
                            <a
                                href="/"
                                className="flex items-center justify-center gap-2 px-6 py-3 border border-brand-text/20 text-brand-text font-medium rounded-full hover:bg-brand-text/10 transition-colors"
                            >
                                <Home className="w-4 h-4" />
                                Go Home
                            </a>
                        </div>

                        <p className="mt-8 text-sm text-brand-muted">
                            If this problem persists, please{' '}
                            <a href="mailto:support@wayfwrd.com" className="text-brand-primary hover:text-cyan-400">
                                contact support
                            </a>
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
