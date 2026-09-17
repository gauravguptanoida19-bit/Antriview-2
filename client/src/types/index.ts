export interface User {
  id: string;
  name: string;
  email: string;
  role: 'candidate' | 'interviewer' | 'admin';
  avatar?: string;
  targetRole?: string;
  experienceLevel?: 'Junior' | 'Mid-Level' | 'Senior' | 'Lead';
  skills: string[];
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface ITestCase {
  input: string;
  expectedOutput: string;
  description?: string;
  hidden?: boolean;
}

export interface ICodeExecutionDetail {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  error?: string;
}

export interface ICodeExecutionResult {
  passed: boolean;
  totalTests: number;
  passedTests: number;
  executionTimeMs: number;
  details: ICodeExecutionDetail[];
}

export interface IQuestionEvaluation {
  score: number;
  correctness: number;
  technicalDepth: number;
  clarity: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  timeComplexity?: string;
  spaceComplexity?: string;
}

export interface IInterviewQuestion {
  questionId: string;
  title: string;
  question: string;
  questionType: 'conceptual' | 'coding' | 'system-design' | 'behavioral';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  timeLimitMinutes?: number;
  hints?: string[];
  starterCode?: {
    javascript?: string;
    python?: string;
    cpp?: string;
  };
  testCases?: ITestCase[];
  candidateAnswer?: string;
  codeAnswer?: string;
  language?: string;
  codeExecutionResult?: ICodeExecutionResult;
  evaluation?: IQuestionEvaluation;
  answeredAt?: string;
}

export interface IInterview {
  _id: string;
  userId: string;
  role: string;
  technology: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  interviewType: 'technical' | 'coding' | 'voice' | 'combined';
  status: 'pending' | 'in_progress' | 'completed' | 'abandoned';
  currentQuestionIndex: number;
  durationMinutes: number;
  timeSpentSeconds: number;
  overallScore: number;
  technicalScore: number;
  codingScore: number;
  clarityScore: number;
  overallFeedback?: string;
  strengthsSummary: string[];
  weaknessesSummary: string[];
  recommendedRoadmap: string[];
  questions: IInterviewQuestion[];
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalInterviews: number;
  completedInterviews: number;
  inProgressInterviews: number;
  avgScore: number;
  bestScore: number;
  avgTechScore: number;
  avgCodingScore: number;
  avgClarityScore: number;
  totalMinutesSpent: number;
  recentInterviews: IInterview[];
}

export interface PerformanceTrendItem {
  id: string;
  index: number;
  date: string;
  role: string;
  technology: string;
  overallScore: number;
  technicalScore: number;
  codingScore: number;
  clarityScore: number;
}

export interface RadarItem {
  skill: string;
  score: number;
}

export interface PerformanceData {
  trend: PerformanceTrendItem[];
  radarData: RadarItem[];
  difficultyDistribution: {
    Easy: number;
    Medium: number;
    Hard: number;
  };
}

export interface RecommendationsData {
  recommendedAreas: string[];
  actionItems: string[];
}
