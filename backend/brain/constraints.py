# brain/constraints.py

def check_constraints(candidate, constraints):
    """
    candidate → dict with predicted properties
    constraints → user requested constraints
    """

    for key, value in constraints.items():
        if candidate.get(key) != value:
            return False

    return True
