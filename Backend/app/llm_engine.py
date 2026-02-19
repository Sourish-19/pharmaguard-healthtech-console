import os
import json
from google import genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key) if api_key and api_key != "YOUR_API_KEY_HERE" else None

def safe_generate_explanation(gene, phenotype, drug, variants):
    if not client:
        return {
            "summary": f"{gene} affects metabolism of {drug}. Phenotype: {phenotype}.",
            "mechanism": "LLM explanation unavailable (API Key missing).",
            "citations": ["CPIC guidelines"]
        }

    try:
        prompt = f"""
        You are a pharmacogenomics expert. Output strictly JSON. Include three keys: 'summary' (max 200 chars), 'mechanism' (max 400 chars), and 'citations' (an array of strings). Keep explanations accurate, clinical, and easy to understand.
        
        Explain the pharmacogenomic interaction.
        Gene: {gene}
        Phenotype: {phenotype}
        Drug: {drug}
        Variants: {variants}
        """

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
            config=genai.types.GenerateContentConfig(response_mime_type="application/json")
        )

        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:-3]
        elif text.startswith("```"):
            text = text[3:-3]

        data = json.loads(text.strip())

        return {
            "summary": data.get("summary", f"{gene} affects metabolism of {drug}."),
            "mechanism": data.get("mechanism", "Mechanism unavailable."),
            "citations": data.get("citations", ["Gemini AI", "CPIC guidelines"])
        }

    except Exception as e:
        print("GEMINI ERROR:", str(e))

        return {
            "summary": f"{gene} affects metabolism of {drug}. Phenotype: {phenotype}.",
            "mechanism": "Fallback explanation due to LLM error.",
            "citations": ["CPIC guidelines"]
        }
