import React from 'react';
import Hero from '../components/Hero';
import Section from '../components/Section';
import Card from '../components/Card';
import { Shield, Globe, Terminal } from 'lucide-react';

const Home = () => {
    const features = [
        {
            title: "Built for Africa",
            description: "Optimized for low-bandwidth. Mobile-first learning experience.",
            icon: <Globe className="w-6 h-6 text-brand-primary" />
        },
        {
            title: "Interactive Labs",
            description: "Practice safely with our browser-based Kali Linux simulators.",
            icon: <Terminal className="w-6 h-6 text-brand-secondary" />
        },
        {
            title: "Ethical First",
            description: "Learn defense, not just offense. White-hat hacking methodology.",
            icon: <Shield className="w-6 h-6 text-brand-primary" />
        }
    ];

    return (
        <>
            <Hero />

            <Section title="Why WayFwrd?" id="features">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-brand-surface p-6 rounded-lg border border-brand-text/5 hover:border-brand-primary/50 transition-colors">
                            <div className="mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-bold mb-2 text-brand-text">{feature.title}</h3>
                            <p className="text-brand-muted">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </Section>
        </>
    );
};

export default Home;
