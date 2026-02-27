import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const Card = ({ title, description, link, image, badge }) => {
    return (
        <motion.a
            href={link}
            whileHover={{ y: -10 }}
            className="block group relative bg-brand-surface rounded-2xl overflow-hidden border border-brand-text/5 hover:border-brand-primary/50 transition-colors"
        >
            {image && (
                <div className="h-48 overflow-hidden">
                    <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
            )}
            <div className="p-6">
                {badge && (
                    <span className="inline-block px-3 py-1 text-xs font-bold text-brand-dark bg-brand-secondary rounded-full mb-3">
                        {badge}
                    </span>
                )}
                <h3 className="text-xl font-bold text-brand-text mb-2 group-hover:text-brand-primary transition-colors">
                    {title}
                </h3>
                <p className="text-brand-muted text-sm leading-relaxed">
                    {description}
                </p>
            </div>
        </motion.a>
    );
};

export default Card;
