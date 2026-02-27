import React from 'react';
import { Link } from 'react-router-dom';
import Section from '../components/Section';

const Privacy = () => {
    return (
        <div className="pt-24 min-h-screen">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <h1 className="text-4xl font-display font-bold text-brand-text mb-2">Privacy Policy</h1>
                <p className="text-brand-muted mb-12">Last updated: January 11, 2026</p>

                <div className="prose prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-brand-text mb-4">1. Introduction</h2>
                        <p className="text-brand-text leading-relaxed">
                            Welcome to WayFwrd ("we," "our," or "us"). We are committed to protecting your privacy
                            and ensuring the security of your personal information. This Privacy Policy explains how
                            we collect, use, disclose, and safeguard your information when you use our cybersecurity
                            learning platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-text mb-4">2. Information We Collect</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-brand-primary mb-2">Personal Information</h3>
                                <ul className="list-disc list-inside text-brand-text space-y-2">
                                    <li>Name and email address when you create an account</li>
                                    <li>Profile information you choose to provide</li>
                                    <li>Payment information when you subscribe to premium services</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-brand-primary mb-2">Usage Information</h3>
                                <ul className="list-disc list-inside text-brand-text space-y-2">
                                    <li>Course progress and quiz results</li>
                                    <li>Interactions with the AI Assistant</li>
                                    <li>Device information and browser type</li>
                                    <li>IP address and approximate location</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-text mb-4">3. How We Use Your Information</h2>
                        <ul className="list-disc list-inside text-brand-text space-y-2">
                            <li>To provide and maintain our educational services</li>
                            <li>To personalize your learning experience</li>
                            <li>To process payments and manage subscriptions</li>
                            <li>To communicate with you about updates and new features</li>
                            <li>To improve our platform and develop new courses</li>
                            <li>To ensure platform security and prevent abuse</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-text mb-4">4. Data Security</h2>
                        <p className="text-brand-text leading-relaxed">
                            We implement industry-standard security measures to protect your data, including
                            encryption, secure connections (HTTPS), and regular security audits. However, no
                            method of transmission over the Internet is 100% secure, and we cannot guarantee
                            absolute security.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-text mb-4">5. Data Retention</h2>
                        <p className="text-brand-text leading-relaxed">
                            We retain your personal information for as long as your account is active or as needed
                            to provide you services. You can request deletion of your account and associated data
                            at any time by contacting us.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-text mb-4">6. Your Rights</h2>
                        <ul className="list-disc list-inside text-brand-text space-y-2">
                            <li>Access and receive a copy of your personal data</li>
                            <li>Correct inaccurate personal information</li>
                            <li>Request deletion of your data</li>
                            <li>Opt-out of marketing communications</li>
                            <li>Data portability where applicable</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-text mb-4">7. Cookies</h2>
                        <p className="text-brand-text leading-relaxed">
                            We use cookies and similar technologies to enhance your experience, analyze usage,
                            and remember your preferences. You can control cookie settings through your browser.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-text mb-4">8. Third-Party Services</h2>
                        <p className="text-brand-text leading-relaxed">
                            We may use third-party services for payment processing, analytics, and communication.
                            These services have their own privacy policies governing the use of your information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-text mb-4">9. Children's Privacy</h2>
                        <p className="text-brand-text leading-relaxed">
                            Our services are not intended for children under 13. We do not knowingly collect
                            personal information from children under 13. If you believe we have collected such
                            information, please contact us immediately.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-text mb-4">10. Changes to This Policy</h2>
                        <p className="text-brand-text leading-relaxed">
                            We may update this Privacy Policy from time to time. We will notify you of any
                            changes by posting the new policy on this page and updating the "Last updated" date.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-text mb-4">11. Contact Us</h2>
                        <p className="text-brand-text leading-relaxed">
                            If you have questions about this Privacy Policy, please contact us at:{' '}
                            <a href="mailto:privacy@wayfwrd.com" className="text-brand-primary hover:text-cyan-400 transition-colors">
                                privacy@wayfwrd.com
                            </a>
                        </p>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-brand-text/10 text-center">
                    <Link to="/" className="text-brand-primary hover:text-cyan-400 font-medium transition-colors">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
