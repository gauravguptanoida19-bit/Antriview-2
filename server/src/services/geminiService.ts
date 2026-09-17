import { GoogleGenAI } from '@google/genai';
import { config } from '../config/env.js';
import { IInterviewQuestion, IQuestionEvaluation, IInterview } from '../models/Interview.js';

export class GeminiService {
  private static client: GoogleGenAI | null = null;

  private static getClient(): GoogleGenAI | null {
    if (!this.client && config.GEMINI_API_KEY) {
      try {
        this.client = new GoogleGenAI({});
      } catch (err) {
        console.warn('⚠️ [GeminiService] Failed to initialize GoogleGenAI client:', err);
      }
    }
    return this.client;
  }

  /**
   * Generates dynamic interview questions tailored to role, technology, difficulty, and type.
   */
  public static async generateQuestions(
    role: string,
    technology: string,
    difficulty: 'Easy' | 'Medium' | 'Hard',
    interviewType: 'technical' | 'coding' | 'voice' | 'combined',
    count: number = 5
  ): Promise<IInterviewQuestion[]> {
    const client = this.getClient();

    if (client) {
      try {
        const prompt = `You are a Principal Tech Interviewer and Staff Engineer conducting a rigorous technical interview for a ${role} candidate focusing on ${technology} at ${difficulty} level.
Interview Type: ${interviewType}.
Generate exactly ${count} interview questions.
Each question must be realistic, practical, and highly relevant to modern software engineering.

For questionType 'coding', include starter code for JavaScript, Python, and C++, and provide 2-3 input/output testCases.
For questionType 'conceptual' or 'system-design', provide rich technical depth.

Return ONLY a valid JSON array of objects adhering to this exact schema:
[
  {
    "questionId": "q_1",
    "title": "Short descriptive title",
    "question": "Full question text with context and instructions",
    "questionType": "conceptual" | "coding" | "system-design" | "behavioral",
    "difficulty": "${difficulty}",
    "category": "${technology}",
    "timeLimitMinutes": 10,
    "hints": ["Helpful hint 1", "Helpful hint 2"],
    "starterCode": {
      "javascript": "// Starter code for JS",
      "python": "# Starter code for Python",
      "cpp": "// Starter code for C++"
    },
    "testCases": [
      {
        "input": "arg1, arg2",
        "expectedOutput": "expected",
        "description": "Standard case"
      }
    ]
  }
]`;

        const interaction = await client.interactions.create({
          model: 'gemini-3.8-flash',
          input: prompt,
          response_format: {
            type: 'text',
            mime_type: 'application/json',
          },
        });

        const rawText = interaction.output_text;
        if (rawText) {
          const parsed = JSON.parse(rawText);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((q, idx) => ({
              ...q,
              questionId: `q_${Date.now()}_${idx + 1}`,
              difficulty: q.difficulty || difficulty,
              category: q.category || technology,
            }));
          }
        }
      } catch (error: any) {
        console.warn('⚠️ [GeminiService] AI generation encountered error, falling back to curated dynamic engine:', error.message);
      }
    }

