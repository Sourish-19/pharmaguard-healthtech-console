from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import uuid
from app.database import db
from app.auth import router as auth_router

from app.llm_engine import safe_generate_explanation
from app.vcf_parser import parse_vcf
from app.phenotype_engine import infer_diplotype, infer_phenotype
from app.drug_rules import assess_drug_risk
from app.recommendations import RECOMMENDATIONS

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# @app.on_event("startup")
# async def startup_db_client():
#     db.connect()

# @app.on_event("shutdown")
# async def shutdown_db_client():
#     db.close()

app.include_router(auth_router, prefix="/auth", tags=["Authentication"])

# ==============================
# HEALTH CHECK
# ==============================
@app.get("/")
def home():
    return {"message": "PrecisionRx Backend Running Successfully"}


@app.get("/health")
def health():
    return {"status": "ok"}


# ==============================
# VCF VALIDATION FUNCTION
# ==============================
async def validate_vcf(file: UploadFile):
    if not file.filename.endswith(".vcf"):
        raise HTTPException(status_code=400, detail="Only .vcf files allowed")

    content = (await file.read()).decode("utf-8", errors="ignore")

    if "##fileformat=VCF" not in content:
        raise HTTPException(status_code=400, detail="Invalid VCF format")

    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File exceeds 5MB limit")

    file.file.seek(0)


# ==============================
# MAIN ANALYSIS ENDPOINT
# ==============================
@app.post("/analyze")
async def analyze_vcf(
    vcf_file: UploadFile = File(...),
    drug: str = Form(...)
):

    # STEP 1: Validate file
    await validate_vcf(vcf_file)
    vcf_file.file.seek(0)

    # STEP 2: Parse VCF
    variants = await parse_vcf(vcf_file)

    if not variants:
        raise HTTPException(status_code=400, detail="No pharmacogenomic variants detected")

    # STEP 3: Multi-drug parsing
    drug_list = [d.strip().upper() for d in drug.split(",")]

    patient_id = str(uuid.uuid4())
    timestamp = datetime.utcnow().isoformat() + "Z"

    drug_assessments = []

    # STEP 4: Process first drug only (Single Object Requirement)
    single_drug = drug_list[0]

    rule_check = assess_drug_risk(single_drug, "NM")

    if not rule_check or not rule_check[1]:
        raise HTTPException(status_code=400, detail=f"Unsupported drug: {single_drug}")

    gene = rule_check[1].get("gene")

    # STEP 5: Genetics inference
    # Detect if gene is completely missing from VCF (Safety Check)
    genes_found_in_vcf = set(v.get("gene") for v in variants if v.get("gene"))
    
    if gene not in genes_found_in_vcf:
        # If the gene for this drug wasn't found in the VCF, assume missing data
        diplotype = "Unknown"
        phenotype = "Indeterminate"
        risk = "Unknown"
        rule = {"severity": "none"}
    else:
        diplotype = infer_diplotype(variants, gene)
        phenotype = infer_phenotype(gene, diplotype)

        # STEP 6: Risk assessment
        if phenotype == "Unknown":
            risk = "Unknown"
            rule = {}
        else:
            result = assess_drug_risk(single_drug, phenotype)
            if not result:
                risk = "Unknown"
                rule = {}
            else:
                risk, rule = result

    # STEP 7: Filter gene-specific variants
    gene_variants = [v for v in variants if v.get("gene") == gene]

    # STEP 8: LLM explanation
    llm_explanation = safe_generate_explanation(
        gene,
        phenotype,
        single_drug,
        gene_variants
    )

    # STEP 9: Build drug assessment object (SINGLE OBJECT - EXACT SCHEMA)
    response = {
        "patient_id": patient_id,
        "drug": single_drug,
        "timestamp": timestamp,

        "risk_assessment": {
            "risk_label": risk,
            "confidence_score": 0.95,
            "severity": rule.get("severity", "none")
        },

        "pharmacogenomic_profile": {
            "primary_gene": gene,
            "diplotype": diplotype,
            "phenotype": phenotype,
            "detected_variants": [
                {
                    "rsid": v.get("rsid", "N/A"),
                    "gene": v.get("gene", "Unknown"),
                    "chromosome": v.get("chromosome", "Unknown"),
                    "position": v.get("position", "Unknown")
                }
                for v in gene_variants
            ]
        },

        "clinical_recommendation": {
            "guideline": "CPIC",
            "action": RECOMMENDATIONS.get(
                risk, "Consult clinical guidelines"
            ),
            "alternatives": {
                "CODEINE": ["Morphine", "Non-opioid analgesics"],
                "WARFARIN": ["Direct Oral Anticoagulants"],
                "CLOPIDOGREL": ["Prasugrel", "Ticagrelor"]
            }.get(single_drug, [])
        },

        "llm_generated_explanation": {
            "summary": llm_explanation.get("summary", ""),
            "mechanism": llm_explanation.get("mechanism", ""),
            "citations": llm_explanation.get("citations", ["CPIC guidelines"])
        },

        "quality_metrics": {
            "vcf_parsing_success": True,
            "variants_detected": len(variants),
            "genes_identified": list(
                set(v.get("gene") for v in variants if v.get("gene"))
            )
        }
    }

    return response
