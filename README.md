<div align="center">
  <div style="margin-bottom: 24px;">
    <h2>🧬 PrecisionRx</h2>
    <p><strong>Precision Medicine for the Digital Age</strong></p>
  </div>
  
  <p align="center">
    <a href="#features">Features</a> • 
    <a href="#architecture">Architecture</a> • 
    <a href="#getting-started">Getting Started</a> • 
    <a href="#screenshots">Screenshots</a>
  </p>
</div>

<br />

PrecisionRx is a cutting-edge clinical pharmacogenomics platform that turns complex genomic data into actionable, life-saving clinical insights. By analyzing patient DNA (via VCF files) alongside prescribed medications, it identifies potential adverse drug events and optimizes therapy based on rigorous CPIC guidelines and AI-driven analysis.

---

## 🚀 Features

- **Genomic Intake Hub:** Securely ingest genomic sequencing data (VCF files) with automated validation and parsing.
- **Pharmacogenomic Assessment:** Instantly calculate genetic metabolizer phenotypes (Poor, Intermediate, Normal, Rapid, Ultrarapid) across key CPIC genes (e.g., CYP2C19, CYP2D6).
- **Clinical Dashboard:** Provide an at-a-glance overview of a patient's metabolic profile, current medications, risks, and actionable recommendations.
- **Deep-Dive Console:** Explore precise genomic variants, view AI-generated clinical explanations, check detailed confidence scores, and generate PDF clinical reports.
- **AI Integration:** Seamlessly leverage advanced Language Models (Google Gemini & OpenAI) to generate comprehensive clinical summaries and explanations for detected pharmacogenetic interactions.
- **Enterprise-Grade UI/UX:** A sleek, fully animated glassmorphic interface powered by React, Tailwind CSS, GSAP, and liquid WebGL rendering.

---

## 🏗 Architecture

The platform is split into two robust services:

### 1. Frontend (React + Vite)
- **Framework:** React 19, TypeScript, React Router
- **Styling:** Tailwind CSS V4, Lucide Icons, Custom CSS variables
- **Animations:** GSAP (Greensock), Framer Motion, Three.js (LiquidEther effects)
- **State/Routing:** React Router DOM

### 2. Backend (Python + FastAPI)
- **Framework:** FastAPI / Uvicorn
- **AI Engine:** `google-generativeai` (Gemini-2.0-Flash) and `openai` integrations
- **Data Parsing:** Handles clinical `.vcf` formats representing patient genomic variations
- **Auth:** Python-dotenv for secure API key configuration

---

## 📸 Screenshots

### 1. Landing Page
*Precision Medicine powered by your DNA.*
![Landing Page](./assets/Landing%20Page.png)

### 2. Intake Hub
*Securely drop VCF sequencing results and pair with current medications.*
![Intake Hub](./assets/Intake%20Hub.png)

### 3. Clinical Dashboard
*At-a-glance metabolizer phenotypes, active alerts, and CPIC guided actions.*
![Clinical Dashboard](./assets/Clinical%20Dashboard.png)

### 4. Deep-Dive Console
*Detailed variant inspection, AI-synthesized reasoning, and PDF clinical export capability.*
![Deep-Dive Console](./assets/Deep-Dive%20Console.png)

---

## 🛠 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### 1. Backend Setup
Navigate to the `Backend` directory and set up your python environment:
```bash
cd Backend
python -m venv .venv
# Activate venv (Windows)
.venv\Scripts\activate
# Activate venv (Mac/Linux)
source .venv/bin/activate

# Install dependencies
pip install fastapi uvicorn google-generativeai openai python-dotenv pydantic

# Create your .env file
echo "GEMINI_API_KEY=YOUR_API_KEY_HERE" > .env

# Run the backend server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
*(Alternatively, execute the `run_server.ps1` script if on Windows PowerShell).*

### 2. Frontend Setup
In a separate terminal, navigate to the application root to run the React client:
```bash
# Install NPM dependencies
npm install

# Start the Vite development server
npm run dev
```

The app will become available at `http://localhost:5173`.

---

## 🛡 Disclaimer
*PrecisionRx is an educational and proof-of-concept software project. It is not an FDA-approved medical device and should not be used in isolation to make independent clinical decisions without review by a certified geneticist and attending physician.*
