# ml/predict.py

import pickle
import numpy as np
import os

# Get absolute path to model.pkl
BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")

with open(MODEL_PATH, "rb") as f:
    models = pickle.load(f)


def predict_compound(components_str):
    components = components_str.split("+")

    X = models["component_encoder"].transform([components])

    compound = models["compound_encoder_label"].inverse_transform(
        models["compound_model"].predict(X)
    )[0]

    toxicity = models["tox_encoder"].inverse_transform(
        models["tox_model"].predict(X)
    )[0]

    solubility = models["sol_encoder"].inverse_transform(
        models["sol_model"].predict(X)
    )[0]

    stability = models["stab_encoder"].inverse_transform(
        models["stab_model"].predict(X)
    )[0]

    confidence = float(
        np.max(models["compound_model"].predict_proba(X))
    )

    return {
        "compound_class": compound,
        "toxicity": toxicity,
        "solubility": solubility,
        "stability": stability,
        "confidence": round(confidence, 2)
    }
