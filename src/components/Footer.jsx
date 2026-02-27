import React from 'react';
import { Link } from 'react-router-dom';
import {
    Phone,
    Instagram,
    Send,
    MessageCircle,
    Twitter,
    Github,
    PinIcon
} from 'lucide-react';

// Brand items with URLs - duplicated for seamless loop
const brandItems = [
    { name: 'Google', type: 'google', url: 'https://www.google.com' },
    { name: 'Safaricom', type: 'safaricom', url: 'https://www.safaricom.co.ke' },
    { name: 'CISCO', type: 'cisco', url: 'https://www.cisco.com' },
    { name: 'M-Pesa', type: 'mpesa', url: 'https://www.safaricom.co.ke/personal/m-pesa' },
    { name: 'aws', type: 'aws', url: 'https://aws.amazon.com' },
    { name: 'Andela', type: 'andela', url: 'https://www.andela.com' },
    { name: 'CompTIA', type: 'comptia', url: 'https://www.comptia.org' },
    { name: 'Flutterwave', type: 'flutterwave', url: 'https://flutterwave.com' },
    { name: 'Microsoft', type: 'microsoft', url: 'https://www.microsoft.com' },
    { name: 'Paystack', type: 'paystack', url: 'https://paystack.com' },
];

const BrandItem = ({ type }) => {
    switch (type) {
        case 'google':
            return (
                <span className="text-xl md:text-2xl font-medium tracking-tight whitespace-nowrap">
                    <span className="text-blue-500">G</span>
                    <span className="text-red-500">o</span>
                    <span className="text-yellow-500">o</span>
                    <span className="text-blue-500">g</span>
                    <span className="text-green-500">l</span>
                    <span className="text-red-500">e</span>
                </span>
            );
        case 'safaricom':
            return <span className="text-xl md:text-2xl font-bold text-green-500 tracking-wide whitespace-nowrap">Safaricom</span>;
        case 'cisco':
            return <span className="text-xl md:text-2xl font-bold text-blue-500 tracking-wide whitespace-nowrap">CISCO</span>;
        case 'mpesa':
            return (
                <span className="text-xl md:text-2xl font-bold whitespace-nowrap">
                    <span className="text-green-500">M-</span>
                    <span className="text-red-500">PESA</span>
                </span>
            );
        case 'aws':
            return <span className="text-xl md:text-2xl font-bold text-orange-400 whitespace-nowrap">aws</span>;
        case 'andela':
            return <span className="text-xl md:text-2xl font-bold text-green-400 whitespace-nowrap">Andela</span>;
        case 'comptia':
            return (
                <span className="text-xl md:text-2xl font-bold whitespace-nowrap">
                    <span className="text-red-500">Comp</span>
                    <span className="text-gray-400">TIA</span>
                </span>
            );
        case 'flutterwave':
            return <span className="text-xl md:text-2xl font-bold text-yellow-500 whitespace-nowrap">Flutterwave</span>;
        case 'microsoft':
            return <span className="text-xl md:text-2xl font-semibold text-gray-300 whitespace-nowrap">Microsoft</span>;
        case 'paystack':
            return <span className="text-xl md:text-2xl font-bold text-blue-400 whitespace-nowrap">Paystack</span>;
        default:
            return null;
    }
};

