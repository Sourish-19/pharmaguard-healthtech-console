STAR_FUNCTION = {
    "CYP2D6": {
        "*1": "normal",
        "*2": "normal",
        "*4": "no_function",
        "*10": "reduced"
    },
    "CYP2C19": {
        "*1": "normal",
        "*2": "no_function",
        "*3": "no_function",
        "*17": "increased"
    },
    "CYP2C9": {
        "*1": "normal",
        "*2": "reduced",
        "*3": "reduced"
    },
    "SLCO1B1": {
        "*1": "normal",
        "*5": "reduced",
        "*15": "reduced"
    },
    "TPMT": {
        "*1": "normal",
        "*3A": "no_function",
        "*3C": "no_function"
    },
    "DPYD": {
        "*1": "normal",
        "*2A": "no_function"
    }
}


def infer_diplotype(variants, gene):
    gene_vars = [v for v in variants if v["gene"] == gene]
    stars = [v["star"] for v in gene_vars if v["star"]]

    if len(stars) >= 2:
        return f"{stars[0]}/{stars[1]}"
    elif len(stars) == 1:
        return f"{stars[0]}/*1"
    else:
        return "*1/*1"


def infer_phenotype(gene, diplotype):
    alleles = diplotype.split("/")
    functions = []

    for allele in alleles:
        functions.append(STAR_FUNCTION.get(gene, {}).get(allele, "unknown"))

    if functions.count("no_function") == 2:
        return "PM"
    if "no_function" in functions:
        return "IM"
    if "increased" in functions:
        return "UM"
    if "reduced" in functions:
        return "IM"
    return "NM"
