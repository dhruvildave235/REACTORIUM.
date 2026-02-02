# brain/rules.py

def infer_possible_classes(components):
    components = set(components)

    rules = []

    if "Acid" in components and "Base" in components:
        rules.append("Salt")

    if "Alcohol" in components and "Acid" in components:
        rules.append("Ester")

    if "Amine" in components and "Alcohol" in components:
        rules.append("Amide")

    if len(components) > 2:
        rules.append("Unknown")

    return list(set(rules))
