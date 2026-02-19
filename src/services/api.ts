import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

import { AnalysisResponse } from '../types';

export const analyzeVcf = async (file: File, drugs: string[]): Promise<AnalysisResponse> => {
    const formData = new FormData();
    formData.append('vcf_file', file);
    formData.append('drug', drugs.join(','));

    try {
        const response = await axios.post<AnalysisResponse>(`${API_URL}/analyze`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error analyzing VCF:', error);
        throw error;
    }
};

export const checkHealth = async (): Promise<boolean> => {
    try {
        await axios.get(`${API_URL}/health`);
        return true;
    } catch (error) {
        return false;
    }
}
