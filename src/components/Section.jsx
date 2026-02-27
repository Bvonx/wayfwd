import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const Section = ({ title, id, children, className = '' }) => {
    return (
        <section id={id} className={`py-24 relative ${className}`}>
            <div className="max-w-7xl mx-auto px-6">
                {title && (
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl md:text-4xl font-display font-bold text-brand-text mb-12 border-l-4 border-brand-primary pl-4"
                    >
                        {title}
                    </motion.h2>
                )}
                {/* Removed hardcoded grid - let children control their own layout */}
                <div>
                    {children}
                </div>
            </div>
        </section>
    );
};

export default Section;
