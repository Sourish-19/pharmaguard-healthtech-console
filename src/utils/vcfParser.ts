
export interface ParsedVariant {
    chrom: string;
    pos: number;
    id: string;
    ref: string;
    alt: string;
    filter: string;
    info: Record<string, string>;
    gene?: string;
}

export interface VCFParseResult {
    metadata: string[];
    header: string[];
    variants: ParsedVariant[];
    error?: string;
}

const TARGET_GENES = ['CYP2D6', 'CYP2C19', 'CYP2C9', 'SLCO1B1', 'TPMT', 'DPYD'];

export const parseVCF = async (file: File): Promise<VCFParseResult> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const content = event.target?.result as string;
                const lines = content.split('\n');

                const metadata: string[] = [];
                let header: string[] = [];
                const variants: ParsedVariant[] = [];

                for (const line of lines) {
                    if (!line.trim()) continue;

                    if (line.startsWith('##')) {
                        metadata.push(line.trim());
                        continue;
                    }

                    if (line.startsWith('#')) {
                        header = line.substring(1).trim().split('\t');
                        continue;
                    }

                    const fields = line.trim().split('\t');
                    if (fields.length < 5) continue;

                    const infoString = fields[7] || '';
                    const infoParts = infoString.split(';');
                    const info: Record<string, string> = {};

                    let associatedGene = '';

                    infoParts.forEach(part => {
                        const [key, value] = part.split('=');
                        if (key) info[key] = value || 'true';

                        // Try to detect gene from INFO column (common annotations)
                        if (key === 'GENE' || key === 'Gene') associatedGene = value;
                    });

                    // Hackathon fallback: If no GENE tag, try to map by position (Mock logic would go here if we had a map)
                    // For now, we assume the VCF might calculate it or we just store it raw.

                    variants.push({
                        chrom: fields[0],
                        pos: parseInt(fields[1], 10),
                        id: fields[2],
                        ref: fields[3],
                        alt: fields[4],
                        filter: fields[6],
                        info,
                        gene: associatedGene
                    });
                }

                resolve({ metadata, header, variants });
            } catch (err) {
                reject("Failed to parse VCF file content.");
            }
        };

        reader.onerror = () => reject("Error reading file.");
        reader.readAsText(file);
    });
};
