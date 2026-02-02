# learning/retrain.py

import pandas as pd
import subprocess
import os

CSV_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "data",
    "chem_data.csv"
)

def should_retrain(min_new=3):
    df = pd.read_csv(CSV_PATH)
    new_verified = df[
        (df["verified"] == "Yes") &
        (df["novelty_flag"] == "Novel")
    ]
    return len(new_verified) >= min_new


def retrain_if_needed():
    if should_retrain():
        subprocess.run(
            ["python", "ml/train_model.py"],
            check=True
        )
        print("Model retrained successfully")
