import React from 'react';
import { Link } from 'react-router-dom';

const Terms = () => {
    return (
        <div className="pt-24 min-h-screen">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <h1 className="text-4xl font-display font-bold text-brand-text mb-2">Terms of Service</h1>
                <p className="text-brand-muted mb-12">Last updated: January 11, 2026</p>

                <div className="prose prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-brand-text mb-4">1. Acceptance of Terms</h2>
                        <p className="text-brand-text leading-relaxed">
                            By accessing or using WayFwrd's cybersecurity learning platform ("Service"), you agree
                            to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms,
                            you may not access or use the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-text mb-4">2. Description of Service</h2>
                        <p className="text-brand-text leading-relaxed">
                            WayFwrd provides an online educational platform focused on cybersecurity training,
                            including courses, tutorials, interactive labs, and AI-assisted learning tools.
                            The Service is designed for educational purposes only.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-text mb-4">3. User Accounts</h2>
                        <ul className="list-disc list-inside text-brand-text space-y-2">
                            <li>You must provide accurate and complete information when creating an account</li>
                            <li>You are responsible for maintaining the security of your account credentials</li>
                            <li>You must be at least 13 years old to use the Service</li>
                            <li>One person or legal entity may not maintain more than one account</li>
                            <li>You are responsible for all activities that occur under your account</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-text mb-4">4. Ethical Use Policy</h2>
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 mb-4">
                            <p className="text-red-400 font-semibold mb-2">⚠️ Important Notice</p>
                            <p className="text-brand-text leading-relaxed">
                                All skills learned through WayFwrd must be used ethically and legally.
                                You agree to never use knowledge gained from this platform to:
                            </p>
                        </div>
                        <ul className="list-disc list-inside text-brand-text space-y-2">
                            <li>Access systems without authorization</li>
                            <li>Conduct attacks on networks or systems you don't own or have permission to test</li>
                            <li>Steal, modify, or destroy data</li>
                            <li>Engage in any form of cybercrime</li>
                            <li>Violate any applicable laws or regulations</li>
                        </ul>
                        <p className="text-brand-text leading-relaxed mt-4">
                            Violation of this policy will result in immediate account termination and may be
                            reported to relevant authorities.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-text mb-4">5. Acceptable Use</h2>
                        <p className="text-brand-text leading-relaxed mb-4">You agree not to:</p>
                        <ul className="list-disc list-inside text-brand-text space-y-2">
                            <li>Share your account credentials with others</li>
                            <li>Copy, redistribute, or sell course materials</li>
                            <li>Interfere with or disrupt the Service</li>
                            <li>Attempt to gain unauthorized access to any part of the Service</li>
                            <li>Use the Service for any illegal or unauthorized purpose</li>
                            <li>Harass, abuse, or harm other users</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-text mb-4">6. Subscription and Payments</h2>
                        <ul className="list-disc list-inside text-brand-text space-y-2">
                            <li>Premium features require a paid subscription</li>
                            <li>Subscriptions automatically renew unless cancelled</li>
                            <li>Prices are subject to change with 30 days notice</li>
                            <li>Refunds are available within 7 days of purchase for unused services</li>
                            <li>We accept M-Pesa, Airtel Money, and major credit cards</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-text mb-4">7. Intellectual Property</h2>
                        <p className="text-brand-text leading-relaxed">
                            All content on the platform, including courses, videos, text, graphics, logos, and
                            software, is the property of WayFwrd or its content creators and is protected by
                            intellectual property laws. You may not copy, modify, distribute, or create derivative
                            works without explicit permission.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-text mb-4">8. AI Assistant Disclaimer</h2>
                        <p className="text-brand-text leading-relaxed">
                            The AI Assistant is provided for educational guidance only. While we strive for
                            accuracy, the AI may occasionally provide incorrect or incomplete information.
                            Always verify critical information from authoritative sources. The AI will not
                            provide assistance with any unethical or illegal activities.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-text mb-4">9. Limitation of Liability</h2>
                        <p className="text-brand-text leading-relaxed">
                            WayFwrd is provided "as is" without warranties of any kind. We are not liable for
                            any damages arising from your use of the Service, including but not limited to
                            direct, indirect, incidental, or consequential damages. Your use of skills learned
                            through the platform is entirely at your own risk.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-text mb-4">10. Termination</h2>
                        <p className="text-brand-text leading-relaxed">
                            We reserve the right to terminate or suspend your account at any time for violations
                            of these Terms or for any other reason at our discretion. Upon termination, your
                            right to use the Service will immediately cease.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-text mb-4">11. Changes to Terms</h2>
                        <p className="text-brand-text leading-relaxed">
                            We may modify these Terms at any time. We will notify users of significant changes
                            via email or through the Service. Continued use of the Service after changes
                            constitutes acceptance of the new Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-text mb-4">12. Governing Law</h2>
                        <p className="text-brand-text leading-relaxed">
                            These Terms are governed by the laws of Kenya. Any disputes arising from these
                            Terms or the Service will be resolved in the courts of Nairobi, Kenya.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-text mb-4">13. Contact</h2>
                        <p className="text-brand-text leading-relaxed">
                            For questions about these Terms, please contact us at:{' '}
                            <a href="mailto:legal@wayfwrd.com" className="text-brand-primary hover:text-cyan-400 transition-colors">
                                legal@wayfwrd.com
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

export default Terms;
