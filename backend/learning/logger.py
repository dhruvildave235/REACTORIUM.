# learning/logger.py

import csv
import os

CSV_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "data",
    "chem_data.csv"
)

def log_prediction(components, prediction, novelty="Novel"):
    row = {
        "components": "+".join(components),
        "compound_class": prediction["compound_class"],
        "toxicity": prediction["toxicity"],
        "solubility": prediction["solubility"],
        "stability": prediction["stability"],
        "confidence": prediction["confidence"],
        "novelty_flag": novelty,
        "feedback_text": "Auto-generated prediction",
        "verified": "No"
    }

    with open(CSV_PATH, "a", newline="") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=row.keys()
        )
        writer.writerow(row)
