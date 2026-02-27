import React from 'react';
import { Award, Shield, CheckCircle } from 'lucide-react';

/**
 * Certificate component for displaying and printing course completion certificates
 */
const Certificate = ({
    recipientName,
    courseName,
    issuedAt,
    certificateId,
    className = ''
}) => {
    const formattedDate = new Date(issuedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div
            className={`relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-4 border-brand-primary/30 rounded-lg overflow-hidden ${className}`}
            style={{ aspectRatio: '1.414' }} // A4 aspect ratio
        >
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-brand-primary/50 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-brand-primary/50 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-brand-primary/50 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-brand-primary/50 rounded-br-lg" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                {/* Logo */}
                <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-8 h-8 text-brand-primary" />
                    <span className="text-2xl font-display font-bold text-white tracking-widest">
                        WAYFWRD
                    </span>
                </div>

                {/* Title */}
                <h2 className="text-sm uppercase tracking-[0.3em] text-brand-muted mb-6">
                    Certificate of Completion
                </h2>

                {/* Award icon */}
                <div className="w-16 h-16 mb-6 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center">
                    <Award className="w-8 h-8 text-brand-dark" />
                </div>

                <div className="mb-12">
                    <p className="text-brand-muted uppercase tracking-widest text-sm mb-2">This certifies that</p>
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-brand-primary mb-4">
                        {recipientName}
                    </h2>
                    <p className="text-brand-muted uppercase tracking-widest text-sm mb-6">Has successfully completed the course</p>
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-brand-text mb-4 border-b-2 border-brand-primary/30 pb-2 px-8">
                        {courseName}
                    </h1>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-12 max-w-2xl mx-auto">
                    <div>
                        <p className="text-brand-muted text-xs uppercase tracking-wider mb-1">Date Issued</p>
                        <p className="font-semibold text-brand-text">{formattedDate}</p>
                    </div>
                    <div>
                        <p className="text-brand-muted text-xs uppercase tracking-wider mb-1">Certificate ID</p>
                        <p className="font-semibold text-brand-text">{certificateId}</p>
                    </div>
                </div>

                {/* Verification notice */}
                <p className="mt-4 text-xs text-brand-muted/50">
                    Verify at wayfwrd.com/verify/{certificateId}
                </p>
            </div>

            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '24px 24px'
                }} />
            </div>
        </div>
    );
};

export default Certificate;
