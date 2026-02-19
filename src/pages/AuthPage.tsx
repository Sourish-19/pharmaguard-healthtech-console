import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, ArrowRight, Shield, Lock, CheckCircle2, ChevronLeft, User, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";
import LiquidEther from "../components/ui/LiquidEther";

export const AuthPage = () => {
    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const endpoint = isSignUp ? "http://127.0.0.1:8000/auth/signup" : "http://127.0.0.1:8000/auth/login";
        const payload = isSignUp
            ? { email, password, full_name: name }
            : { email, password };

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                // Determine token key (adjust based on backend response, assuming access_token)
                const token = data.access_token;
                localStorage.setItem("token", token);
                navigate("/intake");
            } else {
                alert(data.detail || "Authentication failed");
            }
        } catch (error) {
            console.error("Auth error:", error);
            alert("Connection error. Please check if backend is running.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#020617] text-slate-100 font-sans selection:bg-cyan-500/30 relative overflow-y-auto overflow-x-hidden">

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

            {/* Left Side - Form Container */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10 min-h-screen lg:min-h-0 py-24 lg:py-12">
                {/* Back to Home Button */}
                <button
                    onClick={() => navigate('/')}
                    className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-medium text-sm bg-slate-900/40 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700/50"
                >
                    <ChevronLeft size={16} /> Back to Home
                </button>

                {/* Glassmorphic Auth Card */}
                <div className="max-w-md w-full p-8 sm:p-10 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl space-y-8 mt-12 lg:mt-0">
                    <div className="text-left">
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-white">
                            {isSignUp ? "Create an Account" : "Welcome back!"}
                        </h1>
                        <p className="text-sm sm:text-base text-slate-400">
                            {isSignUp
                                ? "Join PrecisionRx to access AI-driven genomic insights."
                                : "Securely access your genomic analysis dashboard."}
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-5">
                        {isSignUp && (
                            <div className="space-y-2 animate-in slide-in-from-left-4 fade-in duration-300">
                                <label className="text-sm font-medium leading-none text-slate-300" htmlFor="name">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3.5 text-slate-500" size={16} />
                                    <input
                                        type="text"
                                        id="name"
                                        placeholder="Dr. Sarah Connor"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-3 pl-10 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all font-medium placeholder:text-slate-600"
                                        required={isSignUp}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none text-slate-300" htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="doctor@clinic.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all placeholder:text-slate-600"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none text-slate-300" htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all placeholder:text-slate-600"
                                required
                            />
                        </div>

                        {isSignUp && (
                            <div className="space-y-2 animate-in slide-in-from-left-4 fade-in duration-300">
                                <label className="text-sm font-medium leading-none text-slate-300" htmlFor="confirmPassword">Confirm Password</label>
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-3.5 text-slate-500" size={16} />
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-3 pl-10 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all placeholder:text-slate-600"
                                        required={isSignUp}
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-cyan-500 hover:bg-cyan-400 text-[#020617] font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-8 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                                    {isSignUp ? "Creating Account..." : "Signing In..."}
                                </>
                            ) : (
                                <>
                                    {isSignUp ? "Create Account" : "Sign In"} <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="text-center pt-2">
                        <p className="text-sm text-slate-400 mb-3">
                            {isSignUp ? "Already have an account?" : "Don't have an account?"}
                        </p>
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-cyan-400 hover:text-cyan-300 font-bold text-sm transition-colors py-2 px-4 rounded-full border border-cyan-500/20 bg-cyan-500/10 hover:bg-cyan-500/20"
                        >
                            {isSignUp ? "Sign In instead" : "Create an Account"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Side - Visuals */}
            <div className="hidden lg:flex w-1/2 relative items-center justify-center p-12 z-10 min-h-screen lg:min-h-0">
                <div className="relative z-10 max-w-lg space-y-6">
                    {/* Security Card */}
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl space-y-5 transform hover:-translate-y-2 transition-transform duration-500">
                        <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-2 border border-cyan-500/30">
                            <Shield size={28} />
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Enterprise-Grade Security</h2>
                        <p className="text-slate-300 leading-relaxed text-sm">
                            PrecisionRx utilizes end-to-end encryption complying with HIPAA and GDPR standards, ensuring your patient's genomic data remains sovereign and secure.
                        </p>
                        <div className="flex gap-3 pt-6 border-t border-white/10">
                            <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                                <CheckCircle2 size={14} /> HIPAA Compliant
                            </div>
                            <div className="px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold flex items-center gap-1.5">
                                <Lock size={14} /> SOC2 Ready
                            </div>
                        </div>
                    </div>

                    {/* Minimal decorative element matching standard layout design */}
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl opacity-50 scale-[0.98] origin-top translate-y-[-10px]">
                        <div className="h-4 w-1/3 bg-slate-700/50 rounded-full mb-5"></div>
                        <div className="h-2 w-full bg-slate-700/30 rounded-full mb-3"></div>
                        <div className="h-2 w-5/6 bg-slate-700/30 rounded-full mb-3"></div>
                        <div className="h-2 w-4/6 bg-slate-700/30 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
