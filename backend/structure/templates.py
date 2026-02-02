# structure/templates.py

COMPOUND_SMILES = {
    "Amide": "NC=O",
    "Ester": "COC=O",
    "Salt": "[Na+].[Cl-]",
    "Alcoholic Compound": "CO",
    "Unknown": None
}

def get_smiles(compound_class):
    return COMPOUND_SMILES.get(compound_class)
