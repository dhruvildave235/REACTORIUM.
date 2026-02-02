


# brain/reasoner.py

from brain.geometry import smiles_to_3d
from ml.predict import predict_compound
from structure.generator import generate_3d_structure
from structure.serializer import serialize_molecule
from structure.templates import get_smiles


def reason(components, constraints):
    print("🧪 COMPONENTS RECEIVED:", components)
    print("⚙️ USER CONSTRAINTS:", constraints)

    results = []

    # ==========================================================
    # DEFAULT VALUES
    # ==========================================================
    compound = "Unknown"
    smiles = "C"
    toxicity = "Medium"
    solubility = "Medium"
    stability = "Medium"
    confidence = 0.50
    novelty = "Novel"

    # 🔑 IMPORTANT: reaction-derived conditions
    reaction_conditions = {}

    c = set(components)

    # user constraints (used only as helpers)
    acidic = constraints.get("acidic", False)
    basic = constraints.get("basic", False)
    oxidizing = constraints.get("oxidizing", False)
    reducing = constraints.get("reducing", False)
    heat = constraints.get("heat", False)

    # ==========================================================
    # 🔥 MULTI-COMPONENT REACTIONS
    # ==========================================================

    # Alcohol + Amine → Amide
    if {"Alcohol", "Amine"} <= c:
        if acidic and heat:
            compound = "Amide"
            smiles = "NC(C)O"
            solubility = "High"
            stability = "High"
            confidence = 0.90
            novelty = "Seen"
            reaction_conditions = {"acidic": True, "heat": True}
        else:
            compound = "Hydrogen-Bonded Alcohol–Amine Complex"
            smiles = "CO.NC"
            solubility = "Medium"
            stability = "Medium"
            confidence = 0.65
            reaction_conditions = {}

    # Alcohol + Carboxylic Acid → Ester
    elif {"Alcohol", "Carboxylic Acid"} <= c:
        compound = "Ester"
        smiles = "CC(=O)OC"
        solubility = "Low"
        stability = "High"
        confidence = 0.88
        reaction_conditions = {"acidic": True, "heat": True}

    # Amine + Carboxylic Acid → Ammonium Salt
    elif {"Amine", "Carboxylic Acid"} <= c:
        compound = "Ammonium Carboxylate Salt"
        smiles = "C[NH3+].[O-]C=O"
        solubility = "High"
        stability = "Very High"
        confidence = 0.92
        reaction_conditions = {}

    

   

    # Acid + Base → Neutralization Salt
    elif {"Acid", "Base"} <= c:
        compound = "Neutralization Salt"
        smiles = "[Na+].[Cl-]"
        solubility = "High"
        stability = "Very High"
        confidence = 0.95
        reaction_conditions = {}

    # Aldehyde + Amine → Imine (Schiff Base)
    elif {"Aldehyde", "Amine"} <= c:
        compound = "Imine (Schiff Base)"
        smiles = "C=N"
        stability = "Low"
        confidence = 0.75
        reaction_conditions = {"acidic": True}

    # Ketone + Alcohol → Hemiacetal
    elif {"Ketone", "Alcohol"} <= c:
        compound = "Hemiacetal"
        smiles = "CC(O)(OC)C"
        stability = "Medium"
        confidence = 0.70
        reaction_conditions = {"acidic": True}

    # Aromatic + Nitro → Nitroaromatic
    elif {"Aromatic Ring", "Nitro"} <= c:
        compound = "Nitroaromatic Compound"
        smiles = "O=[N+]([O-])c1ccccc1"
        toxicity = "High"
        stability = "High"
        confidence = 0.78
        reaction_conditions = {}

    # Aromatic + Amine + Acid → Zwitterion
    elif {"Aromatic Ring", "Amine", "Carboxylic Acid"} <= c:
        compound = "Aromatic Amino Acid"
        smiles = "Nc1ccccc1C(=O)O"
        stability = "High"
        confidence = 0.72
        reaction_conditions = {}

    # ==========================================================
    # 🔁 FUNCTIONAL GROUP TRANSFORMATIONS
    # ==========================================================

    # Oxidation of Alcohol
    elif "Alcohol" in c and oxidizing:
        compound = "Oxidized Alcohol (Aldehyde/Ketone)"
        smiles = "CC=O"
        confidence = 0.70
        reaction_conditions = {"oxidizing": True}

    # Reduction of Nitro
    elif "Nitro" in c and reducing:
        compound = "Reduced Nitro Compound (Amine)"
        smiles = "CN"
        confidence = 0.68
        reaction_conditions = {"reducing": True}

    # ==========================================================
    # 🔹 SINGLE FUNCTIONAL GROUPS
    # ==========================================================

    elif "Alcohol" in c:
        compound = "Alcohol"
        smiles = "CO"
        solubility = "High"
        confidence = 0.90
        reaction_conditions = {}

    elif "Amine" in c:
        compound = "Amine"
        smiles = "CN"
        solubility = "High"
        confidence = 0.90
        reaction_conditions = {}

    elif "Carboxylic Acid" in c:
        compound = "Carboxylic Acid"
        smiles = "CC(=O)O"
        confidence = 0.90
        reaction_conditions = {}

    elif "Ketone" in c:
        compound = "Ketone"
        smiles = "CC(=O)C"
        confidence = 0.85
        reaction_conditions = {}

    elif "Aldehyde" in c:
        compound = "Aldehyde"
        smiles = "CC=O"
        confidence = 0.85
        reaction_conditions = {}

    elif "Aromatic Ring" in c:
        compound = "Aromatic Hydrocarbon"
        smiles = "c1ccccc1"
        stability = "High"
        solubility = "Low"
        confidence = 0.88
        reaction_conditions = {}

    # ==========================================================
    # 🧠 ML FALLBACK
    # ==========================================================

    else:
        components_str = "+".join(components)
        predicted = predict_compound(components_str)
        compound = predicted.get("compound_class", "Unknown")
        confidence = predicted.get("confidence", 0.45)
        smiles = get_smiles(compound) or "C"
        reaction_conditions = {}

    # ==========================================================
    # 🔬 3D STRUCTURE
    # ==========================================================

    try:
        mol = generate_3d_structure(smiles)
        structure_3d = serialize_molecule(mol)
    except Exception:
        structure_3d = smiles_to_3d(smiles)

    # ==========================================================
    # 📦 FINAL RESPONSE
    # ==========================================================

    results.append({
        "compound_class": compound,
        "toxicity": toxicity,
        "solubility": solubility,
        "stability": stability,
        "confidence": confidence,
        "novelty_flag": novelty,
        "rule_class": compound,
        "smiles": smiles,
        "structure_3d": structure_3d,
        "conditions": reaction_conditions
    })

    return results


