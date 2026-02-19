from typing import List, Dict

TARGET_GENES = {
    "CYP2D6",
    "CYP2C19",
    "CYP2C9",
    "SLCO1B1",
    "TPMT",
    "DPYD"
}


async def parse_vcf(upload_file) -> List[Dict]:
    contents = await upload_file.read()

    if not contents:
        return []

    text = contents.decode("utf-8", errors="ignore")
    lines = text.split("\n")

    variants = []

    for line in lines:
        if line.startswith("#") or not line.strip():
            continue

        # split by ANY whitespace (more robust than \t)
        columns = line.strip().split()

        if len(columns) < 8:
            continue

        chrom, pos, rsid, ref, alt, qual, flt, info = columns[:8]

        info_dict = {}

        # parse INFO safely
        for item in info.split(";"):
            if "=" in item:
                key, value = item.split("=", 1)
                info_dict[key.strip()] = value.strip()

        gene = info_dict.get("GENE")
        star = info_dict.get("STAR")

        if gene and gene in TARGET_GENES:
            variants.append({
                "rsid": rsid,
                "gene": gene,
                "star": star,
                "chromosome": chrom,
                "position": pos
            })

    return variants
