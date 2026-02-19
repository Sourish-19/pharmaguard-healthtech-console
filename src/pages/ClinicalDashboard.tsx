
import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Activity, Download, FileJson, Share2 } from 'lucide-react';
import { AnalysisResponse, DrugAssessment } from '../types';
import { analyzeRisk } from '../utils/riskEngine';
import { useNavigate } from 'react-router-dom';
import MetabolicPanel from '../components/dashboard/MetabolicPanel';
import GenomicSequence from '../components/dashboard/GenomicSequence';
import InteractionList from '../components/dashboard/InteractionList';

import { useLocation } from 'react-router-dom';

const ClinicalDashboard: React.FC = () => {
  const location = useLocation();
  const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Try location state first
    if (location.state?.analysisData) {
      setAnalysisData(location.state.analysisData);
      setLoading(false);
      animateIn();
    } else {
      // Fallback to localStorage
      const stored = localStorage.getItem('lastAnalysisData');
      if (stored) {
        try {
          setAnalysisData(JSON.parse(stored));
          setLoading(false);
          animateIn();
        } catch (e) {
          console.error("Failed to parse stored analysis data", e);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
  }, [location.state, navigate]);

  const animateIn = () => {
    setTimeout(() => {
      gsap.fromTo(".result-card",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
      );
    }, 100);
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(analysisData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "pharmaguard_analysis.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="relative p-6 h-full overflow-hidden bg-[#020617]">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        </div>
      </div>

      <div className="relative z-10 h-full flex flex-col">
        {/* Header / Actions */}
        <div className="flex justify-between items-center mb-6 p-4 bg-slate-900/40 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-lg shadow-cyan-500/20">
              <Activity size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Clinical Dashboard</h1>
              <p className="text-xs text-slate-400 font-medium">Real-time Pharmacogenomic Analysis</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/deep-dive', { state: { analysisData } })}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-cyan-400 font-bold text-sm rounded-xl border border-cyan-500/20 transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] backdrop-blur-md"
              disabled={loading || !analysisData}
            >
              <FileJson size={16} /> Raw Analysis
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02]"
              disabled={loading || !analysisData}
            >
              <Download size={16} /> Export Report
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-slate-800 rounded-full"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Activity size={24} className="text-cyan-500 animate-pulse" />
              </div>
            </div>
            <p className="text-cyan-400/80 animate-pulse font-mono text-sm uppercase tracking-widest">Generating Genomic Risk Profile...</p>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-6 h-full min-h-0 pb-2">
            {/* Left Panel: Metabolic Efficiency */}
            <div className="col-span-12 lg:col-span-3 h-full min-h-0 gsap-slide-up">
              <MetabolicPanel profile={analysisData.pharmacogenomic_profile} />
            </div>

            {/* Center Panel: Genomic Sequence */}
            <div className="col-span-12 lg:col-span-6 h-full min-h-0 gsap-slide-up" style={{ animationDelay: '0.1s' }}>
              <GenomicSequence variants={analysisData.pharmacogenomic_profile.detected_variants || []} />
            </div>

            {/* Right Panel: Interaction List */}
            <div className="col-span-12 lg:col-span-3 h-full min-h-0 gsap-slide-up" style={{ animationDelay: '0.2s' }}>
              <InteractionList results={[analysisData]} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClinicalDashboard;
