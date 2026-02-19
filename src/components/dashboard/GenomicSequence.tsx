import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Variant } from '../../types';
import { Scan, ZoomIn, ZoomOut, Maximize2, Crosshair } from 'lucide-react';

interface GenomicSequenceProps {
  variants: Variant[];
}

const GenomicSequence: React.FC<GenomicSequenceProps> = ({ variants }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const helixRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!helixRef.current) return;

    const basePairs = helixRef.current.querySelectorAll('.base-pair');

    // Rotate Helix
    gsap.to(helixRef.current, {
      rotation: 360,
      duration: 30,
      repeat: -1,
      ease: "none",
      transformOrigin: "50% 50%"
    });

    // Pulse Base Pairs
    basePairs.forEach((bp, i) => {
      gsap.fromTo(bp,
        { opacity: 0.3 },
        {
          opacity: 1,
          duration: 1.5,
          delay: i * 0.05,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        }
      );
    });

    // Scanner Line Animation
    gsap.fromTo(".scanner-line",
      { top: "0%" },
      { top: "100%", duration: 4, repeat: -1, ease: "linear", yoyo: true }
    );

  }, []);

  const renderHelix = () => {
    const pairs = [];
    const height = 400;
    const width = 120;
    const steps = 20;

    for (let i = 0; i < steps; i++) {
      const y = (i / steps) * height;
      const angle = (i / steps) * Math.PI * 6; // More twists
      const x1 = Math.sin(angle) * (width / 2) + (width / 2);
      const x2 = Math.sin(angle + Math.PI) * (width / 2) + (width / 2);

      // Simple visualization logic: if we have variants, highlight some steps
      const isHotspot = variants.length > 0 && (i % Math.max(1, Math.floor(steps / variants.length)) === 0) && i < variants.length * 3;

      pairs.push(
        <g key={i} className={`base-pair ${isHotspot ? 'hotspot' : ''}`}>
          <line
            x1={x1} y1={y} x2={x2} y2={y}
            stroke={isHotspot ? "#ef4444" : "#0ea5e9"}
            strokeWidth={isHotspot ? 2 : 1}
            strokeOpacity={isHotspot ? 1 : 0.4}
          />
          <circle cx={x1} cy={y} r={isHotspot ? 5 : 2} fill={isHotspot ? "#ef4444" : "#22d3ee"} className={isHotspot ? "animate-pulse" : ""} />
          <circle cx={x2} cy={y} r={isHotspot ? 5 : 2} fill={isHotspot ? "#ef4444" : "#22d3ee"} className={isHotspot ? "animate-pulse" : ""} />
          {isHotspot && (
            <g>
              <line x1={x2 + 10} y1={y} x2={width + 40} y2={y} stroke="#ef4444" strokeWidth={1} strokeDasharray="2,2" />
              <rect x={width + 40} y={y - 12} width={110} height={24} rx={4} fill="#ef444422" stroke="#ef4444" strokeWidth={1} />
              <text x={width + 95} y={y + 4} textAnchor="middle" fill="#fca5a5" fontSize="10" className="font-mono uppercase font-bold tracking-wider">
                {variants[Math.floor(i / 3)]?.rsid || 'SNP DETECTED'}
              </text>
            </g>
          )}
        </g>
      );
    }
    return pairs;
  };

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col items-center justify-center bg-[#020617] rounded-3xl border border-cyan-500/30 p-6 relative overflow-hidden group shadow-2xl">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-20"
        style={{ backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#020617] pointer-events-none"></div>

      {/* Scanner Effect */}
      <div className="scanner-line absolute left-0 w-full h-[2px] bg-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.8)] z-10 pointer-events-none"></div>

      {/* HUD Corners */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-lg"></div>
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-500/30 rounded-tr-lg"></div>
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cyan-500/30 rounded-bl-lg"></div>
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-500/30 rounded-br-lg"></div>

      {/* Header Info */}
      <div className="absolute top-6 left-8 flex flex-col z-20">
        <div className="flex items-center gap-2 mb-1">
          <Scan size={14} className="text-cyan-400 animate-pulse" />
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Live Sequence Analysis</span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-widest font-mono">CHR 22<span className="text-slate-600 mx-2">|</span>LOC <span className="text-cyan-400">42,522,613</span></h2>
      </div>

      <div className="absolute top-6 right-8 flex flex-col items-end z-20 space-y-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700 backdrop-blur-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] text-slate-300 font-mono font-bold">CONNECTED</span>
        </div>
        <span className="text-[9px] text-slate-500 font-mono">ZOOM: 400x</span>
      </div>

      {/* 3D Helix Placeholder */}
      <svg ref={helixRef} width="350" height="500" viewBox="-40 0 350 400" className="mt-4 z-10 drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
        {renderHelix()}
      </svg>

      {/* Controls */}
      <div className="absolute bottom-8 z-20 flex gap-3 p-2 bg-slate-900/80 backdrop-blur rounded-2xl border border-slate-700/50 shadow-xl">
        <button className="p-2.5 rounded-xl hover:bg-slate-700 text-slate-400 hover:text-white transition-all"><ZoomOut size={18} /></button>
        <button className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-cyan-500/20 flex items-center gap-2">
          <Crosshair size={14} /> Analyze Region
        </button>
        <button className="p-2.5 rounded-xl hover:bg-slate-700 text-slate-400 hover:text-white transition-all"><ZoomIn size={18} /></button>
        <div className="w-[1px] h-6 bg-slate-700 my-auto"></div>
        <button className="p-2.5 rounded-xl hover:bg-slate-700 text-slate-400 hover:text-white transition-all"><Maximize2 size={18} /></button>
      </div>
    </div>
  );
};

export default GenomicSequence;
