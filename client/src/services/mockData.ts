import { DashboardStats, PerformanceData, RecommendationsData, IInterview } from '../types';

export const MOCK_USER = {
  id: 'usr_demo_antiview',
  name: 'Alex Vance',
  email: 'demo@antiview.dev',
  role: 'candidate',
  createdAt: new Date().toISOString(),
};

export const MOCK_STATS: DashboardStats = {
  totalInterviews: 12,
  completedInterviews: 10,
  averageScore: 84,
  practiceTimeMinutes: 285,
  categoryBreakdown: {
    frontend: 5,
    backend: 4,
    fullstack: 2,
    algorithms: 1,
  },
  recentInterviews: [
    {
      _id: 'mock_int_1',
      candidateId: 'usr_demo_antiview',
      role: 'Full Stack Engineer',
      technology: 'React, Node.js, TypeScript',
      difficulty: 'Hard',
      interviewType: 'Full Technical (Mix)',
      status: 'completed',
      overallScore: 88,
      durationMinutes: 45,
      timeSpentSeconds: 2420,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      _id: 'mock_int_2',
      candidateId: 'usr_demo_antiview',
      role: 'Frontend Architect',
      technology: 'React, Tailwind, Performance',
      difficulty: 'Medium',
      interviewType: 'System Design & Concepts',
      status: 'completed',
      overallScore: 92,
      durationMinutes: 30,
      timeSpentSeconds: 1680,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      _id: 'mock_int_3',
      candidateId: 'usr_demo_antiview',
      role: 'Backend Systems Developer',
      technology: 'Node.js, PostgreSQL, Redis',
      difficulty: 'Hard',
      interviewType: 'Coding & Algorithms',
      status: 'completed',
      overallScore: 78,
      durationMinutes: 45,
      timeSpentSeconds: 2600,
      createdAt: new Date(Date.now() - 86400000 * 9).toISOString(),
    },
  ],
};

export const MOCK_PERFORMANCE: PerformanceData = {
  trend: [
    { date: 'Sep 1', score: 68, interviewTitle: 'Frontend Basics' },
    { date: 'Sep 5', score: 74, interviewTitle: 'Node.js APIs' },
    { date: 'Sep 9', score: 81, interviewTitle: 'System Design' },
    { date: 'Sep 12', score: 85, interviewTitle: 'Full Stack Challenge' },
    { date: 'Sep 15', score: 88, interviewTitle: 'React Concurrency' },
    { date: 'Sep 17', score: 92, interviewTitle: 'Distributed Cache' },
  ],
  radarData: [
    { subject: 'Technical Accuracy', score: 88, fullMark: 100 },
    { subject: 'Problem Solving', score: 85, fullMark: 100 },
    { subject: 'Code Quality', score: 82, fullMark: 100 },
    { subject: 'Communication', score: 90, fullMark: 100 },
    { subject: 'System Design', score: 79, fullMark: 100 },
    { subject: 'Edge Cases', score: 80, fullMark: 100 },
  ],
  difficultyDistribution: {
    Easy: 3,
    Medium: 6,
    Hard: 3,
  },
};

export const MOCK_RECOMMENDATIONS: RecommendationsData = {
  strengths: [
    'Clear architectural communication and modular component structuring',
    'Solid grasp of asynchronous JavaScript, Event Loop, and Promises',
    'Strong awareness of Web Vitals and frontend optimization strategies',
  ],
  weaknesses: [
    'Edge-case validation under high concurrency loads',
    'Database indexing strategies and query execution plan analysis',
    'Memory leak profiling in long-running Node.js worker pools',
  ],
  actionableInsights: [
    'Practice 2-3 Dynamic Programming and Graph problems weekly on Monaco editor',
    'Deepen knowledge of database write-ahead logging (WAL) and MVCC internals',
    'Try explaining design trade-offs aloud using the Antiview voice mode before typing code',
  ],
  recommendedRoles: [
    'Senior Frontend Engineer',
    'Full Stack Software Engineer',
    'React Platform Specialist',
  ],
};

export const MOCK_SAMPLE_INTERVIEW: IInterview = {
  _id: 'demo-session-1',
  candidateId: 'usr_demo_antiview',
  role: 'Senior Full Stack Engineer',
  technology: 'React, TypeScript, Node.js',
  difficulty: 'Hard',
  interviewType: 'Full Technical (Mix)',
  questionCount: 3,
  durationMinutes: 45,
  timeSpentSeconds: 1400,
  currentQuestionIndex: 0,
  status: 'in_progress',
  questions: [
    {
      questionIndex: 0,
      questionText: 'Explain how React Concurrent Mode and the Fiber reconciler schedule and interrupt render work. How does startTransition help maintain 60 FPS under heavy DOM updates?',
      type: 'conceptual',
      difficulty: 'Hard',
      category: 'Frontend Architecture',
      expectedPoints: [
        'Fiber tree structure and work-in-progress tree',
        'Time slicing with MessageChannel/Scheduler',
        'Yielding execution to browser frame painting',
        'Distinction between urgent updates and non-blocking transitions',
      ],
      userAnswer: 'React Fiber splits rendering into cooperative work units. In Concurrent Mode, the scheduler can pause render work if an urgent user interaction (like typing or clicking) occurs, maintaining frame rate responsiveness.',
      evaluation: {
        score: 88,
        technicalAccuracy: 90,
        completeness: 85,
        clarity: 90,
        feedback: 'Excellent conceptual grasp of Fiber reconciler architecture and cooperative scheduling.',
        keyStrengths: ['Accurate explanation of work units', 'Clear distinction of priority lanes'],
        areasForImprovement: ['Mention Scheduler package and lane priority bitmasks specifically'],
      },
    },
    {
      questionIndex: 1,
      questionText: 'Implement an LRU (Least Recently Used) Cache class in TypeScript supporting get(key) and put(key, value) operations with O(1) average time complexity.',
      type: 'coding',
      difficulty: 'Hard',
      category: 'Data Structures & Algorithms',
      codeSnippet: `class LRUCache<K, V> {\n  private capacity: number;\n  private cache: Map<K, V>;\n\n  constructor(capacity: number) {\n    this.capacity = capacity;\n    this.cache = new Map();\n  }\n\n  get(key: K): V | -1 {\n    if (!this.cache.has(key)) return -1;\n    const val = this.cache.get(key)!;\n    this.cache.delete(key);\n    this.cache.set(key, val);\n    return val;\n  }\n\n  put(key: K, value: V): void {\n    if (this.cache.has(key)) {\n      this.cache.delete(key);\n    } else if (this.cache.size >= this.capacity) {\n      const oldestKey = this.cache.keys().next().value;\n      this.cache.delete(oldestKey);\n    }\n    this.cache.set(key, value);\n  }\n}`,
      language: 'typescript',
      expectedPoints: ['Doubly linked list with hash map or Map insertion order', 'O(1) lookups and updates', 'Eviction policy'],
    },
    {
      questionIndex: 2,
      questionText: 'How would you architect a fault-tolerant distributed rate limiter across multiple Node.js instances behind an AWS Application Load Balancer?',
      type: 'system_design',
      difficulty: 'Hard',
      category: 'System Design',
      expectedPoints: [
        'Redis Token Bucket or Leaky Bucket with Lua scripts',
        'Sliding window log vs sliding window counter',
        'Handling Redis downtime with local memory fallback and circuit breakers',
      ],
    },
  ],
  overallScore: 88,
  createdAt: new Date().toISOString(),
};
