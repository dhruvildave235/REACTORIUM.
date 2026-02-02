# structure/serializer.py

def serialize_molecule(mol):
    if mol is None:
        return None

    atoms = []
    conf = mol.GetConformer()

    for atom in mol.GetAtoms():
        pos = conf.GetAtomPosition(atom.GetIdx())
        atoms.append({
            "element": atom.GetSymbol(),
            "x": round(pos.x, 3),
            "y": round(pos.y, 3),
            "z": round(pos.z, 3)
        })

    return atoms
