import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Activity, Shield, Zap, Globe as GlobeIcon, Cpu, CheckCircle } from 'lucide-react';
import { gsap } from 'gsap';
import LiquidEther from '../components/ui/LiquidEther';
import CurvedLoop from '../components/ui/CurvedLoop';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        // Handle Scroll for Navbar
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);

        // Entrance Animations
        gsap.fromTo(".landing-fade-in",
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power2.out" }
        );

        return () => window.removeEventListener('scroll', handleScroll);
    }, [navigate]);

    return (
        <div className="min-h-screen bg-[#020617] text-white overflow-hidden font-sans selection:bg-cyan-500/30">
            {/* Background Grid */}
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}>
            </div>

            {/* Liquid Effect Background */}
            <div className="fixed inset-0 z-[1] opacity-70 mix-blend-screen pointer-events-none">
                <LiquidEther
                    colors={['#06b6d4', '#3b82f6', '#1e293b']}
                    mouseForce={20}
                    cursorSize={100}
                    isViscous
                    viscous={30}
                    iterationsViscous={32}
                    iterationsPoisson={32}
                    resolution={0.5}
                    isBounce={false}
                    autoDemo
                    autoSpeed={0.5}
                    autoIntensity={2.2}
                    takeoverDuration={0.25}
                    autoResumeDelay={3000}
                    autoRampDuration={0.6}
                />
            </div>

            {/* Navbar (Scroll triggered) */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex items-center justify-between px-8 mx-auto ${isScrolled ? 'py-4 max-w-5xl mt-4 bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl rounded-full' : 'py-6 max-w-7xl'}`}>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                        <Activity className="text-[#020617]" size={20} />
                    </div>
                    <span className={`font-bold tracking-tight transition-all duration-500 ${isScrolled ? 'text-lg' : 'text-xl'}`}>PrecisionRx</span>
                </div>
                <button
                    onClick={() => navigate('/intake')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-[#020617] font-bold rounded-full transition-all hover:scale-105"
                >
                    Get Started <ArrowRight size={16} />
                </button>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto text-center flex flex-col items-center justify-center min-h-[80vh]">
                <div className="landing-fade-in inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-800 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-8">
                    <Zap size={12} /> Pharmacogenomics Redefined
                </div>

                <h1 className="landing-fade-in text-5xl md:text-7xl font-bold tracking-tight mb-6 text-slate-100 drop-shadow-lg">
                    Precision Medicine,<br />Powered by Your DNA
                </h1>

                <p className="landing-fade-in text-lg text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                    PrecisionRx turns genomic data into actionable clinical insights.
                    Prevent adverse drug events and optimize therapy with AI-driven pharmacogenomics.
                </p>

                <div className="landing-fade-in flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                    <button
                        onClick={() => navigate('/intake')}
                        className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-[#020617] font-bold rounded-full transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:-translate-y-1"
                    >
                        Join the Revolution
                    </button>
                    <div className="flex items-center bg-slate-800/50 border border-slate-700 rounded-full px-6 py-4 gap-4 backdrop-blur-sm">
                        <span className="text-2xl font-mono text-cyan-400 font-bold">99.8%</span>
                        <div className="w-[1px] h-8 bg-slate-600"></div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest text-left leading-tight">Clinical<br />Accuracy</span>
                    </div>
                </div>

                {/* Central Visual */}
                <div className="landing-fade-in relative w-full flex justify-center mt-8 -z-10 pointer-events-none text-cyan-400">
                    <CurvedLoop marqueeText="PHARMACOGENOMICS" curveAmount={400} speed={1} />
                </div>
            </main>

            {/* Feature Stack */}
            <section className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">The PrecisionRx Stack</h2>
                    <p className="text-slate-400">Engineered to reduce clinical risk without sacrificing efficiency.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { icon: Cpu, title: "AI-Driven Analysis", desc: "Spotting risk patterns in genomic data using advanced ML models." },
                        { icon: Shield, title: "HIPAA Compliant", desc: "Enterprise-grade security ensuring patient data remains sovereign and protected." },
                        { icon: CheckCircle, title: "Real-time Compliance", desc: "Automated checks against CPIC and FDA guidelines for every prescription." }
                    ].map((feature, i) => (
                        <div key={i} className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 transition-colors group">
                            <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-6 text-cyan-400 group-hover:scale-110 transition-transform">
                                <feature.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                            <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 py-12 px-6 border-t border-slate-800 bg-[#020617]">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <Activity className="text-cyan-500" size={20} />
                        <span className="font-bold text-slate-200">PrecisionRx</span>
                    </div>
                    <p className="text-slate-500 text-sm">© 2026 PrecisionRx HealthTech. All rights reserved.</p>
                    <div className="flex gap-6 text-sm font-bold text-slate-400">
                        <a href="#" className="hover:text-cyan-400 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-cyan-400 transition-colors">Terms</a>
                        <a href="#" className="hover:text-cyan-400 transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
