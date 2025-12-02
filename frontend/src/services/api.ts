// src/services/api.ts
import axios from 'axios';

// 1. Create the Client
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000', // Use env var or fallback to local
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the Token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 2. Define the Shape of Data (TypeScript Interface)
export interface LoanApplication {
    full_name: string;
    income: number;
    loan_amount: number;
    credit_score: number;
    age: number;
    years_employed: number;
    gender: "M" | "F";
}

export interface LoanResponse {
    id: number;
    status: string;
    risk_score: number;
    risk_factors: { feature: string; shap_score: number }[];
    created_at: string;
    full_name: string;
    income: number;
    loan_amount: number;
    credit_score: number;
    age: number;
    years_employed: number;
    gender: "M" | "F";
}

export interface VerificationResult {
    estimated_salary: number;
    cheque_bounces: number;
    gambling_count: number;
    average_balance: number;
    is_verified: boolean;
}

export interface User {
    email: string;
    password?: string;
    full_name: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
}

export interface HistoryItem {
    id: number;
    filename: string;
    result: string; // JSON string
    created_at: string;
}

// 3. The API Functions
export const registerUser = async (user: User) => {
    const response = await api.post('/register', user);
    return response.data;
};

export const loginUser = async (credentials: FormData) => {
    const response = await api.post<AuthResponse>('/login', credentials, {
        headers: {
            'Content-Type': undefined
        }
    });
    return response.data;
};

export const fetchHistory = async () => {
    const response = await api.get<HistoryItem[]>('/history');
    return response.data;
};

export const submitApplication = async (data: LoanApplication) => {
    const response = await api.post<LoanResponse>('/apply', data);
    return response.data;
};

export const fetchApplications = async () => {
    const response = await api.get<LoanResponse[]>('/applications');
    return response.data;
};

export const fetchLoanHistory = async () => {
    const response = await api.get<LoanResponse[]>('/loan-history');
    return response.data;
};

export const verifyIncome = async (claimed_salary: number) => {
    const response = await api.post<VerificationResult>(
        `/verify-income?claimed_salary=${claimed_salary}`
    );
    return response.data;
};

export const uploadBankStatement = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/analyze-statement-file', formData, {
        headers: {
            'Content-Type': undefined,
        }
    });
    return response.data;
};