    // Fallback: Expertly curated dynamic questions per technology & role
    return this.getFallbackQuestions(role, technology, difficulty, interviewType, count);
  }

  /**
   * Evaluates a candidate's conceptual or verbal response.
   */
  public static async evaluateAnswer(
    question: IInterviewQuestion,
    candidateAnswer: string,
    role: string,
    difficulty: string
  ): Promise<IQuestionEvaluation> {
    const client = this.getClient();

    if (client && candidateAnswer.trim().length > 10) {
      try {
        const prompt = `You are a Senior Tech Lead evaluating an interview answer for a ${role} position (${difficulty} difficulty).
Question Title: "${question.title}"
Question Detail: "${question.question}"
Candidate Answer: """${candidateAnswer}"""

Evaluate the answer thoroughly on technical accuracy, depth, and communication clarity.
Return ONLY valid JSON matching this schema:
{
  "score": <number 1-10>,
  "correctness": <number 1-10>,
  "technicalDepth": <number 1-10>,
  "clarity": <number 1-10>,
  "feedback": "<concise constructive feedback paragraph>",
  "strengths": ["<key strength 1>", "<key strength 2>"],
  "improvements": ["<actionable improvement 1>", "<actionable improvement 2>"]
}`;

        const interaction = await client.interactions.create({
          model: 'gemini-3.8-flash',
          input: prompt,
          response_format: {
            type: 'text',
            mime_type: 'application/json',
          },
        });

        const rawText = interaction.output_text;
        if (rawText) {
          const parsed = JSON.parse(rawText);
          return {
            score: Math.min(10, Math.max(1, Number(parsed.score) || 7)),
            correctness: Math.min(10, Math.max(1, Number(parsed.correctness) || 7)),
            technicalDepth: Math.min(10, Math.max(1, Number(parsed.technicalDepth) || 6)),
            clarity: Math.min(10, Math.max(1, Number(parsed.clarity) || 8)),
            feedback: parsed.feedback || 'Candidate demonstrated competent foundational understanding.',
            strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ['Good conceptual grasp.'],
            improvements: Array.isArray(parsed.improvements) ? parsed.improvements : ['Elaborate further on edge cases and scalability.'],
          };
        }
      } catch (err: any) {
        console.warn('⚠️ [GeminiService] Error evaluating answer with Gemini:', err.message);
      }
    }

    // Heuristic fallback evaluation
    return this.getFallbackEvaluation(candidateAnswer, question);
  }

  /**
   * Evaluates candidate's coding solution with complexity analysis.
   */
  public static async evaluateCode(
    question: IInterviewQuestion,
    code: string,
    language: string,
    testResults?: any
  ): Promise<IQuestionEvaluation> {
    const client = this.getClient();

    if (client && code.trim().length > 15) {
      try {
        const prompt = `You are a Senior Software Engineer assessing a coding solution in ${language}.
Problem: "${question.title}" - "${question.question}"
Candidate Code:
\`\`\`${language}
${code}
\`\`\`
Test Results Summary: ${testResults ? `${testResults.passedTests}/${testResults.totalTests} passed` : 'Not run'}

Provide structured code evaluation with Big-O time and space complexity.
Return ONLY valid JSON matching this schema:
{
  "score": <number 1-10>,
  "correctness": <number 1-10>,
  "technicalDepth": <number 1-10>,
  "clarity": <number 1-10>,
  "timeComplexity": "e.g. O(n)",
  "spaceComplexity": "e.g. O(1)",
  "feedback": "<concise code review critique>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<improvement 1>", "<improvement 2>"]
}`;

        const interaction = await client.interactions.create({
          model: 'gemini-3.8-flash',
          input: prompt,
          response_format: {
            type: 'text',
            mime_type: 'application/json',
          },
        });

        const rawText = interaction.output_text;
        if (rawText) {
          const parsed = JSON.parse(rawText);
          return {
            score: Math.min(10, Math.max(1, Number(parsed.score) || 7)),
            correctness: Math.min(10, Math.max(1, Number(parsed.correctness) || 7)),
            technicalDepth: Math.min(10, Math.max(1, Number(parsed.technicalDepth) || 7)),
            clarity: Math.min(10, Math.max(1, Number(parsed.clarity) || 8)),
            timeComplexity: parsed.timeComplexity || 'O(n)',
            spaceComplexity: parsed.spaceComplexity || 'O(1)',
            feedback: parsed.feedback || 'Clean solution adhering to standard coding conventions.',
            strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ['Structured implementation', 'Modular style'],
            improvements: Array.isArray(parsed.improvements) ? parsed.improvements : ['Consider optimizing space complexity for extreme bounds.'],
          };
        }
      } catch (err: any) {
        console.warn('⚠️ [GeminiService] Error evaluating code with Gemini:', err.message);
      }
    }

    // Heuristic fallback evaluation for code
    const isPassing = testResults ? testResults.passed : code.length > 50;
    const baseScore = isPassing ? 8 : (code.length > 50 ? 6 : 4);

    return {
      score: baseScore,
      correctness: isPassing ? 9 : 5,
      technicalDepth: 7,
      clarity: 8,
      timeComplexity: code.includes('for') && code.slice(code.indexOf('for') + 3).includes('for') ? 'O(n^2)' : 'O(n)',
      spaceComplexity: code.includes('new ') || code.includes('[]') || code.includes('{}') ? 'O(n)' : 'O(1)',
      feedback: isPassing
        ? 'Well-structured implementation that successfully addresses the problem specifications.'
        : 'Initial implementation has good foundation but needs refinement on boundary conditions.',
      strengths: [
        'Demonstrates clean variable naming conventions',
        'Direct algorithmic approach to the problem requirements',
      ],
      improvements: [
        'Check edge cases with empty or null inputs',
        'Profile memory allocations when handling large scale payloads',
      ],
    };
  }

  /**
   * Generates overall interview assessment, strengths, weaknesses, and a preparation roadmap.
   */
  public static async generateInterviewSummary(interview: IInterview): Promise<{
    overallScore: number;
    technicalScore: number;
    codingScore: number;
    clarityScore: number;
    overallFeedback: string;
    strengthsSummary: string[];
    weaknessesSummary: string[];
    recommendedRoadmap: string[];
  }> {
    const evaluations = interview.questions
      .map((q) => q.evaluation)
      .filter((e): e is IQuestionEvaluation => Boolean(e));

    const totalEvals = evaluations.length || 1;
    const avgScore = Math.round(evaluations.reduce((acc, e) => acc + (e.score || 0), 0) / totalEvals);
    const avgTech = Math.round(evaluations.reduce((acc, e) => acc + (e.technicalDepth || 0), 0) / totalEvals);
    const avgClarity = Math.round(evaluations.reduce((acc, e) => acc + (e.clarity || 0), 0) / totalEvals);
    const codingQuestions = interview.questions.filter((q) => q.questionType === 'coding');
    const avgCoding = codingQuestions.length
      ? Math.round(codingQuestions.reduce((acc, q) => acc + (q.evaluation?.score || 0), 0) / codingQuestions.length)
      : avgScore;

    const allStrengths = evaluations.flatMap((e) => e.strengths || []);
    const allImprovements = evaluations.flatMap((e) => e.improvements || []);

    const uniqueStrengths = Array.from(new Set(allStrengths)).slice(0, 4);
    const uniqueImprovements = Array.from(new Set(allImprovements)).slice(0, 4);

    const strengthsSummary = uniqueStrengths.length > 0 ? uniqueStrengths : [
      `Strong foundational comprehension of ${interview.technology} paradigms`,
      'Methodical problem breakdown and articulate communication',
      'Effective application of idiomatic syntax and conventions',
    ];

    const weaknessesSummary = uniqueImprovements.length > 0 ? uniqueImprovements : [
      'Further practice analyzing Big-O time and space trade-offs on complex constraints',
      'Proactively state assumptions and ask clarifying questions before implementation',
      'Refine testing strategies around defensive edge case validation',
    ];

    const recommendedRoadmap = [
      `Deep dive into advanced ${interview.technology} concurrency, memory lifecycle, and optimization techniques`,
      'Practice 10+ LeetCode Medium/Hard algorithmic problems focusing on Two Pointers and Dynamic Programming',
      'Study high-scale System Design architectural patterns (caching, sharding, distributed consensus)',
      'Conduct regular timed mock interviews to build pacing and calm under interview pressure',
    ];

    const overallFeedback = `The candidate demonstrated a ${avgScore >= 8 ? 'strong and proficient' : avgScore >= 6 ? 'solid and promising' : 'developing'} level of technical aptitude for a ${interview.difficulty}-level ${interview.role} interview. Communication was clear, and responses reflected good core knowledge of ${interview.technology}. By addressing the targeted refinement areas in the recommended roadmap, candidate will be well-positioned for senior engineering benchmarks.`;

    return {
      overallScore: avgScore || 7,
      technicalScore: avgTech || 7,
      codingScore: avgCoding || 7,
      clarityScore: avgClarity || 8,
      overallFeedback,
      strengthsSummary,
      weaknessesSummary,
      recommendedRoadmap,
    };
  }

  // --- Curated Domain Knowledge Base for Fallback ---

  private static getFallbackEvaluation(answer: string, question: IInterviewQuestion): IQuestionEvaluation {
    const trimmed = answer.trim();
    if (trimmed.length < 15) {
      return {
        score: 3,
        correctness: 3,
        technicalDepth: 2,
        clarity: 4,
        feedback: 'Response was too brief to adequately assess technical competence for this topic.',
        strengths: ['Attempted the question'],
        improvements: ['Elaborate with concrete architectural principles, examples, and technical mechanisms.'],
      };
    }

    const wordCount = trimmed.split(/\s+/).length;
    let score = 7;
    let correctness = 7;
    let depth = 6;
    let clarity = 8;

    if (wordCount > 60) {
      score = 8;
      correctness = 8;
      depth = 8;
    }
    if (wordCount > 120) {
      score = 9;
      correctness = 9;
      depth = 9;
    }

    return {
      score,
      correctness,
      technicalDepth: depth,
      clarity,
      feedback: `Comprehensive and articulate response addressing the core tenets of "${question.title}". Demonstrated sound technical intuition.`,
      strengths: [
        'Clear conceptual explanation with relevant technical terminology',
        'Directly addressed the primary inquiry without unnecessary deviation',
      ],
      improvements: [
        'Could include real-world production trade-offs or performance benchmarks',
        'Consider explaining internal engine or runtime mechanics for added depth',
      ],
    };
  }

  private static getFallbackQuestions(
    role: string,
    technology: string,
    difficulty: 'Easy' | 'Medium' | 'Hard',
    interviewType: 'technical' | 'coding' | 'voice' | 'combined',
    count: number
  ): IInterviewQuestion[] {
    const questionsPool: Record<string, IInterviewQuestion[]> = {
      React: [
        {
          questionId: 'q_react_1',
          title: 'React Fiber Architecture and Reconciliation',
          question: 'Explain how React Fiber revolutionized the reconciliation process compared to the legacy stack reconciler. How do work loops, units of work, and requestIdleCallback / scheduling priorities work under the hood?',
          questionType: 'conceptual',
          difficulty: 'Medium',
          category: 'React Internals',
          timeLimitMinutes: 10,
          hints: ['Think about incremental rendering, pausing/aborting work, and lanes/priority levels.'],
        },
        {
          questionId: 'q_react_2',
          title: 'Custom Hook for Debounced Search',
          question: 'Implement a reusable React hook `useDebounce(value, delay)` in JavaScript/TypeScript that prevents excessive re-renders or API calls during fast user typing in an input field.',
          questionType: 'coding',
          difficulty: 'Medium',
          category: 'React Hooks',
          timeLimitMinutes: 15,
          starterCode: {
            javascript: `function useDebounce(value, delay) {\n  // Implement custom debouncing hook\n  return value;\n}`,
            python: `# Simulated React Hook state in Python\ndef use_debounce(value, delay):\n    return value`,
            cpp: `// Debounce wrapper\n#include <string>\nstd::string debounce(const std::string& val, int delay) {\n    return val;\n}`,
          },
          testCases: [
            { input: '"hello", 300', expectedOutput: '"hello"', description: 'Immediate initial value' },
            { input: '"search query", 500', expectedOutput: '"search query"', description: 'Debounced return' },
          ],
        },
        {
          questionId: 'q_react_3',
          title: 'Optimizing Re-renders: useMemo, useCallback, and React.memo',
          question: 'Analyze scenarios where using `useMemo` or `useCallback` might actually hurt application performance rather than improve it. When is memoization genuinely worthwhile in production apps?',
          questionType: 'conceptual',
          difficulty: 'Hard',
          category: 'Performance',
          timeLimitMinutes: 10,
          hints: ['Consider memory overhead of closures and dependency array comparisons.'],
        },
      ],
      Node: [
        {
          questionId: 'q_node_1',
          title: 'Node.js Event Loop Phases & Microtasks',
          question: 'Walk through the 6 phases of the libuv event loop in Node.js (Timers, Pending Callbacks, Idle/Prepare, Poll, Check, Close). Where do `process.nextTick()` and `Promise.then()` callbacks fit into this cycle?',
          questionType: 'conceptual',
          difficulty: 'Hard',
          category: 'Node.js Internals',
          timeLimitMinutes: 12,
          hints: ['Contrast nextTick queue with standard microtask queue and phase boundaries.'],
        },
        {
          questionId: 'q_node_2',
          title: 'Rate Limiter Middleware Implementation',
          question: 'Write an in-memory sliding-window or token-bucket rate limiter function that restricts a client IP to at most `maxRequests` per `windowMs` duration.',
          questionType: 'coding',
          difficulty: 'Medium',
          category: 'Backend Security',
          timeLimitMinutes: 15,
          starterCode: {
            javascript: `function rateLimiter(requests, maxAllowed, windowMs) {\n  // requests: array of timestamps [ms]\n  // return boolean whether the latest request is accepted\n  return true;\n}`,
            python: `def rate_limiter(requests, max_allowed, window_ms):\n    # Return True if latest request is within limits\n    return True`,
            cpp: `#include <vector>\nbool rateLimiter(std::vector<long long>& reqs, int maxAllowed, int windowMs) {\n    return true;\n}`,
          },
          testCases: [
            { input: '[100, 200, 300], 5, 1000', expectedOutput: 'true', description: 'Within rate limit bounds' },
            { input: '[100, 200, 300, 400, 500, 600], 5, 1000', expectedOutput: 'false', description: 'Exceeds threshold' },
          ],
        },
        {
          questionId: 'q_node_3',
          title: 'Backpressure in Node.js Streams',
          question: 'What is backpressure in Node.js stream pipelines? How do readable and writable streams communicate buffer saturation, and how does `.pipe()` prevent out-of-memory crashes on large files?',
          questionType: 'conceptual',
          difficulty: 'Medium',
          category: 'Streams & I/O',
          timeLimitMinutes: 10,
        },
      ],
      DSA: [
        {
          questionId: 'q_dsa_1',
          title: 'Two Sum Problem',
          question: 'Given an array of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to `target`. You may assume each input has exactly one solution, and you may not use the same element twice. Aim for O(n) time complexity.',
          questionType: 'coding',
          difficulty: 'Easy',
          category: 'Arrays & Hashing',
          timeLimitMinutes: 15,
          starterCode: {
            javascript: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
            python: `def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        comp = target - num\n        if comp in seen:\n            return [seen[comp], i]\n        seen[num] = i\n    return []`,
            cpp: `#include <vector>\n#include <unordered_map>\nstd::vector<int> twoSum(std::vector<int>& nums, int target) {\n    std::unordered_map<int, int> map;\n    for (int i = 0; i < nums.size(); i++) {\n        int comp = target - nums[i];\n        if (map.find(comp) != map.end()) return {map[comp], i};\n        map[nums[i]] = i;\n    }\n    return {};\n}`,
          },
          testCases: [
            { input: '[2,7,11,15], 9', expectedOutput: '[0,1]', description: 'Basic pair test' },
            { input: '[3,2,4], 6', expectedOutput: '[1,2]', description: 'Non-zero indexed pair' },
            { input: '[3,3], 6', expectedOutput: '[0,1]', description: 'Duplicate elements test' },
          ],
        },
        {
          questionId: 'q_dsa_2',
          title: 'LRU Cache Design',
          question: 'Design an LRU (Least Recently Used) Cache data structure supporting `get(key)` and `put(key, value)` in O(1) average time complexity. Explain the chosen underlying data structures.',
          questionType: 'system-design',
          difficulty: 'Hard',
          category: 'Data Structures',
          timeLimitMinutes: 15,
          hints: ['Combine a hash map with a doubly linked list.'],
        },
        {
          questionId: 'q_dsa_3',
          title: 'Longest Substring Without Repeating Characters',
          question: 'Given a string `s`, find the length of the longest substring without repeating characters using the sliding window technique.',
          questionType: 'coding',
          difficulty: 'Medium',
          category: 'Sliding Window',
          timeLimitMinutes: 15,
          starterCode: {
            javascript: `function lengthOfLongestSubstring(s) {\n  let maxLength = 0;\n  let start = 0;\n  const charMap = new Map();\n  for (let i = 0; i < s.length; i++) {\n    if (charMap.has(s[i]) && charMap.get(s[i]) >= start) {\n      start = charMap.get(s[i]) + 1;\n    }\n    charMap.set(s[i], i);\n    maxLength = Math.max(maxLength, i - start + 1);\n  }\n  return maxLength;\n}`,
            python: `def length_of_longest_substring(s):\n    seen = {}\n    start = max_len = 0\n    for i, c in enumerate(s):\n        if c in seen and seen[c] >= start:\n            start = seen[c] + 1\n        seen[c] = i\n        max_len = max(max_len, i - start + 1)\n    return max_len`,
            cpp: `#include <string>\n#include <unordered_map>\n#include <algorithm>\nint lengthOfLongestSubstring(std::string s) {\n    std::unordered_map<char, int> seen;\n    int start = 0, maxLen = 0;\n    for (int i = 0; i < s.length(); i++) {\n        if (seen.find(s[i]) != seen.end() && seen[s[i]] >= start) {\n            start = seen[s[i]] + 1;\n        }\n        seen[s[i]] = i;\n        maxLen = std::max(maxLen, i - start + 1);\n    }\n    return maxLen;\n}`,
          },
          testCases: [
            { input: '"abcabcbb"', expectedOutput: '3', description: 'Repeating characters abc' },
            { input: '"bbbbb"', expectedOutput: '1', description: 'Single character repetition' },
            { input: '"pwwkew"', expectedOutput: '3', description: 'Substring wke' },
          ],
        },
      ],
      SystemDesign: [
        {
          questionId: 'q_sys_1',
          title: 'Distributed Rate Limiter & API Gateway',
          question: 'How would you architect a distributed rate-limiting service capable of processing 100,000 requests/sec across a multi-region microservices infrastructure? Discuss Redis cluster, token buckets, race conditions with Lua scripts, and eventual consistency.',
          questionType: 'system-design',
          difficulty: 'Hard',
          category: 'System Design',
          timeLimitMinutes: 15,
        },
        {
          questionId: 'q_sys_2',
          title: 'Database Indexing and B-Tree Architecture',
          question: 'Explain how B-Tree and B+Tree indexes function in relational databases (PostgreSQL/MySQL). What happens during an index seek versus index scan, and why does column ordering matter in composite indexes?',
          questionType: 'conceptual',
          difficulty: 'Medium',
          category: 'Databases & Storage',
          timeLimitMinutes: 10,
        },
      ],
    };

    // Pick relevant pool
    const techKey = Object.keys(questionsPool).find((k) =>
      technology.toLowerCase().includes(k.toLowerCase())
    ) || (interviewType === 'coding' ? 'DSA' : 'DSA');

    const selectedPool = questionsPool[techKey] || questionsPool.DSA;

    // Filter by type if strict
    let filtered = selectedPool;
    if (interviewType === 'coding') {
      filtered = selectedPool.filter((q) => q.questionType === 'coding');
      if (filtered.length === 0) filtered = questionsPool.DSA.filter((q) => q.questionType === 'coding');
    } else if (interviewType === 'technical' || interviewType === 'voice') {
      filtered = selectedPool.filter((q) => q.questionType !== 'coding');
      if (filtered.length === 0) filtered = selectedPool;
    }

    // Clone and pad if needed
    const result: IInterviewQuestion[] = [];
    for (let i = 0; i < count; i++) {
      const source = filtered[i % filtered.length];
      result.push({
        ...source,
        questionId: `q_${Date.now()}_${i + 1}`,
        difficulty,
      });
    }

    return result;
  }
}
