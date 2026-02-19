import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, ArrowRight, Shield, Lock, CheckCircle2, ChevronLeft, User, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";

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
        <div className="min-h-screen w-full flex bg-white dark:bg-black text-slate-900 dark:text-slate-100 font-sans selection:bg-cyan-500/30">

            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
                {/* Back to Home Button */}
                <button
                    onClick={() => navigate('/')}
                    className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors font-medium text-sm"
                >
                    <ChevronLeft size={16} /> Back to Home
                </button>

                <div className="max-w-md w-full space-y-8">
                    <div className="text-left">
                        <h1 className="text-4xl font-bold tracking-tight mb-2">
                            {isSignUp ? "Create an Account" : "Welcome back!"}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400">
                            {isSignUp
                                ? "Join PharmaGuard to access AI-driven genomic insights."
                                : "Securely access your genomic analysis dashboard."}
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-5">
                        {isSignUp && (
                            <div className="space-y-2 animate-in slide-in-from-left-4 fade-in duration-300">
                                <label className="text-sm font-medium leading-none" htmlFor="name">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 text-slate-400" size={16} />
                                    <input
                                        type="text"
                                        id="name"
                                        placeholder="Dr. Sarah Connor"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="flex h-12 w-full rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-3 pl-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all font-medium"
                                        required={isSignUp}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="doctor@clinic.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex h-12 w-full rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="flex h-12 w-full rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                                required
                            />
                        </div>

                        {isSignUp && (
                            <div className="space-y-2 animate-in slide-in-from-left-4 fade-in duration-300">
                                <label className="text-sm font-medium leading-none" htmlFor="confirmPassword">Confirm Password</label>
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-3 text-slate-400" size={16} />
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="flex h-12 w-full rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-3 pl-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                                        required={isSignUp}
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
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

                    <div className="text-center pt-4">
                        <p className="text-sm text-slate-500 mb-2">
                            {isSignUp ? "Already have an account?" : "Don't have an account?"}
                        </p>
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300 font-bold text-sm transition-colors"
                        >
                            {isSignUp ? "Sign In instead" : "Create an Account"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Side - Visuals */}
            <div className="hidden lg:flex w-1/2 bg-slate-950 relative overflow-hidden items-center justify-center p-12">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/40 via-slate-950 to-slate-950"></div>
                <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: 'linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)', backgroundSize: '60px 60px' }}>
                </div>

                <div className="relative z-10 max-w-lg space-y-6">
                    <div className="p-6 rounded-2xl bg-white/5 border border-cyan-500/30 backdrop-blur-md shadow-2xl space-y-4">
                        <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
                            <Shield size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Enterprise-Grade Security</h2>
                        <p className="text-slate-400 leading-relaxed">
                            PharmaGuard utilizes end-to-end encryption complying with HIPAA and GDPR standards, ensuring your patient's genomic data remains sovereign.
                        </p>
                        <div className="flex gap-3 pt-4 border-t border-cyan-500/30">
                            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1">
                                <CheckCircle2 size={12} /> HIPAA Compliant
                            </div>
                            <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold flex items-center gap-1">
                                <Lock size={12} /> SOC2 Ready
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/5 border border-cyan-500/30 backdrop-blur-md shadow-2xl opacity-60 scale-95 origin-top">
                        <div className="h-4 w-1/3 bg-slate-700/50 rounded mb-4"></div>
                        <div className="h-2 w-full bg-slate-700/30 rounded mb-2"></div>
                        <div className="h-2 w-2/3 bg-slate-700/30 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
