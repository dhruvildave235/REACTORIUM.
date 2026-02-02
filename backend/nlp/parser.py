# nlp/parser.py

def parse(text: str):
    text = text.lower()

    components = []

    if "alcohol" in text:
        components.append("Alcohol")

    if "amine" in text:
        components.append("Amine")

    if "carboxyl" in text or "acid" in text:
        components.append("Carboxylic Acid")

    if "aromatic" in text or "ring" in text:
        components.append("Aromatic Ring")

    constraints = {
        "low_toxicity": "low toxicity" in text,
        "high_solubility": "high solubility" in text,
        "stable": "stable" in text
    }

    return components, constraints
