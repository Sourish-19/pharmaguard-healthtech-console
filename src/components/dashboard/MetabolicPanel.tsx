import React from 'react';
import { Activity } from 'lucide-react';
import { PharmacogenomicProfile } from '../../types';

interface MetabolicPanelProps {
    profile?: PharmacogenomicProfile;
}

const MetabolicPanel: React.FC<MetabolicPanelProps> = ({ profile }) => {
    // Use real data if available, otherwise fallback (or show 'Unknown')
    const percentage = profile ? (profile.phenotype === 'NM' ? 100 : profile.phenotype === 'IM' ? 68 : profile.phenotype === 'PM' ? 20 : 50) : 0;
    const genePair = profile?.primary_gene || "CYP2D6 / CYP2C19";
    const clearanceRate = profile ? (profile.phenotype === 'NM' ? 'Normal' : 'Reduced') : "N/A";
    const enzymeActivity = profile ? (profile.phenotype === 'NM' ? 'Normal' : 'Altered') : "N/A";

    // Determine status color/glow based on phenotype
    let statusColor = "text-emerald-400";
    let statusGlow = "shadow-emerald-500/20";
    let progressColor1 = "#34d399"; // emerald-400
    let progressColor2 = "#10b981"; // emerald-500

    if (profile?.phenotype === 'IM' || profile?.phenotype === 'Indeterminate') {
        statusColor = "text-amber-400";
        statusGlow = "shadow-amber-500/20";
        progressColor1 = "#fbbf24"; // amber-400
        progressColor2 = "#f59e0b"; // amber-500
    } else if (profile?.phenotype === 'PM' || profile?.phenotype === 'Poor Metabolizer') {
        statusColor = "text-red-400";
        statusGlow = "shadow-red-500/20";
        progressColor1 = "#f87171"; // red-400
        progressColor2 = "#ef4444"; // red-500
    }

    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-cyan-500/30 p-6 flex flex-col h-full relative overflow-hidden group shadow-2xl">
            {/* Background decoration */}
            <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/5 to-white/0 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none transition-opacity duration-700 group-hover:opacity-100 opacity-30`}></div>

            {/* Header */}
            <div className="flex items-start gap-4 mb-6 relative z-10">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-cyan-400 shadow-inner">
                    <Activity size={20} />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Metabolic Efficiency</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                        <p className="text-xs text-slate-400 font-mono tracking-wider">{genePair}</p>
                    </div>
                </div>
            </div>

            {/* Main Circular Gauge */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-10 py-2">
                <div className="relative w-64 h-64 flex items-center justify-center">
                    {/* Outer Glow */}
                    <div className={`absolute inset-0 ${statusGlow} shadow-[0_0_80px_rgba(0,0,0,0)] rounded-full opacity-20`}></div>

                    <svg className="w-full h-full transform -rotate-90 drop-shadow-2xl" viewBox="0 0 120 120">
                        <defs>
                            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor={progressColor1} />
                                <stop offset="100%" stopColor={progressColor2} />
                            </linearGradient>
                            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        {/* Background Track */}
                        <circle
                            cx="60"
                            cy="60"
                            r="54"
                            stroke="#0f172a"
                            strokeWidth="6"
                            fill="transparent"
                            strokeLinecap="round"
                            className="opacity-50"
                        />
                        {/* Progress Circle */}
                        <circle
                            cx="60"
                            cy="60"
                            r="54"
                            stroke="url(#gaugeGradient)"
                            strokeWidth="6"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                            filter="url(#glow)"
                        />
                    </svg>

                    {/* Centered Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <div className="flex flex-col items-center justify-center transform translate-y-1">
                            <span className="text-6xl font-bold text-white tracking-tighter drop-shadow-lg">{percentage}%</span>
                            <div className="flex flex-col mt-2 space-y-0.5">
                                <span className={`text-[10px] ${statusColor} font-bold uppercase tracking-[0.25em] drop-shadow-md`}>
                                    {profile?.phenotype || 'Unknown'}
                                </span>
                                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.25em]">Metabolizer</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mt-6 relative z-10">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <p className="text-[9px] text-slate-400 uppercase font-bold mb-1 tracking-wider">Clearance Rate</p>
                    <p className="text-lg font-mono text-white font-medium">{clearanceRate}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <p className="text-[9px] text-slate-400 uppercase font-bold mb-1 tracking-wider">Enzyme Activity</p>
                    <p className={`text-lg font-bold ${statusColor} uppercase`}>{enzymeActivity}</p>
                </div>
            </div>
        </div>
    );
};

export default MetabolicPanel;
