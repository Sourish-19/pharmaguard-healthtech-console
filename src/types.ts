export interface RiskAssessment {
  risk_label: string;
  confidence_score: number;
  severity: string;
  color: string;
}

// MATCHES EXACT USER SCHEMA
export interface Variant {
  rsid: string;
  gene: string;
  chromosome: string;
  position: string;
  [key: string]: any;
}

export interface PharmacogenomicProfile {
  primary_gene: string;
  diplotype: string;
  phenotype: string;
  detected_variants: Variant[];
}

export interface ClinicalRecommendation {
  guideline: string; // Moved here
  action: string;    // Renamed from recommendation_text + description
  alternatives: string[]; // Moved here
}

export interface DrugAssessment {
  patient_id: string;
  drug: string;
  timestamp: string;

  risk_assessment: {
    risk_label: string;
    confidence_score: number;
    severity: string;
  };

  pharmacogenomic_profile: PharmacogenomicProfile;

  clinical_recommendation: ClinicalRecommendation;

  llm_generated_explanation: {
    summary: string;
    mechanism: string;
    citations: string[];
  };

  quality_metrics: {
    vcf_parsing_success: boolean;
    variants_detected: number;
    genes_identified: string[];
  };
}

// The API now returns a SINGLE DrugAssessment object
export type AnalysisResponse = DrugAssessment;

export type AnalysisResult = DrugAssessment;
