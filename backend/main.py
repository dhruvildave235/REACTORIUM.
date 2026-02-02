


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List

from nlp.parser import parse
from brain.reasoner import reason
from learning.logger import log_prediction
from learning.feedback import verify_prediction
from learning.retrain import retrain_if_needed

from brain.geometry import smiles_to_3d


app = FastAPI()

# ------------------ CORS ------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # dev mode
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------ FRONTEND ------------------
app.mount("/static", StaticFiles(directory="frontend/static"), name="static")

@app.get("/")
def serve_ui():
    return FileResponse("frontend/index.html")

# ------------------ MODELS ------------------

class AnalyzeRequest(BaseModel):
    text: str

class Atom3D(BaseModel):
    element: str
    x: float
    y: float
    z: float

class ResultModel(BaseModel):
    compound_class: str
    toxicity: str
    solubility: str
    stability: str
    confidence: float
    rule_class: str
    smiles: str
    structure_3d: List[Atom3D]

class AnalyzeResponse(BaseModel):
    components: List[str]
    results: List[ResultModel]

# ------------------ API ------------------
COMPONENT_NORMALIZATION = {
    "alcohol": "Alcohol",
    "amine": "Amine",
    "aldehyde": "Aldehyde",
    "ketone": "Ketone",
    "carboxylic_acid": "Carboxylic Acid",
    "acid": "Acid",
    "base": "Base",
    "aromatic_ring": "Aromatic Ring",
    "nitro": "Nitro",
    "ester": "Ester",
    "amide": "Amide"
}

def normalize_components(raw_components):
    normalized = []
    for c in raw_components:
        key = c.lower().replace(" ", "_")
        normalized.append(COMPONENT_NORMALIZATION.get(key, c))
    return normalized

@app.post("/analyze")
def analyze(data: dict):
    text = data.get("text", "")
    ui_constraints = data.get("constraints", {})
    ui_components = data.get("components")  # 👈 NEW

    if ui_components:
        # ✅ TRUST SELECT MODE
        normalized_components = normalize_components(ui_components)
        parsed_constraints = {}
    else:
        parsed_components, parsed_constraints = parse(text)
        normalized_components = normalize_components(parsed_components)

    constraints = {**parsed_constraints, **ui_constraints}

    print("✅ NORMALIZED COMPONENTS:", normalized_components)
    print("⚙️ FINAL CONSTRAINTS:", constraints)

    results = reason(normalized_components, constraints)

    return {
        "components": normalized_components,
        "results": results,
        "conditions": constraints
    }





@app.post("/feedback")
def feedback(components: List[str]):
    verify_prediction(components)
    return {
        "status": "verified",
        "components": components
        
    }

@app.post("/retrain")
def retrain():
    retrain_if_needed()
    return {"status": "checked"}

from fastapi import FastAPI
from pydantic import BaseModel
import csv
import os

CSV_PATH = "data/chem_data.csv"

class CSVRow(BaseModel):
    components: str
    compound_class: str
    toxicity: str
    solubility: str
    stability: str
    confidence: float
    novelty_flag: str
    feedback_text: str
    verified: str

@app.post("/add-row")
def add_row(row: CSVRow):
    # print(" /add-row HIT")
    os.makedirs("data", exist_ok=True)

    file_exists = os.path.isfile(CSV_PATH)

    with open(CSV_PATH, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)

        if not file_exists:
            writer.writerow([
                "components",
                "compound_class",
                "toxicity",
                "solubility",
                "stability",
                "confidence",
                "novelty_flag",
                "feedback_text",
                "verified"
            ])

        writer.writerow([
            row.components,
            row.compound_class,
            row.toxicity,
            row.solubility,
            row.stability,
            row.confidence,
            row.novelty_flag,
            row.feedback_text,
            row.verified
        ])

    return {"status": "saved"}

@app.get("/health")
def health():
    return {"status": "ok", "app": "REACTORIUM"}

