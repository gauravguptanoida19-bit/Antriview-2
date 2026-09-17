import mongoose, { Document, Schema, Types } from 'mongoose';

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
  answeredAt?: Date;
}

export interface IInterview extends Document {
  userId: Types.ObjectId;
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
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TestCaseSchema = new Schema<ITestCase>(
  {
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    description: { type: String },
    hidden: { type: Boolean, default: false },
  },
  { _id: false }
);

const CodeExecutionDetailSchema = new Schema<ICodeExecutionDetail>(
  {
    input: { type: String, required: true },
    expected: { type: String, required: true },
    actual: { type: String, required: true },
    passed: { type: Boolean, required: true },
    error: { type: String },
  },
  { _id: false }
);

const CodeExecutionResultSchema = new Schema<ICodeExecutionResult>(
  {
    passed: { type: Boolean, required: true },
    totalTests: { type: Number, required: true },
    passedTests: { type: Number, required: true },
    executionTimeMs: { type: Number, default: 0 },
    details: [CodeExecutionDetailSchema],
  },
  { _id: false }
);

const QuestionEvaluationSchema = new Schema<IQuestionEvaluation>(
  {
    score: { type: Number, default: 0 },
    correctness: { type: Number, default: 0 },
    technicalDepth: { type: Number, default: 0 },
    clarity: { type: Number, default: 0 },
    feedback: { type: String, default: '' },
    strengths: { type: [String], default: [] },
    improvements: { type: [String], default: [] },
    timeComplexity: { type: String },
    spaceComplexity: { type: String },
  },
  { _id: false }
);

const InterviewQuestionSchema = new Schema<IInterviewQuestion>(
  {
    questionId: { type: String, required: true },
    title: { type: String, required: true },
    question: { type: String, required: true },
    questionType: {
      type: String,
      enum: ['conceptual', 'coding', 'system-design', 'behavioral'],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: true,
    },
    category: { type: String, default: 'General' },
    timeLimitMinutes: { type: Number, default: 10 },
    hints: { type: [String], default: [] },
    starterCode: {
      javascript: { type: String },
      python: { type: String },
      cpp: { type: String },
    },
    testCases: [TestCaseSchema],
    candidateAnswer: { type: String, default: '' },
    codeAnswer: { type: String, default: '' },
    language: { type: String, default: 'javascript' },
    codeExecutionResult: CodeExecutionResultSchema,
    evaluation: QuestionEvaluationSchema,
    answeredAt: { type: Date },
  },
  { _id: false }
);

const InterviewSchema = new Schema<IInterview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    role: {
      type: String,
      required: [true, 'Interview role is required'],
      trim: true,
    },
    technology: {
      type: String,
      required: [true, 'Interview technology is required'],
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    interviewType: {
      type: String,
      enum: ['technical', 'coding', 'voice', 'combined'],
      default: 'technical',
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'abandoned'],
      default: 'pending',
      index: true,
    },
    currentQuestionIndex: {
      type: Number,
      default: 0,
    },
    durationMinutes: {
      type: Number,
      default: 30,
    },
    timeSpentSeconds: {
      type: Number,
      default: 0,
    },
    overallScore: {
      type: Number,
      default: 0,
    },
    technicalScore: {
      type: Number,
      default: 0,
    },
    codingScore: {
      type: Number,
      default: 0,
    },
    clarityScore: {
      type: Number,
      default: 0,
    },
    overallFeedback: {
      type: String,
      default: '',
    },
    strengthsSummary: {
      type: [String],
      default: [],
    },
    weaknessesSummary: {
      type: [String],
      default: [],
    },
    recommendedRoadmap: {
      type: [String],
      default: [],
    },
    questions: [InterviewQuestionSchema],
    startedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for user history queries and filtering
InterviewSchema.index({ userId: 1, createdAt: -1 });
InterviewSchema.index({ userId: 1, status: 1 });
InterviewSchema.index({ userId: 1, role: 1 });

export const Interview = mongoose.model<IInterview>('Interview', InterviewSchema);
