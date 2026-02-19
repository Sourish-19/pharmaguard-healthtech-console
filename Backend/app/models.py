from pydantic import BaseModel
from typing import List, Optional


class VariantModel(BaseModel):
    rsid: str
    gene: str
    star: Optional[str]
    chromosome: str
    position: str


class RiskAssessment(BaseModel):
    risk_label: str
    confidence_score: float
    severity: str


class PharmacogenomicProfile(BaseModel):
    primary_gene: str
    diplotype: str
    phenotype: str
    detected_variants: List[VariantModel]


class ClinicalRecommendation(BaseModel):
    recommendation_text: str


class FullResponse(BaseModel):
    patient_id: str
    drug: str
    timestamp: str
    risk_assessment: RiskAssessment
    pharmacogenomic_profile: PharmacogenomicProfile
    clinical_recommendation: ClinicalRecommendation
    llm_generated_explanation: str
    quality_metrics: dict
