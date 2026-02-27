import React from 'react';
import Section from '../components/Section';
import { Check, ShieldCheck } from 'lucide-react';

const Pricing = () => {
    return (
        <div className="pt-24 min-h-screen">
            <Section title="Invest in Your Future" id="pricing">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">

                    {/* Free Tier */}
                    <div className="bg-brand-surface p-8 rounded-2xl border border-brand-text/10 hover:border-brand-text/20 transition-all">
                        <h3 className="text-2xl font-bold text-brand-text mb-2">Community</h3>
                        <div className="text-4xl font-bold text-brand-primary mb-6">Free</div>
                        <p className="text-brand-muted mb-6">Perfect for getting started with the basics of cybersecurity.</p>

                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3 text-brand-text">
                                <Check className="w-5 h-5 text-brand-primary" />
                                <span>Introduction to Linux Course</span>
                            </li>
                            <li className="flex items-center gap-3 text-brand-text">
                                <Check className="w-5 h-5 text-brand-primary" />
                                <span>Cyber Hygiene Basics</span>
                            </li>
                            <li className="flex items-center gap-3 text-brand-text">
                                <Check className="w-5 h-5 text-brand-primary" />
                                <span>Limited AI Assistant Access</span>
                            </li>
                        </ul>

                        <button className="w-full py-4 rounded-lg bg-brand-text/10 text-brand-text font-bold hover:bg-brand-text/20 transition-colors">
                            Start Learning Free
                        </button>
                    </div>

                    {/* Pro Tier */}
                    <div className="relative bg-brand-surface p-8 rounded-2xl border border-brand-primary/30 hover:border-brand-primary transition-all shadow-lg shadow-brand-primary/10">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-secondary text-brand-dark px-4 py-1 rounded-full text-sm font-bold">
                            RECOMMENDED
                        </div>

                        <h3 className="text-2xl font-bold text-brand-text mb-2">Pro Academy</h3>
                        <div className="text-4xl font-bold text-brand-primary mb-6">
                            KES 1,500 <span className="text-sm text-brand-muted font-normal">/ month</span>
                        </div>
                        <p className="text-brand-muted mb-6">Full access to labs, certificates, and advanced AI mentorship.</p>

                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3 text-brand-text">
                                <ShieldCheck className="w-5 h-5 text-brand-secondary" />
                                <span>All Advanced Courses (Web, Network, SOC)</span>
                            </li>
                            <li className="flex items-center gap-3 text-brand-text">
                                <ShieldCheck className="w-5 h-5 text-brand-secondary" />
                                <span>Unlimited AI Assistant</span>
                            </li>
                            <li className="flex items-center gap-3 text-brand-text">
                                <ShieldCheck className="w-5 h-5 text-brand-secondary" />
                                <span>Hands-on Virtual Labs</span>
                            </li>
                            <li className="flex items-center gap-3 text-brand-text">
                                <ShieldCheck className="w-5 h-5 text-brand-secondary" />
                                <span>Verified Certificates</span>
                            </li>
                        </ul>

                        <button className="w-full py-4 rounded-lg bg-brand-primary text-brand-dark font-bold hover:bg-cyan-400 transition-colors mb-4">
                            Get Pro Access
                        </button>

                        <div className="text-center text-xs text-brand-muted">
                            Accepts M-Pesa, Airtel Money, and Cards
                        </div>
                    </div>
                </div>
            </Section>
        </div>
    );
};

export default Pricing;
