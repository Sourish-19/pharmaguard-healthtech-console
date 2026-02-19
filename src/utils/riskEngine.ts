import { AnalysisResult, RiskAssessment, PharmacogenomicProfile, LLMExplanation, ClinicalRecommendation } from '../types';
import { VCFParseResult } from './vcfParser';

// Mock database of gene-drug interactions
const DRUG_GENE_MAP: Record<string, string> = {
    'WARFARIN': 'CYP2C9', // And VKORC1, but simplifying for now
    'CLOPIDOGREL': 'CYP2C19',
    'CODEINE': 'CYP2D6',
    'SIMVASTATIN': 'SLCO1B1',
    'AZATHIOPRINE': 'TPMT',
    'FLUOROURACIL': 'DPYD'
};

const MOCK_PHENOTYPES = {
    'CYP2C19': { diplotype: '*1/*17', phenotype: 'RM', risk: 'Ineffective' }, // Rapid Metabolizer
    'CYP2D6': { diplotype: '*4/*4', phenotype: 'PM', risk: 'Toxic' }, // Poor Metabolizer
    'SLCO1B1': { diplotype: '*5/*5', phenotype: 'PM', risk: 'Toxic' },
    'CYP2C9': { diplotype: '*1/*1', phenotype: 'NM', risk: 'Safe' },
    'TPMT': { diplotype: '*1/*3A', phenotype: 'IM', risk: 'Adjust Dosage' },
    'DPYD': { diplotype: '*1/*1', phenotype: 'NM', risk: 'Safe' }
};

export const analyzeRisk = async (
    vcfData: VCFParseResult | null,
    drugName: string
): Promise<AnalysisResult> => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const gene = DRUG_GENE_MAP[drugName.toUpperCase()] || 'UNKNOWN_GENE';

    // In a real app, we would look up specific variants in vcfData.variants
    // For this hackathon mock, we'll return deterministic "interesting" results 
    // based on the drug name to show off the UI capabilities.

    const mockData = MOCK_PHENOTYPES[gene as keyof typeof MOCK_PHENOTYPES] || {
        diplotype: '*1/*1',
        phenotype: 'NM',
        risk: 'Safe'
    };

    const riskLabel = mockData.risk as RiskAssessment['risk_label'];

    let severity: RiskAssessment['severity'] = 'none';
    if (riskLabel === 'Toxic') severity = 'critical';
    if (riskLabel === 'Ineffective') severity = 'high';
    if (riskLabel === 'Adjust Dosage') severity = 'moderate';

    const llmSummary = generateLLMSummary(drugName, gene, mockData.phenotype, riskLabel);

    return {
        patient_id: "PATIENT_8821",
        drug: drugName,
        timestamp: new Date().toISOString(),
        risk_assessment: {
            risk_label: riskLabel,
            confidence_score: 0.98,
            severity: severity
        },
        pharmacogenomic_profile: {
            primary_gene: gene,
            diplotype: mockData.diplotype,
            phenotype: mockData.phenotype as any,
            detected_variants: [
                { rsid: "rs12248560", genotype: "C/T", significance: "Pathogenic" },
                { rsid: "rs28399433", genotype: "G/G", significance: "Benign" }
            ]
        },
        clinical_recommendation: generateRecommendation(drugName, riskLabel),
        llm_generated_explanation: llmSummary,
        quality_metrics: {
            vcf_parsing_success: true,
            variant_coverage: 0.99
        }
    };
};

function generateLLMSummary(drug: string, gene: string, phenotype: string, risk: string): LLMExplanation {
    const isBad = risk !== 'Safe';

    return {
        summary: `Analysis of ${gene} indicates the patient is a ${phenotype} (${phenotype === 'NM' ? 'Normal Metabolizer' : phenotype === 'PM' ? 'Poor Metabolizer' : 'Rapid Metabolizer'}). ${isBad
                ? `This poses a significant risk for ${drug} therapy due to altered metabolism.`
                : `Metabolism of ${drug} is expected to be normal.`
            }`,
        mechanism: isBad
            ? `Genetic variants in ${gene} result in ${phenotype === 'PM' ? 'absent' : 'increased'} enzyme activity. Consequently, plasma concentrations of ${drug} (or its active metabolite) will be ${phenotype === 'PM' ? 'dangerously high' : 'insufficiently low'}.`
            : `Wild-type alleles detected. Enzyme kinetics conform to standard population models.`,
        citation: "CPIC Guideline for " + drug
    };
}

function generateRecommendation(drug: string, risk: string): ClinicalRecommendation {
    if (risk === 'Toxic') {
        return {
            limitations: ["Standard dosing contraindicated"],
            alternative_drugs: ["Alternative Agent A", "Alternative Agent B"],
            monitoring: "Therapeutic drug monitoring required if used."
        };
    }
    if (risk === 'Ineffective') {
        return {
            limitations: ["Likely therapeutic failure"],
            dosage_adjustment: "Consider 200-300% dose increase or switch class",
            monitoring: "Monitor clinical response closely."
        };
    }
    if (risk === 'Adjust Dosage') {
        return {
            limitations: ["Increased sensitivity predicted"],
            dosage_adjustment: "Reduce starting dose by 50%",
            monitoring: "Weekly INR monitoring"
        };
    }
    return {
        limitations: [],
        dosage_adjustment: "Standard dosing",
        monitoring: "Standard of care"
    };
}
