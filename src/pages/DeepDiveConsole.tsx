
import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Copy, Terminal as TerminalIcon, ShieldAlert, Download, Share2, Filter, FileSpreadsheet, CheckCircle2, Activity, User, Calendar, FileText } from 'lucide-react';
import TextType from '../components/ui/TextType';

import { useLocation } from 'react-router-dom';
import { AnalysisResponse, Variant } from '../types';

const DeepDiveConsole: React.FC = () => {
  const location = useLocation();
  // Try location state first, then fallback to localStorage
  const analysisData: AnalysisResponse | null = location.state?.analysisData || (() => {
    const stored = localStorage.getItem('lastAnalysisData');
    return stored ? JSON.parse(stored) : null;
  })();

  const [copied, setCopied] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'actionable' | 'high-risk'>('all');

  useEffect(() => {
    // Only animate if on screen
    const isPrint = window.matchMedia('print').matches;
    if (!isPrint) {
      gsap.fromTo(".console-section",
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, []);

  const handleCopy = () => {
    let textToCopy = "";
    if (analysisData) {
      textToCopy = JSON.stringify(analysisData, null, 2);
    }
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleFilterToggle = () => {
    if (filterMode === 'all') setFilterMode('actionable');
    else if (filterMode === 'actionable') setFilterMode('high-risk');
    else setFilterMode('all');
  };

  const handleExportCSV = () => {
    if (!analysisData) {
      alert("No analysis data available to export.");
      return;
    }

    const variants = analysisData.pharmacogenomic_profile?.detected_variants || [];

    // Fallback if no specific variants detected
    if (variants.length === 0) {
      const mainFinding = [
        analysisData.pharmacogenomic_profile.primary_gene,
        'N/A',
        'N/A',
        'N/A',
        analysisData.pharmacogenomic_profile.diplotype || 'Unknown',
        analysisData.pharmacogenomic_profile.phenotype || 'Indeterminate'
      ];

      const headers = ['Gene', 'RSID', 'Chromosome', 'Position', 'Genotype (Diplotype)', 'Predicted Phenotype'];
      const csvContent = [headers.join(','), mainFinding.join(',')].join('\n');

      downloadCSV(csvContent, `precisionrx_summary_${analysisData.patient_id}.csv`);
      return;
    }

    const headers = ['Gene', 'RSID', 'Chromosome', 'Position', 'Genotype', 'Phenotype'];
    const rows = variants.map(v => [
      v.gene || 'Unknown',
      v.rsid || 'N/A',
      v.chromosome || 'N/A',
      v.position || 'N/A',
      v.genotype || 'N/A',
      v.phenotype || analysisData.pharmacogenomic_profile.phenotype || 'Unknown'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    downloadCSV(csvContent, `precisionrx_analysis_${analysisData.patient_id}.csv`);
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (!analysisData) return;

    const shareData = {
      title: 'PrecisionRx Genomic Report',
      text: `Genomic Analysis for ${analysisData.drug}: ${analysisData.risk_assessment.risk_label} risk detected. Phenotype: ${analysisData.pharmacogenomic_profile.phenotype}.`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.text);
        alert('Report summary copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const jsonSample = analysisData ? JSON.stringify(analysisData, null, 2) : "";

  // Filter Logic
  const getFilteredVariants = () => {
    if (!analysisData) return [];
    let variants = analysisData.pharmacogenomic_profile.detected_variants || [];

    if (variants.length === 0) {
      return [{
        gene: analysisData.pharmacogenomic_profile.primary_gene,
        rsid: 'N/A',
        chromosome: 'N/A',
        position: 'N/A',
        diplotype: analysisData.pharmacogenomic_profile.diplotype,
        phenotype: analysisData.pharmacogenomic_profile.phenotype,
        actionable: true,
        score: analysisData.risk_assessment.confidence_score
      }];
    }

    if (filterMode === 'actionable') return variants;
    if (filterMode === 'high-risk') return variants;
    return variants;
  };

  const displayVariants = getFilteredVariants();

  if (!analysisData) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex flex-col items-center justify-center h-[80vh] text-center space-y-6">
        <div className="bg-slate-900/50 p-6 rounded-full border border-slate-800 relative group">
          <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <ShieldAlert size={48} className="text-slate-500 relative z-10" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">No Analysis Data Found</h2>
          <p className="text-slate-400 max-w-md mx-auto">
            Please initiate a new analysis from the Intake Hub.
          </p>
        </div>
        <button
          onClick={() => window.location.href = '#/intake'}
          className="px-8 py-3 bg-cyan-500 text-black font-bold rounded-xl hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20 uppercase tracking-widest text-sm"
        >
          Go to Intake Hub
        </button>
      </div>
    );
  }

  return (
    <>
      {/* =========================================================================
          PRINT LAYOUT (Prescription Style)
          - Hidden on screen
          - Block on print
      ========================================================================= */}
      <div className="hidden print:block font-serif-print text-black p-8 max-w-[210mm] mx-auto bg-white h-auto">

        {/* -- Header -- */}
        <div className="flex justify-between items-end border-b-4 border-black pb-6 mb-8">
          <div className="flex items-center gap-4">
            {/* Logo Placeholder */}
            <div className="w-12 h-12 border-2 border-black flex items-center justify-center rounded-full">
              <Activity size={24} className="text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter leading-none mb-1">PrecisionRx</h1>
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-600">Precision Medicine Panel</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-sm">CLINICAL REPORT</p>
            <p className="text-xs text-gray-500">Generated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* -- Patient Info Box -- */}
        <div className="border border-black p-4 mb-8 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Patient Name</p>
            <p className="font-bold text-lg font-mono">doe, john</p> {/* Mock name or from auth */}
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Patient ID</p>
            <p className="font-mono text-lg">{analysisData.patient_id}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Date of Birth</p>
            <p className="font-mono">--/--/----</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Referring Physician</p>
            <p className="font-mono">Dr. Alexander Fleming</p>
          </div>
        </div>

        {/* -- Rx / Clinical Action -- */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3 border-b border-gray-300 pb-1">
            <FileText size={18} />
            <h2 className="text-lg font-bold uppercase">Clinical Interpretation & Action</h2>
          </div>

          <div className="bg-gray-50 p-6 border-l-4 border-black">
            <div className="flex items-start gap-4">
              <span className="text-4xl font-serif font-bold text-gray-400 italic" style={{ fontFamily: 'serif' }}>Rx</span>
              <div>
                <p className="font-bold text-xl mb-2">Drug: {analysisData.drug}</p>
                <p className="text-lg leading-relaxed mb-4">
                  {analysisData.clinical_recommendation.action}
                </p>
                {analysisData.clinical_recommendation.alternatives.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-bold uppercase text-gray-500 mb-1">Alternatives</p>
                    <p className="font-mono">{analysisData.clinical_recommendation.alternatives.join(', ')}</p>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-4 italic">
                  Guideline: {analysisData.clinical_recommendation.guideline}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* -- Variant Table -- */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3 border-b border-gray-300 pb-1">
            <Activity size={18} />
            <h2 className="text-lg font-bold uppercase">Genomic Findings</h2>
          </div>

          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="py-2 font-bold uppercase text-xs">Gene</th>
                <th className="py-2 font-bold uppercase text-xs">Diplotype</th>
                <th className="py-2 font-bold uppercase text-xs">Phenotype</th>
                <th className="py-2 font-bold uppercase text-xs text-right">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {displayVariants.map((v, i) => (
                <tr key={i} className="border-b border-gray-200">
                  <td className="py-3 font-mono font-bold">{v.gene}</td>
                  <td className="py-3 font-mono text-gray-600">{v.diplotype || v.rsid || 'N/A'}</td>
                  <td className="py-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold border ${(v.phenotype || '').includes('Poor') ? 'border-black bg-gray-200' : 'border-gray-300'
                      }`}>
                      {v.phenotype}
                    </span>
                  </td>
                  <td className="py-3 text-right font-mono">
                    {((v.score || analysisData.risk_assessment.confidence_score) * 100).toFixed(0)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* -- Footer / Signature -- */}
        <div className="mt-auto pt-12">
          <div className="grid grid-cols-2 gap-12">
            <div>
              <div className="border-b border-black mb-2 h-8"></div>
              <p className="text-xs font-bold uppercase">Electronically Signed By</p>
              <p className="text-sm">PrecisionRx AI System v2.4</p>
            </div>
            <div>
              <div className="border-b border-black mb-2 h-8"></div>
              <p className="text-xs font-bold uppercase">Verified By (Physician)</p>
              <p className="text-sm">License #________________</p>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 mt-8 text-center uppercase tracking-wider">
            This report is a clinical decision support tool. Final dosing decisions are the responsibility of the treating physician.
            <br />CONFIDENTIAL • PRECISIONRX INC. • {new Date().getFullYear()}
          </p>
        </div>

      </div>


      {/* =========================================================================
          SCREEN LAYOUT (Futuristic Console)
          - Hidden on print
          - Block on screen
      ========================================================================= */}
      <div className="relative p-6 h-full overflow-hidden bg-[#020617] text-white print:hidden">

        {/* Background Ambience */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          </div>
        </div>

        <div className="relative z-10 h-full flex flex-col max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 p-4 bg-slate-900/40 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-xl shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-lg shadow-cyan-500/20">
                <FileSpreadsheet size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Deep-Dive Console</h1>
                <p className="text-xs text-slate-400 font-medium">Detailed Genomic Analysis & Matrix</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleFilterToggle}
                className={`flex items-center gap-2 px-4 py-2 font-bold text-sm rounded-xl border transition-all ${filterMode !== 'all'
                  ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400 border-cyan-500/30'
                  }`}>
                <Filter size={16} /> {filterMode === 'all' ? 'Filter' : filterMode === 'actionable' ? 'Actionable' : 'High Risk'}
              </button>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-sm rounded-xl border border-emerald-500/20 transition-all">
                <Download size={16} /> Export CSV
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar space-y-8">
            <div className="console-section">
              <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-cyan-500/30 overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-50"></div>

                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/20 border-b border-cyan-500/30">
                      <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Gene Symbol</th>
                      <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Diplotype / RSID</th>
                      <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Predicted Phenotype</th>
                      <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Actionable</th>
                      <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Confidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {displayVariants.map((variant: any, i: number) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors group">
                        <td className="px-8 py-5 font-bold text-white font-mono text-sm group-hover:text-emerald-400 transition-colors">
                          {variant.gene}
                        </td>
                        <td className="px-8 py-5">
                          <span className="px-2.5 py-1 rounded-md bg-slate-950/50 border border-slate-700 text-xs text-slate-300 font-mono shadow-sm">
                            {variant.diplotype || variant.rsid || 'N/A'}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-2 h-2 rounded-full shadow-[0_0_8px] ${(variant.phenotype || '').includes('Rapid') ? 'bg-amber-500 shadow-amber-500/50' :
                              (variant.phenotype || '').includes('Poor') ? 'bg-red-500 shadow-red-500/50' : 'bg-emerald-500 shadow-emerald-500/50'
                              }`}></div>
                            <span className="text-sm font-medium text-slate-300">{variant.phenotype || 'Unknown'}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${variant.actionable !== false ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-800/50 border-slate-700 text-slate-600'
                            }`}>
                            {variant.actionable !== false ? <CheckCircle2 size={14} /> : <span className="text-xs font-bold">×</span>}
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(variant.score || analysisData.risk_assessment.confidence_score) * 100}%` }}></div>
                            </div>
                            <span className="font-mono text-xs text-slate-500 group-hover:text-white transition-colors">
                              {((variant.score || analysisData.risk_assessment.confidence_score) * 100).toFixed(0)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {displayVariants.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-8 py-8 text-center text-slate-500 italic">
                          No variants detected matching the current filter filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Clinical Explanation */}
              <div className="console-section space-y-4">
                <div className="flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-cyan-500/10 rounded-lg">
                      <ShieldAlert size={18} className="text-cyan-400" />
                    </div>
                    <h3 className="font-bold text-white uppercase tracking-wider text-sm">Clinical Interpretation</h3>
                  </div>
                  <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-1 rounded">AI GENERATED</span>
                </div>

                <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-cyan-500/30 p-8 relative overflow-y-auto no-scrollbar group shadow-2xl h-[540px]">
                  <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                  <div className="relative space-y-8">
                    <div>
                      <p className="text-slate-500 font-mono text-[10px] mb-2 uppercase tracking-widest">// Analysis_Log_Entry_#4421</p>
                      <h4 className="text-xl text-white font-light leading-snug">
                        Patient genotype indicates <span className="font-bold text-cyan-400">{analysisData.pharmacogenomic_profile.primary_gene} {analysisData.pharmacogenomic_profile.phenotype}</span> status.
                      </h4>
                    </div>

                    <div className="p-5 bg-amber-500/5 border border-amber-500/20 rounded-2xl relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
                      <div className="flex items-start gap-3">
                        <ShieldAlert size={20} className="text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-amber-400 text-xs font-bold mb-1 uppercase tracking-wider">Clinical Warning</p>
                          <p className="text-slate-300 text-sm leading-relaxed">
                            {analysisData.clinical_recommendation.action}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-slate-400 text-sm leading-relaxed border-l-2 border-slate-700 pl-4 py-1">
                        Recommendation based on <strong>{analysisData.clinical_recommendation.guideline}</strong> guidelines.
                        {analysisData.clinical_recommendation.alternatives.length > 0 && (
                          <span className="block mt-2">
                            Consider alternatives: <span className="text-cyan-400 font-semibold">{analysisData.clinical_recommendation.alternatives.join(", ")}</span>
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="pt-4 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
                      <span className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest">Awaiting Physician Review</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Raw Terminal Output */}
              <div className="console-section space-y-4">
                <div className="flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-slate-800 rounded-lg">
                      <TerminalIcon size={18} className="text-slate-400" />
                    </div>
                    <h3 className="font-bold text-white uppercase tracking-wider text-sm">Raw JSON Response</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-emerald-500">24ms latency</span>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                    >
                      {copied ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                      {copied ? 'COPIED' : 'COPY_JSON'}
                    </button>
                  </div>
                </div>

                <div className="bg-[#0b121f] rounded-3xl border border-cyan-500/30 overflow-hidden flex flex-col font-mono text-xs shadow-2xl h-[540px]">
                  {/* Terminal Header */}
                  <div className="bg-[#0f172a] px-4 py-3 border-b border-cyan-500/30 flex items-center justify-between shrink-0">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded bg-black/40 border border-slate-800">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-slate-500 text-[10px] font-mono">api/v1/analyze</span>
                    </div>
                    <div className="w-10"></div> {/* Spacer */}
                  </div>

                  {/* Terminal Body */}
                  <div className="flex-1 overflow-y-auto p-6 json-scrollbar bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-90">
                    <TextType
                      text={jsonSample}
                      typingSpeed={2}
                      cursorCharacter="█"
                      className="text-emerald-400/90 font-mono text-xs leading-relaxed selection:bg-emerald-500/30 selection:text-white"
                      loop={false}
                    />
                  </div>

                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-all">
                    <Share2 size={16} /> Share
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-2 px-6 py-2 rounded-lg bg-cyan-500 text-[#0f172a] font-bold text-xs hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20">
                    <Download size={16} /> Download PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeepDiveConsole;
