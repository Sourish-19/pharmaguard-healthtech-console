from google import genai

import os
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


# Load environment variables
load_dotenv()

# Create Gemini client
api_key = os.getenv("GEMINI_API_KEY")
client = None
if api_key and api_key != "YOUR_API_KEY_HERE":
    try:
        client = genai.Client(api_key=api_key)
    except Exception as e:
        print(f"Failed to initialize Gemini client: {e}")



def safe_generate_explanation(gene, phenotype, drug, variants):
    if not client:
        return {
            "summary": f"{gene} affects metabolism of {drug}. Phenotype: {phenotype}.",
            "mechanism": "LLM explanation unavailable (API Key missing).",
            "citations": ["CPIC guidelines"]
        }

    try:
        prompt = f"""
        Explain pharmacogenomic interaction.

        Gene: {gene}
        Phenotype: {phenotype}
        Drug: {drug}

        Provide:
        1. Simple summary
        2. Mechanism of interaction
        3. Clinical significance
        """

        response = client.models.generate_content(
            model="gemini-1.5-flash",   # ✅ CORRECT MODEL
            contents=prompt
        )

        text = response.text

        return {
            "summary": text[:200],
            "mechanism": text[200:400],
            "citations": ["Gemini AI"]
        }

    except Exception as e:
        print("🚨 GEMINI ERROR:", e)

        return {
            "summary": f"{gene} affects metabolism of {drug}. Phenotype: {phenotype}.",
            "mechanism": "Fallback explanation",
            "citations": ["CPIC guidelines"]
        }
