import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Certificate from '../components/Certificate';
import { Download, Share2, ArrowLeft, CheckCircle, XCircle, Printer } from 'lucide-react';

const CertificateView = () => {
    const { certificateId } = useParams();
    const certificateRef = useRef(null);
    const [verification, setVerification] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const verifyCertificate = async () => {
            try {
                const result = await api.verifyCertificate(certificateId);
                setVerification(result);
            } catch (err) {
                console.error('Verification failed:', err);
                setVerification({ valid: false });
            } finally {
                setIsLoading(false);
            }
        };

        verifyCertificate();
    }, [certificateId]);

    const handlePrint = () => {
        window.print();
    };

    const handleShare = async () => {
        const shareData = {
            title: 'WayFwrd Certificate',
            text: `I completed ${verification.certificate.courseName} on WayFwrd!`,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
            }
        } catch (err) {
            console.error('Share failed:', err);
        }
    };

    if (isLoading) {
        return (
            <div className="pt-24 min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" text="Verifying certificate..." />
            </div>
        );
    }

    if (!verification?.valid) {
        return (
            <div className="pt-24 min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-6">
                    <div className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
                        <XCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-brand-text mb-4">Invalid Certificate</h1>
                    <p className="text-brand-muted mb-8">
                        This certificate ID could not be verified. It may have been revoked or doesn't exist.
                    </p>
                    <Link
                        to="/courses"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-brand-dark font-bold rounded-full hover:bg-cyan-400 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Browse Courses
                    </Link>
                </div>
            </div>
        );
    }

    const { certificate, recipientName } = verification;

    return (
        <div className="pt-24 min-h-screen pb-12">
            <div className="max-w-4xl mx-auto px-6">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <Link
                        to="/certificates"
                        className="flex items-center gap-2 text-brand-muted hover:text-brand-text transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Certificates
                    </Link>

                    {/* Verification Badge */}
                    <div className="flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm">
                        <CheckCircle className="w-4 h-4" />
                        Verified
                    </div>
                </div>

                {/* Certificate */}
                <div
                    ref={certificateRef}
                    className="mb-6 print:mb-0"
                >
                    <Certificate
                        recipientName={recipientName}
                        courseName={certificate.courseName}
                        issuedAt={certificate.issuedAt}
                        certificateId={certificate.id}
                        className="shadow-2xl"
                    />
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-center gap-4 print:hidden">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-brand-dark font-bold rounded-lg hover:bg-cyan-400 transition-colors"
                    >
                        <Printer className="w-4 h-4" />
                        Print Certificate
                    </button>
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 px-6 py-3 border border-brand-text/20 text-brand-text font-medium rounded-lg hover:bg-brand-text/10 transition-colors"
                    >
                        <Share2 className="w-4 h-4" />
                        Share
                    </button>
                </div>

                {/* Verification Info */}
                <div className="mt-8 bg-brand-surface border border-brand-text/10 rounded-xl p-6 print:hidden">
                    <h3 className="font-bold text-brand-text mb-4">Verification Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-brand-muted">Certificate ID</p>
                            <p className="text-brand-text font-mono">{certificate.id}</p>
                        </div>
                        <div>
                            <p className="text-brand-muted">Issue Date</p>
                            <p className="text-brand-text">
                                {new Date(certificate.issuedAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                        <div>
                            <p className="text-brand-muted">Recipient</p>
                            <p className="text-brand-text">{recipientName}</p>
                        </div>
                        <div>
                            <p className="text-brand-muted">Course</p>
                            <p className="text-brand-text">{certificate.courseName}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CertificateView;
