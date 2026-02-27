import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Certificate from '../components/Certificate';
import { Award, Download, ExternalLink, Calendar, BookOpen } from 'lucide-react';

const Certificates = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [certificates, setCertificates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const fetchCertificates = async () => {
            try {
                const certs = await api.getCertificates(user.id);
                setCertificates(certs);
            } catch (err) {
                console.error('Failed to fetch certificates:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCertificates();
    }, [user, isAuthenticated, navigate]);

    const getUserName = () => {
        if (user?.firstName && user?.lastName) {
            return `${user.firstName} ${user.lastName}`;
        }
        return user?.email || 'Student';
    };

    if (isLoading) {
        return (
            <div className="pt-24 min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" text="Loading certificates..." />
            </div>
        );
    }

    return (
        <div className="pt-24 min-h-screen pb-12">
            <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-brand-text mb-2 flex items-center gap-3">
                        <Award className="w-8 h-8 text-brand-secondary" />
                        My Certificates
                    </h1>
                    <p className="text-brand-muted">
                        Showcase your achievements and completed courses.
                    </p>
                </div>

                {certificates.length === 0 ? (
                    <div className="bg-brand-surface border border-brand-text/10 rounded-xl p-12 text-center">
                        <div className="w-20 h-20 mx-auto mb-6 bg-brand-primary/20 rounded-full flex items-center justify-center">
                            <Award className="w-10 h-10 text-brand-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-brand-text mb-4">No Certificates Yet</h2>
                        <p className="text-brand-muted mb-8 max-w-md mx-auto">
                            Complete courses to earn certificates that prove your cybersecurity skills.
                            Each certificate includes a unique verification ID.
                        </p>
                        <Link
                            to="/courses"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-brand-dark font-bold rounded-full hover:bg-cyan-400 transition-colors"
                        >
                            <BookOpen className="w-4 h-4" />
                            Start Learning
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="bg-brand-surface border border-brand-text/10 rounded-xl p-4 text-center">
                                <p className="text-3xl font-bold text-brand-primary">{certificates.length}</p>
                                <p className="text-sm text-brand-muted">Certificates Earned</p>
                            </div>
                            <div className="bg-brand-surface border border-brand-text/10 rounded-xl p-4 text-center">
                                <p className="text-3xl font-bold text-green-500">100%</p>
                                <p className="text-sm text-brand-muted">Completion Rate</p>
                            </div>
                            <div className="bg-brand-surface border border-brand-text/10 rounded-xl p-4 text-center">
                                <p className="text-3xl font-bold text-brand-secondary">Verified</p>
                                <p className="text-sm text-brand-muted">All certificates</p>
                            </div>
                        </div>

                        {/* Certificate grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {certificates.map((cert) => (
                                <div key={cert.id} className="group">
                                    <div className="bg-brand-surface border border-brand-text/10 rounded-xl overflow-hidden hover:border-brand-primary/50 transition-colors">
                                        {/* Certificate Preview */}
                                        <div className="p-4">
                                            <Certificate
                                                recipientName={getUserName()}
                                                courseName={cert.courseName}
                                                issuedAt={cert.issuedAt}
                                                certificateId={cert.id}
                                                className="transform scale-100 origin-top"
                                            />
                                        </div>

                                        {/* Actions */}
                                        <div className="p-4 bg-black/20 border-t border-brand-text/10 flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-sm text-brand-muted">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(cert.issuedAt).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    to={`/certificate/${cert.id}`}
                                                    className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-brand-dark text-sm font-bold rounded-lg hover:bg-cyan-400 transition-colors"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                    View
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Certificates;