// Marquee/Scrolling brands component
const ScrollingBrands = () => {
    // Triple the brands for truly seamless infinite scroll
    const allBrands = [...brandItems, ...brandItems, ...brandItems];

    return (
        <div className="relative overflow-hidden">
            {/* Gradient fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-brand-surface to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-brand-surface to-transparent z-10" />

            {/* Scrolling container */}
            <div className="flex animate-scroll-right">
                {allBrands.map((brand, index) => (
                    <a
                        key={`${brand.type}-${index}`}
                        href={brand.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 px-8 md:px-12 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                        title={`Visit ${brand.name}`}
                    >
                        <BrandItem type={brand.type} />
                    </a>
                ))}
            </div>
        </div>
    );
};

const Footer = () => {
    return (
        <footer className="bg-brand-surface border-t border-brand-text/5">
            {/* Trusted By Section with Scrolling Animation */}
            <div className="border-b border-brand-text/5">
                <div className="py-12">
                    <p className="text-center text-sm text-brand-muted mb-10 px-6">
                        Trusted by <span className="text-brand-text font-semibold">10+</span> organizations upskilling their workforce with WayFwrd.
                    </p>
                    <ScrollingBrands />
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                {/* Brand & Contact */}
                <div className="space-y-6">
                    <Link to="/" className="text-2xl font-display font-bold text-brand-text tracking-widest block">
                        WAYFWRD
                    </Link>
                    <p className="text-brand-muted text-sm leading-relaxed max-w-sm">
                        Empowering African developers to master cybersecurity, Linux, and modern tech. Join the revolution.
                    </p>
                    <a
                        href="https://wa.me/254XXXXXXXXX"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-brand-muted hover:text-brand-primary transition-colors group"
                    >
                        <div className="p-2 rounded-full bg-brand-text/5 group-hover:bg-brand-primary/10 transition-colors">
                            <Phone size={18} />
                        </div>
                        <span className="text-sm font-medium">+254 XXX XXX XXX</span>
                    </a>
                </div>

                {/* Sitemap */}
                <div>
                    <h4 className="text-brand-text font-bold mb-6 uppercase text-sm tracking-wider">Explore</h4>
                    <ul className="space-y-3">
                        <li>
                            <Link to="/" className="text-brand-muted hover:text-brand-primary transition-colors text-sm">Home</Link>
                        </li>
                        <li>
                            <Link to="/courses" className="text-brand-muted hover:text-brand-primary transition-colors text-sm">Courses</Link>
                        </li>
                        <li>
                            <Link to="/assistant" className="text-brand-muted hover:text-brand-primary transition-colors text-sm">AI Assistant</Link>
                        </li>
                        <li>
                            <Link to="/pricing" className="text-brand-muted hover:text-brand-primary transition-colors text-sm">Pricing</Link>
                        </li>
                        <li>
                            <Link to="/analytics" className="text-brand-muted hover:text-brand-primary transition-colors text-sm">Analytics</Link>
                        </li>
                        <li>
                            <Link to="/certificates" className="text-brand-muted hover:text-brand-primary transition-colors text-sm">Certificates</Link>
                        </li>
                    </ul>
                </div>

                {/* Legal */}
                <div>
                    <h4 className="text-brand-text font-bold mb-6 uppercase text-sm tracking-wider">Legal</h4>
                    <ul className="space-y-3">
                        <li>
                            <Link to="/privacy" className="text-brand-muted hover:text-brand-primary transition-colors text-sm">Privacy Policy</Link>
                        </li>
                        <li>
                            <Link to="/terms" className="text-brand-muted hover:text-brand-primary transition-colors text-sm">Terms of Service</Link>
                        </li>
                    </ul>
                </div>

                {/* Socials */}
                <div>
                    <h4 className="text-brand-text font-bold mb-6 uppercase text-sm tracking-wider">Connect</h4>
                    <div className="flex flex-wrap gap-4">
                        <SocialLink href="https://www.instagram.com" icon={<Instagram size={20} />} label="Instagram" />
                        <SocialLink href="https://t.me/bvonkn" icon={<Send size={20} />} label="Telegram" />
                        <SocialLink href="https://discord.com" icon={<MessageCircle size={20} />} label="Discord" />
                        <SocialLink href="https://www.pinterest.com" icon={<PinIcon size={20} />} label="Pinterest" />
                        <SocialLink href="https://twitter.com" icon={<Twitter size={20} />} label="Twitter" />
                        <SocialLink href="https://github.com/Bvonx" icon={<Github size={20} />} label="GitHub" />
                    </div>
                </div>
            </div>

            {/* Copyright & Bottom Links */}
            <div className="max-w-7xl mx-auto px-6 py-8 border-t border-brand-text/5 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-brand-muted text-xs">
                <p>&copy; {new Date().getFullYear()} WayFwrd. All rights reserved.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <span className="opacity-50 hover:opacity-100 transition-opacity cursor-pointer">Security</span>
                    <span className="opacity-50 hover:opacity-100 transition-opacity cursor-pointer">Status</span>
                </div>
            </div>

            {/* Custom styles for scrolling animation */}
            <style>{`
                @keyframes scroll-right {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-33.33%);
                    }
                }
                
                .animate-scroll-right {
                    animation: scroll-right 15s linear infinite;
                }
                
                .animate-scroll-right:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </footer>
    );
};

const SocialLink = ({ href, icon, label }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        title={label}
        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-muted hover:bg-brand-primary hover:text-brand-dark transition-all duration-300 border border-white/5 hover:border-brand-primary"
    >
        {icon}
    </a>
);

export default Footer;
