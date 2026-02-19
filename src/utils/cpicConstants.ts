
import { DrugInteraction, AlleleData, DiagnosticStatus } from './types';

export const COLORS = {
  bg: '#0f172a',
  cyan: '#06b6d4',
  emerald: '#10b981',
  crimson: '#ef4444',
  amber: '#f59e0b',
  slate: '#1e293b',
};

export const MOCK_INTERACTIONS: DrugInteraction[] = [
  { name: 'Codeine', type: 'OPIOID ANALGESIC', status: 'TOXIC', note: 'Poor metabolizer. High risk of toxicity.' },
  { name: 'Warfarin', type: 'ANTICOAGULANT', status: 'ADJUST', note: 'Lower dose required. Monitor INR.' },
  { name: 'Lisinopril', type: 'ACE INHIBITOR', status: 'SAFE', note: 'Standard protocol applicable.' },
  { name: 'Metformin', type: 'ANTIDIABETIC', status: 'SAFE', note: 'No significant variants found.' },
  { name: 'Simvastatin', type: 'STATIN', status: 'ADJUST', note: 'Increased risk of myopathy.' },
];

export const MOCK_ALLELES: AlleleData[] = [
  { symbol: 'CYP2C19', diplotype: '*1/*17', phenotype: 'Rapid Metabolizer', actionable: true, score: 0.99 },
  { symbol: 'CYP2D6', diplotype: '*4/*4', phenotype: 'Poor Metabolizer', actionable: true, score: 0.98 },
  { symbol: 'SLCO1B1', diplotype: '*5/*5', phenotype: 'Low Function', actionable: false, score: 0.95 },
  { symbol: 'VKORC1', diplotype: '-1639G>A', phenotype: 'High Sensitivity', actionable: true, score: 0.92 },
];

export const DIAGNOSTICS: DiagnosticStatus[] = [
  { name: 'Genomic Engine', status: 'online', meta: 'Latency 24ms' },
  { name: 'LLM Cortex', status: 'connected', meta: 'Model v4.2' },
  { name: 'Database Sync', status: 'updating', meta: 'Up to date' },
  { name: 'Security Protocol', status: 'active', meta: 'Audit Logging On' },
];

export const INITIAL_DRUGS = ['Codeine', 'Warfarin', 'Simvastatin', 'Clopidogrel', 'Tamoxifen'];
