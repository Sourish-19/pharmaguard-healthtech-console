import requests
import io

API_URL = "http://127.0.0.1:8000"

def test_analyze():
    # Create a dummy VCF content
    vcf_content = """##fileformat=VCFv4.2
#CHROM	POS	ID	REF	ALT	QUAL	FILTER	INFO
22	42522613	rs16947	G	A	.	.	GENE=CYP2D6
"""
    vcf_file = io.BytesIO(vcf_content.encode('utf-8'))
    vcf_file.name = "test.vcf"

    files = {'vcf_file': ('test.vcf', vcf_file, 'text/x-vcf')}
    data = {'drug': 'CODEINE'}

    print("Sending request to /analyze...")
    try:
        response = requests.post(f"{API_URL}/analyze", files=files, data=data)
        print(f"Status Code: {response.status_code}")
        print("Response JSON:")
        print(response.json())
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_analyze()
