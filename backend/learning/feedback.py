# learning/feedback.py

import pandas as pd
import os

CSV_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "data",
    "chem_data.csv"
)

def verify_prediction(components):
    df = pd.read_csv(CSV_PATH)

    key = "+".join(sorted(components))

    mask = df["components"] == key
    df.loc[mask, "verified"] = "Yes"
    df.loc[mask, "feedback_text"] = "User verified"

    df.to_csv(CSV_PATH, index=False)
