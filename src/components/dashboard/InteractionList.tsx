import React from 'react';
import { AlertTriangle, CheckCircle, AlertCircle, Info, ChevronRight, FileText, Activity } from 'lucide-react';
import { DrugAssessment } from '../../types';

interface InteractionListProps {
    results: DrugAssessment[];
}

const CompactDrugCard: React.FC<{ result: DrugAssessment }> = ({ result }) => {
    // Determine status style
    let statusColor = "text-emerald-400";
    let statusBg = "bg-emerald-500/10";
    let borderColor = "border-emerald-500/20";
    let shadowColor = "shadow-emerald-500/10";
    let Icon = CheckCircle;
    let label = "SAFE";

    // FIX: use risk_label instead of risk_level
    const risk = result.risk_assessment.risk_label.toUpperCase();

    if (risk.includes("TOXIC") || risk.includes("HIGH")) {
        statusColor = "text-red-400";
        statusBg = "bg-red-500/10";
        borderColor = "border-red-500/20";
        shadowColor = "shadow-red-500/10";
        Icon = AlertCircle;
        label = "TOXIC";
    } else if (risk.includes("ADJUST") || risk.includes("MODERATE") || risk.includes("INEFFECTIVE")) {
        statusColor = "text-amber-400";
        statusBg = "bg-amber-500/10";
        borderColor = "border-amber-500/20";
        shadowColor = "shadow-amber-500/10";
        Icon = AlertTriangle;
        label = "ADJUST";
    } else if (risk === "UNKNOWN") {
        statusColor = "text-slate-400";
        statusBg = "bg-slate-500/10";
        borderColor = "border-slate-500/20";
        shadowColor = "shadow-slate-500/10";
        Icon = Info;
        label = "UNKNOWN";
    }

    return (
        <div className={`bg-white/5 backdrop-blur-sm rounded-2xl border ${borderColor} p-4 mb-3 transition-all duration-300 hover:bg-white/10 hover:shadow-lg ${shadowColor} group relative overflow-hidden`}>
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${statusBg.replace('/10', '/50')}`}></div>

            <div className="flex items-start justify-between mb-3 pl-2">
                <div>
                    <h4 className="font-bold text-white text-lg tracking-tight">{result.drug}</h4>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
                        {/* Mock Category */}
                        {result.drug === 'Warfarin' ? 'Anticoagulant' : result.drug === 'Codeine' ? 'Opioid Analgesic' : 'Medication'}
                    </p>
                </div>
                <div className={`px-2.5 py-1 rounded-lg border ${borderColor} text-[10px] font-bold uppercase ${statusBg} ${statusColor} shadow-sm`}>
                    {label}
                </div>
            </div>

            <div className="flex items-start gap-3 mt-3 pl-2">
                <Icon size={16} className={`shrink-0 mt-0.5 ${statusColor}`} />
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                    {result.llm_generated_explanation.summary.substring(0, 85) + (result.llm_generated_explanation.summary.length > 85 ? "..." : "")}
                </p>
            </div>

            <div className="mt-4 p-3 bg-black/20 rounded-xl border border-white/5 ml-2">
                <div className="flex items-start gap-2">
                    <FileText size={14} className="text-cyan-400 mt-0.5 shrink-0" />
                    <div className="flex-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Recommendation ({result.clinical_recommendation.guideline})</span>
                        <p className="text-sm text-slate-200 leading-relaxed font-medium">
                            {result.clinical_recommendation.action}
                        </p>
                    </div>
                </div>

                {result.clinical_recommendation.alternatives.length > 0 && (
                    <div className="mt-3 pl-6 border-l border-white/10 ml-1.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Consider Alternatives</span>
                        <div className="flex flex-wrap gap-2">
                            {result.clinical_recommendation.alternatives.map((alt, i) => (
                                <span key={i} className="text-[10px] px-2 py-1 bg-white/5 hover:bg-white/10 rounded-md border border-white/10 text-slate-300 transition-colors cursor-default">
                                    {alt}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const InteractionList: React.FC<InteractionListProps> = ({ results }) => {
    // Sort results by severity
    const getSeverityScore = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'high': return 3;
            case 'moderate': return 2;
            case 'low': return 1;
            default: return 0;
        }
    };

    const orderedResults = [...(results || [])].sort((a, b) =>
        getSeverityScore(b.risk_assessment.severity) - getSeverityScore(a.risk_assessment.severity)
    );

    return (
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-cyan-500/30 p-6 h-full flex flex-col shadow-2xl relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg border border-white/10">
                        <Activity size={18} className="text-purple-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Detected Interactions</h3>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">Real-time Analysis</p>
                    </div>
                </div>
                <div className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] text-slate-400 font-mono">
                    {orderedResults.length} DETECTED
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-0 no-scrollbar space-y-2 relative z-10">
                {(orderedResults || []).map((result, index) => (
                    <CompactDrugCard key={index} result={result} />
                ))}

                {(!results || results.length === 0) && (
                    <div className="opacity-50 pointer-events-none grayscale blur-[2px]">
                        <CompactDrugCard result={{
                            drug: "Metformin",
                            risk_assessment: { risk_label: "Safe", confidence_score: 1, severity: "none" },
                            pharmacogenomic_profile: {
                                primary_gene: "ATM",
                                diplotype: "*1/*1",
                                phenotype: "Normal Metabolizer",
                                detected_variants: []
                            },
                            clinical_recommendation: {
                                guideline: "CPIC",
                                action: "Standard dosing recommended.",
                                alternatives: []
                            },
                            llm_generated_explanation: { summary: "No significant variants found.", mechanism: "", citations: [] },
                            quality_metrics: {
                                vcf_parsing_success: true,
                                variants_detected: 0,
                                genes_identified: []
                            },
                            patient_id: "MOCK",
                            timestamp: ""
                        }} />
                    </div>
                )}
            </div>

            {/* Fade at bottom for scroll indication */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-900/90 to-transparent pointer-events-none z-20"></div>
        </div>
    );
};

export default InteractionList;
