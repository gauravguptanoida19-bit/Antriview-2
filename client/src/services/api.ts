import axios from 'axios';
import {
  AuthResponse,
  User,
  IInterview,
  DashboardStats,
  PerformanceData,
  RecommendationsData,
  IQuestionEvaluation,
  ICodeExecutionResult,
} from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('antiview_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthRequest = error.config.url?.includes('/auth/login') || error.config.url?.includes('/auth/register');
      if (!isAuthRequest) {
        localStorage.removeItem('antiview_token');
        localStorage.removeItem('antiview_user');
        // Only redirect if not already on login/register
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// --- Auth API ---
export const authApi = {
  register: async (data: any): Promise<AuthResponse> => {
    const res = await api.post('/auth/register', data);
    return res.data;
  },
  login: async (credentials: any): Promise<AuthResponse> => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  demoLogin: async (): Promise<AuthResponse> => {
    const res = await api.post('/auth/demo-login');
    return res.data;
  },
  getMe: async (): Promise<{ success: boolean; user: User }> => {
    const res = await api.get('/auth/me');
    return res.data;
  },
  updateProfile: async (data: Partial<User>): Promise<{ success: boolean; user: User }> => {
    const res = await api.put('/auth/profile', data);
    return res.data;
  },
};

// --- Interview API ---
export const interviewApi = {
  create: async (params: {
    role: string;
    technology: string;
    difficulty: string;
    interviewType: string;
    questionCount: number;
    durationMinutes: number;
  }): Promise<{ success: boolean; interview: IInterview }> => {
    const res = await api.post('/interviews', params);
    return res.data;
  },
  getAll: async (params?: {
    status?: string;
    difficulty?: string;
    role?: string;
    interviewType?: string;
    search?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }): Promise<{
    success: boolean;
    interviews: IInterview[];
    pagination: { total: number; page: number; limit: number; totalPages: number };
  }> => {
    const res = await api.get('/interviews', { params });
    return res.data;
  },
  getById: async (id: string): Promise<{ success: boolean; interview: IInterview }> => {
    const res = await api.get(`/interviews/${id}`);
    return res.data;
  },
  update: async (
    id: string,
    data: { currentQuestionIndex?: number; timeSpentSeconds?: number; status?: string }
  ): Promise<{ success: boolean; interview: IInterview }> => {
    const res = await api.patch(`/interviews/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    const res = await api.delete(`/interviews/${id}`);
    return res.data;
  },
  start: async (id: string): Promise<{ success: boolean; interview: IInterview }> => {
    const res = await api.post(`/interviews/${id}/start`);
    return res.data;
  },
  submitAnswer: async (
    id: string,
    questionIndex: number,
    answer: string
  ): Promise<{ success: boolean; evaluation: IQuestionEvaluation; question: any }> => {
    const res = await api.post(`/interviews/${id}/submit`, { questionIndex, answer });
    return res.data;
  },
  submitCode: async (
    id: string,
    questionIndex: number,
    code: string,
    language: string,
    runOnly: boolean = false
  ): Promise<{
    success: boolean;
    executionResult: ICodeExecutionResult;
    evaluation?: IQuestionEvaluation;
  }> => {
    const res = await api.post(`/interviews/${id}/code-submit`, {
      questionIndex,
      code,
      language,
      runOnly,
    });
    return res.data;
  },
  complete: async (
    id: string,
    timeSpentSeconds?: number
  ): Promise<{ success: boolean; interview: IInterview }> => {
    const res = await api.post(`/interviews/${id}/complete`, { timeSpentSeconds });
    return res.data;
  },
};

// --- Dashboard API ---
export const dashboardApi = {
  getStats: async (): Promise<{ success: boolean; stats: DashboardStats }> => {
    const res = await api.get('/dashboard/stats');
    return res.data;
  },
  getPerformance: async (): Promise<{
    success: boolean;
    trend: PerformanceData['trend'];
    radarData: PerformanceData['radarData'];
    difficultyDistribution: PerformanceData['difficultyDistribution'];
  }> => {
    const res = await api.get('/dashboard/performance');
    return res.data;
  },
  getRecommendations: async (): Promise<{
    success: boolean;
    recommendedAreas: string[];
    actionItems: string[];
  }> => {
    const res = await api.get('/dashboard/recommendations');
    return res.data;
  },
};

// --- Standalone AI API ---
export const aiApi = {
  generateQuestion: async (params: any) => {
    const res = await api.post('/ai/generate-question', params);
    return res.data;
  },
  evaluateAnswer: async (params: any) => {
    const res = await api.post('/ai/evaluate-answer', params);
    return res.data;
  },
  evaluateCode: async (params: any) => {
    const res = await api.post('/ai/evaluate-code', params);
    return res.data;
  },
};

export default api;
