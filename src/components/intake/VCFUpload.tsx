import React, { useState } from 'react';
import { Upload, FileText, X, AlertCircle, CheckCircle2, Scan } from 'lucide-react';
import { parseVCF, VCFParseResult } from '../../utils/vcfParser';
import { FileUpload } from '../ui/file-upload';

interface VCFUploadProps {
    onUploadComplete: (data: VCFParseResult, file: File) => void;
}

const VCFUpload: React.FC<VCFUploadProps> = ({ onUploadComplete }) => {
    // Removed isDragging state as FileUpload handles it internally
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const validateFile = (file: File): string | null => {
        if (!file.name.toLowerCase().endsWith('.vcf') && !file.name.toLowerCase().endsWith('.vcf.gz')) {
            return "Invalid file format. Please upload a .vcf or .vcf.gz file.";
        }
        if (file.size > 5 * 1024 * 1024) {
            return "File size exceeds 5MB limit.";
        }
        return null;
    };

    const handleFile = async (file: File) => {
        setError(null);
        const validationError = validateFile(file);
        if (validationError) {
            setError(validationError);
            return;
        }

        setFile(file);
        setIsProcessing(true);

        try {
            // Simulate slight delay for UX
            await new Promise(resolve => setTimeout(resolve, 800));
            const result = await parseVCF(file);
            onUploadComplete(result, file);
            setIsProcessing(false);
        } catch (err) {
            setError("Failed to parse VCF file. Please check the file integrity.");
            setIsProcessing(false);
            setFile(null);
        }
    };

    if (file && !error) {
        return (
            <div className="relative rounded-3xl border border-cyan-500/20 bg-[#020617]/80 backdrop-blur-xl p-8 flex flex-col items-center justify-center text-center h-auto min-h-[320px] group shadow-[0_0_40px_rgba(6,182,212,0.1)] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none"></div>

                {isProcessing && (
                    <div className="absolute inset-0 z-0">
                        <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500 shadow-[0_0_15px_#06b6d4] animate-[scan_2s_linear_infinite]"></div>
                    </div>
                )}

                <div className="w-24 h-24 rounded-full bg-cyan-500/10 flex items-center justify-center mb-6 relative z-10 border border-cyan-500/20">
                    {isProcessing ? (
                        <>
                            <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                            <Scan size={32} className="text-cyan-400 animate-pulse" />
                        </>
                    ) : (
                        <CheckCircle2 className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" size={48} />
                    )}
                </div>
                <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                    {isProcessing ? 'Sequencing Genome...' : 'Analysis Ready'}
                </h2>
                <p className="text-cyan-400 font-mono text-sm mb-8 bg-cyan-950/30 px-4 py-1.5 rounded-full border border-cyan-500/20">
                    {file.name}
                </p>

                {!isProcessing && (
                    <button
                        onClick={() => setFile(null)}
                        className="text-xs text-slate-500 hover:text-white transition-colors uppercase tracking-widest font-bold flex items-center gap-2 group/btn"
                    >
                        <X size={14} className="group-hover/btn:rotate-90 transition-transform" />
                        Upload different file
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="w-full relative group">
            <div className={`w-full max-w-4xl mx-auto min-h-96 border-2 border-dashed rounded-3xl overflow-hidden relative transition-all duration-300 ${error ? 'border-red-500/30 bg-red-500/5' : 'border-white/10 bg-[#020617]/80 backdrop-blur-xl hover:border-cyan-500/30 hover:bg-[#020617]/90'
                }`}>
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none"></div>

                <FileUpload onChange={(files) => {
                    if (files.length > 0) handleFile(files[0]);
                }} />

                {error && (
                    <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6 animate-bounce">
                            <AlertCircle className="text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Upload Failed</h3>
                        <p className="text-red-400 text-sm mb-6 max-w-xs mx-auto">{error}</p>
                        <button
                            onClick={() => setError(null)}
                            className="px-6 py-2.5 bg-red-500 hover:bg-red-400 rounded-xl text-sm font-bold text-white transition-all shadow-lg shadow-red-500/20"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>
            <div className="flex items-center justify-between px-4 mt-4">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
                    <p className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest">
                        System Ready
                    </p>
                </div>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                    Supported: .VCF, .VCF.GZ (MAX 5MB)
                </p>
            </div>
        </div>
    );
};

export default VCFUpload;
