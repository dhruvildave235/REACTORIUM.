# structure/generator.py

from rdkit import Chem
from rdkit.Chem import AllChem

def generate_3d_structure(smiles):
    if smiles is None:
        return None

    mol = Chem.MolFromSmiles(smiles)
    mol = Chem.AddHs(mol)

    AllChem.EmbedMolecule(mol, AllChem.ETKDG())
    AllChem.UFFOptimizeMolecule(mol)

    return mol
