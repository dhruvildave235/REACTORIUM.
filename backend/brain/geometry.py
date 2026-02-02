

from rdkit import Chem
from rdkit.Chem import AllChem

def smiles_to_3d(smiles: str):
    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        return []

    mol = Chem.AddHs(mol)
    AllChem.EmbedMolecule(mol, AllChem.ETKDG())
    AllChem.UFFOptimizeMolecule(mol)

    conf = mol.GetConformer()
    atoms = []

    for atom in mol.GetAtoms():
        pos = conf.GetAtomPosition(atom.GetIdx())
        atoms.append({
            "element": atom.GetSymbol(),
            "x": float(pos.x),
            "y": float(pos.y),
            "z": float(pos.z)
        })

    return atoms
