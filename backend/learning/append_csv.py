import pandas as pd
from datetime import datetime

CSV_PATH = "data/chem_dataset.csv"

def append_row(data: dict):
    df = pd.read_csv(CSV_PATH)

    df = pd.concat([df, pd.DataFrame([data])], ignore_index=True)

    df.to_csv(CSV_PATH, index=False)
