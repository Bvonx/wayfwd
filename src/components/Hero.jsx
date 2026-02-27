import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Background Gradient */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/40 via-transparent to-brand-dark/60" />
            </div>

            {/* Additional Background Glow Elements */}
            <div className="absolute inset-0 z-[1] pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-secondary/5 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-brand-surface/80 backdrop-blur-sm border border-brand-text/10 text-brand-primary text-sm font-bold mb-6">
                        <Lock className="w-3 h-3 inline-block mr-2" />
                        Next-Gen Cybersecurity Training
                    </span>
                    <h1 className="text-5xl md:text-7xl font-display font-bold text-brand-text mb-6 leading-tight drop-shadow-[0_0_25px_rgba(0,255,70,0.4)]">
                        Master the Art of <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
                            Ethical Hacking
                        </span>
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-xl text-brand-muted mb-8 max-w-2xl mx-auto leading-relaxed"
                >
                    Join Africa's elite cybersecurity community. Learn from industry experts,
                    practice in real-world simulations, and launch your career in security.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link
                        to="/signup"
                        className="px-8 py-4 bg-brand-primary text-brand-dark font-bold rounded-full hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)]"
                    >
                        Start Learning Free
                    </Link>
                    <Link
                        to="/assistant"
                        className="px-8 py-4 border border-brand-text/20 text-brand-text font-bold rounded-full hover:bg-brand-text/10 transition-colors backdrop-blur-sm"
                    >
                        Meet Your AI Mentor
                    </Link>
                </motion.div>

            </div>
        </section >
    );
};

export default Hero;
