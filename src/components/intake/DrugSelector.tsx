import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Activity, Plus } from 'lucide-react';
import { INITIAL_DRUGS } from '../../utils/cpicConstants';

interface DrugSelectorProps {
    selectedDrugs: string[];
    onToggleDrug: (drug: string) => void;
}

const SUPPORTED_DRUGS = Array.from(new Set([
    'Codeine', 'Warfarin', 'Clopidogrel', 'Simvastatin', 'Azathioprine', 'Fluorouracil',
    'Tamoxifen', 'Tacrolimus', 'Voriconazole', 'Ondansetron', 'Tropisetron',
    'Atorvastatin', 'Rosuvastatin', 'Sertraline', 'Citalopram', 'Escitalopram',
    'Amitriptyline', 'Nortriptyline', 'Venlafaxine', 'Paroxetine',
    ...INITIAL_DRUGS
])).sort();

const DrugSelector: React.FC<DrugSelectorProps> = ({ selectedDrugs, onToggleDrug }) => {
    const [search, setSearch] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Close suggestions when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const filteredDrugs = SUPPORTED_DRUGS.filter(d =>
        d.toLowerCase().includes(search.toLowerCase()) && !selectedDrugs.includes(d)
    );

    // De-dupe list
    const uniqueSuggestions = Array.from(new Set(filteredDrugs)).slice(0, 5);

    return (
        <div className="bg-[#020617]/80 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-6 space-y-6 relative overflow-visible shadow-2xl h-full flex flex-col" ref={wrapperRef}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-lg border border-white/10 shadow-inner">
                        <Activity size={18} className="text-cyan-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white uppercase tracking-widest text-sm">Target Medications</h3>
                        <p className="text-[10px] text-slate-500 font-mono">Select drugs for toxicological screening</p>
                    </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-slate-800/50 border border-white/5 text-xs font-mono text-cyan-400">
                    {selectedDrugs.length} SELECTED
                </div>
            </div>

            <div className="relative z-20">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setShowSuggestions(true); }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Search or filter drugs (e.g. Warfarin, Clopidogrel)..."
                    className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl py-4 pl-12 pr-6 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-900/80 transition-all shadow-inner"
                />

                {/* Autocomplete Dropdown */}
                {showSuggestions && search.length > 0 && uniqueSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#020617] border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2">
                        {uniqueSuggestions.map(drug => (
                            <button
                                key={drug}
                                onClick={() => {
                                    onToggleDrug(drug);
                                    setSearch('');
                                    setShowSuggestions(false);
                                }}
                                className="w-full text-left px-4 py-3 hover:bg-slate-800/50 text-slate-300 hover:text-cyan-400 text-sm flex items-center justify-between group transition-colors border-b border-white/5 last:border-0"
                            >
                                <span className="font-mono">{drug}</span>
                                <Plus size={14} className="opacity-0 group-hover:opacity-100 text-cyan-400 transition-opacity" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex flex-wrap gap-2 relative z-10 min-h-[40px]">
                {selectedDrugs.map(drug => (
                    <button
                        key={drug}
                        onClick={() => onToggleDrug(drug)}
                        className="pl-4 pr-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border bg-cyan-500/5 border-cyan-500/20 text-cyan-300 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 group"
                    >
                        {drug}
                        <div className="p-0.5 rounded-full bg-cyan-500/20 group-hover:bg-red-500/20 transition-colors">
                            <X size={10} />
                        </div>
                    </button>
                ))}
                {selectedDrugs.length === 0 && (
                    <div className="w-full py-8 text-center border-2 border-dashed border-slate-800 rounded-xl">
                        <p className="text-slate-600 text-xs font-mono uppercase tracking-widest">No drugs selected</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DrugSelector;
