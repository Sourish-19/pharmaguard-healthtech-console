import React, { useState, useEffect } from 'react';
import { Lock, ChevronRight, Activity, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { DIAGNOSTICS } from '../utils/cpicConstants';
import VCFUpload from '../components/intake/VCFUpload';
import DrugSelector from '../components/intake/DrugSelector';
import { VCFParseResult } from '../utils/vcfParser';
import { analyzeVcf } from '../services/api';

const IntakeHub: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDrugs, setSelectedDrugs] = useState<string[]>(['Warfarin', 'Simvastatin']);
  const [vcfData, setVcfData] = useState<VCFParseResult | null>(null);
  const [vcfFile, setVcfFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    gsap.fromTo(".gsap-fade-in",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
    );
  }, []);

  const toggleDrug = (drug: string) => {
    setSelectedDrugs(prev =>
      prev.includes(drug) ? prev.filter(d => d !== drug) : [...prev, drug]
    );
  };

  const handleUploadComplete = (data: VCFParseResult, file: File) => {
    setVcfData(data);
    setVcfFile(file);
    setError(null);
  };

  const handleAnalysis = async () => {
    if (!vcfFile && selectedDrugs.length === 0) return;

    if (!vcfFile) {
      setError("Please upload a VCF file to proceed.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await analyzeVcf(vcfFile, selectedDrugs);
      // Persist data for page reloads/sidebar navigation
      localStorage.setItem('lastAnalysisData', JSON.stringify(response));
      navigate('/dashboard', { state: { analysisData: response } });
    } catch (err: any) {
      console.error("Analysis failed", err);
      setError(err.response?.data?.detail || "Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Fixed Bento Grid Layout
  return (
    <div className="relative p-4 md:p-6 h-full overflow-hidden bg-[#020617] text-white">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        </div>
      </div>

      <div className="relative z-10 h-full max-w-[1920px] mx-auto flex flex-col">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6 p-4 bg-slate-900/40 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-lg shadow-cyan-500/20">
              <Activity size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Intake Hub</h1>
              <p className="text-xs text-slate-400 font-medium">Data Ingestion & Pre-processing</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest hidden sm:inline-block">System Online</span>
          </div>
        </div>

        {/* Main Bento Grid Layout */}
        <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-4 gap-6 pb-2">

          {/* Left Column: Input Zone (Span 3 on large screens) */}
          <div className="xl:col-span-3 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">

            {/* Error Banner */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-2 shadow-[0_0_30px_rgba(239,68,68,0.1)] shrink-0">
                <div className="p-2 bg-red-500/20 rounded-full">
                  <AlertCircle className="text-red-500" size={24} />
                </div>
                <div>
                  <h4 className="text-red-400 font-bold text-sm uppercase tracking-wider">System Alert</h4>
                  <p className="text-red-300/80 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* VCF Upload Area */}
            <div className="gsap-fade-in shrink-0">
              <VCFUpload onUploadComplete={handleUploadComplete} />
              <div className="flex items-center gap-2 mt-3 px-2 opacity-50">
                <Lock size={14} className="text-slate-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">End-to-End Encrypted</span>
              </div>
            </div>

            {/* Drug Selection & Action Grid */}
            <div className="gsap-fade-in grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6 h-full">
              <div className="h-full min-h-[300px]">
                <DrugSelector selectedDrugs={selectedDrugs} onToggleDrug={toggleDrug} />
              </div>

              {/* Action Card */}
              <div
                className={`flex flex-col justify-between p-8 rounded-3xl border transition-all cursor-pointer group relative overflow-hidden h-full min-h-[300px] ${vcfData || selectedDrugs.length > 0
                  ? 'bg-gradient-to-br from-cyan-900/20 to-[#020617]/90 border-cyan-500/30 hover:border-cyan-400/50 shadow-2xl shadow-cyan-900/10'
                  : 'bg-[#020617]/80 border-cyan-500/30 opacity-50 grayscale pointer-events-none'
                  } ${isAnalyzing ? 'pointer-events-none' : ''}`}
                onClick={handleAnalysis}
              >
                {/* Animated Background for Action Card */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(6,182,212,0.1),_transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors mb-6 shadow-inner ${vcfData || selectedDrugs.length > 0 ? 'bg-cyan-500 text-[#0f172a] shadow-cyan-500/20' : 'bg-slate-800 text-slate-500'}`}>
                    {isAnalyzing ? (
                      <div className="w-6 h-6 border-2 border-[#0f172a] border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Activity size={28} />
                    )}
                  </div>

                  <h4 className={`text-2xl font-bold mb-2 ${vcfData || selectedDrugs.length > 0 ? 'text-white' : 'text-slate-400'}`}>
                    {isAnalyzing ? 'Processing...' : 'Initialize Analysis'}
                  </h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {isAnalyzing
                      ? 'Running LLM analysis on variants...'
                      : vcfData
                        ? 'Ready to process genomic data and generate report.'
                        : 'Upload VCF to proceed.'}
                  </p>
                </div>

                {!isAnalyzing && (
                  <div className="mt-8 flex items-center gap-2 text-cyan-400 text-sm font-bold uppercase tracking-widest group-hover:gap-4 transition-all">
                    <span>Begin Analysis</span>
                    <ChevronRight size={16} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Diagnostics (Span 1 on large screens, hidden on small if needed or stacked) */}
          <div className="hidden xl:flex flex-col gap-6 h-full overflow-hidden">
            <div className="flex-1 bg-[#020617]/50 backdrop-blur-xl rounded-[23px] border border-cyan-500/30 p-6 flex flex-col shadow-2xl overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between mb-8 border-b border-cyan-500/30 pb-4 shrink-0">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">System Diagnostics</h3>
                <div className="px-2 py-1 rounded bg-white/5 border border-cyan-500/30 text-[10px] font-mono text-slate-400">
                  PID: #8821-X
                </div>
              </div>

              <div className="space-y-4 flex-1">
                {DIAGNOSTICS.map((diag, i) => (
                  <div key={i} className="flex gap-4 group cursor-default p-2 rounded-xl hover:bg-white/5 transition-colors">
                    <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${diag.status === 'online' || diag.status === 'connected' || diag.status === 'active'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}>
                      {diag.status === 'active'
                        ? <Shield size={18} />
                        : <CheckCircle2 size={18} />
                      }
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{diag.name}</h4>
                      <p className="text-[10px] text-slate-500 font-mono mt-1">
                        <span className="capitalize text-slate-400">{diag.status}</span>
                        {diag.meta && <span className="text-slate-600"> • {diag.meta}</span>}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-6 border-t border-cyan-500/30 shrink-0">
                <div className="bg-black/40 rounded-xl p-5 border border-cyan-500/30 relative overflow-hidden h-32 flex flex-col justify-end">
                  <div className="flex justify-between items-end mb-2 relative z-10 transition-all">
                    <span className="text-[10px] font-mono text-cyan-500 uppercase font-bold flex items-center gap-2">
                      <Activity size={12} /> Live Traffic
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">24ms</span>
                  </div>

                  <div className="flex items-end gap-1 h-12 relative z-10">
                    {[40, 70, 50, 85, 30, 45, 60, 40, 25, 65, 45, 70, 35, 55, 40, 70, 50, 85].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-cyan-500 rounded-t-sm opacity-60"
                        style={{
                          height: `${h}%`,
                          animation: `pulse-cyan ${1.5 + Math.random()}s infinite ease-in-out`,
                          opacity: (i + 5) / 25
                        }}
                      ></div>
                    ))}
                  </div>
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-cyan-500/5 pointer-events-none"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntakeHub;
