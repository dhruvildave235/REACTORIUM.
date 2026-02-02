# brain/backtracking.py

def backtrack(candidates, constraints):
    valid = []

    for c in candidates:
        if check_candidate(c, constraints):
            valid.append(c)

    return valid


def check_candidate(candidate, constraints):
    for key, value in constraints.items():
        if candidate[key] != value:
            return False
    return True
