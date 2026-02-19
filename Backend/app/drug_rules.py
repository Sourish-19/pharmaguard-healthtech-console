DRUG_RULES = {
    "CODEINE": {
        "gene": "CYP2D6",
        "risk_map": {
            "PM": "Ineffective",
            "IM": "Adjust Dosage",
            "NM": "Safe",
            "UM": "Toxic"
        }
    },
    "WARFARIN": {
        "gene": "CYP2C9",
        "risk_map": {
            "PM": "Adjust Dosage",
            "IM": "Adjust Dosage",
            "NM": "Safe"
        }
    },
    "CLOPIDOGREL": {
        "gene": "CYP2C19",
        "risk_map": {
            "PM": "Ineffective",
            "IM": "Adjust Dosage",
            "NM": "Safe",
            "UM": "Safe"
        }
    },
    "SIMVASTATIN": {
        "gene": "SLCO1B1",
        "risk_map": {
            "PM": "Toxic",
            "IM": "Adjust Dosage",
            "NM": "Safe"
        }
    },
    "AZATHIOPRINE": {
        "gene": "TPMT",
        "risk_map": {
            "PM": "Toxic",
            "IM": "Adjust Dosage",
            "NM": "Safe"
        }
    },
    "FLUOROURACIL": {
        "gene": "DPYD",
        "risk_map": {
            "PM": "Toxic",
            "IM": "Adjust Dosage",
            "NM": "Safe"
        }
    }
}


def assess_drug_risk(drug, phenotype):
    rule = DRUG_RULES.get(drug.upper())

    if not rule:
        return "Unknown", None

    risk = rule["risk_map"].get(phenotype, "Unknown")
    return risk, rule
