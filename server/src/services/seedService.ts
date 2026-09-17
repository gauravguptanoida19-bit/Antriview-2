import { User } from '../models/User.js';
import { Interview } from '../models/Interview.js';

export class SeedService {
  public static async seedDemoData(): Promise<void> {
    try {
      const existingUser = await User.findOne({ email: 'demo@antiview.dev' });
      if (existingUser) {
        // If demo user already exists, ensure they have demo interviews
        const interviewCount = await Interview.countDocuments({ userId: existingUser._id });
        if (interviewCount > 0) {
          console.log(`ℹ️ [SeedService] Demo user already has ${interviewCount} seeded interviews.`);
          return;
        }
      }

      console.log('🌱 [SeedService] Seeding comprehensive demo data for Antiview...');

      // Create Demo User
      let demoUser = await User.findOne({ email: 'demo@antiview.dev' });
      if (!demoUser) {
        demoUser = await User.create({
          name: 'Alex Chen',
          email: 'demo@antiview.dev',
          password: 'DemoPassword123!',
          role: 'candidate',
          targetRole: 'Full Stack Engineer',
          experienceLevel: 'Senior',
          skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'System Design', 'Docker', 'Python'],
        });
        console.log('👤 [SeedService] Created primary demo user: demo@antiview.dev (Pass: DemoPassword123!)');
      }

      // Seed 5 realistic completed interviews with varied scores, dates, and topics
      const now = new Date();
      const demoInterviews = [
        {
          userId: demoUser._id,
          role: 'Full Stack Engineer',
          technology: 'React & Node.js',
          difficulty: 'Hard',
          interviewType: 'combined',
          status: 'completed',
          durationMinutes: 45,
          timeSpentSeconds: 2420,
          currentQuestionIndex: 3,
          overallScore: 88,
          technicalScore: 86,
          codingScore: 92,
          clarityScore: 88,
          overallFeedback: 'Alex demonstrated senior-level architecture comprehension and clean code execution. Handled concurrency trade-offs smoothly and wrote modular React hooks with defensive state management.',
          strengthsSummary: [
            'Exceptional mastery of React reconciliation and custom hook mechanics',
            'Strong architectural instinct regarding microservices rate-limiting and cache invalidation',
            'Clean idiomatic TypeScript with clear interface contracts',
          ],
          weaknessesSummary: [
            'Could discuss memory profiling tools like Chrome DevTools Memory Inspector more explicitly',
            'Elaborate on database deadlock detection when handling high-concurrency transactions',
          ],
          recommendedRoadmap: [
            'Deep dive into PostgreSQL distributed consensus and write-ahead logs',
            'Explore WebAssembly for performance-critical client-side audio/video processing',
            'Review Advanced Kubernetes deployment patterns (Canary, Blue/Green rollout strategies)',
          ],
          startedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
          completedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 2420 * 1000),
          questions: [
            {
              questionId: 'demo_q_1',
              title: 'React Fiber Architecture and Priority Scheduling',
              question: 'Explain how React Fiber enables incremental rendering and concurrent mode. What are the key distinctions between the render phase and commit phase?',
              questionType: 'conceptual',
              difficulty: 'Hard',
              category: 'React Internals',
              timeLimitMinutes: 10,
              candidateAnswer: 'React Fiber restructured the call stack into a linked-list of fiber nodes. In the render phase, React can pause, resume, or abort work based on priority lanes (e.g. user input vs transition updates). The commit phase is synchronous to guarantee a consistent DOM tree.',
              evaluation: {
                score: 9,
                correctness: 9,
                technicalDepth: 9,
                clarity: 9,
                feedback: 'Superb breakdown of the dual-phase model and priority scheduling lanes.',
                strengths: ['Accurate explanation of fiber linked list', 'Correct differentiation between phases'],
                improvements: ['Mention lane bitmasks for bonus technical rigor'],
              },
              answeredAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 400 * 1000),
            },
            {
              questionId: 'demo_q_2',
              title: 'LRU Cache Implementation',
              question: 'Implement an LRU Cache with get and put methods operating in O(1) time complexity.',
              questionType: 'coding',
              difficulty: 'Hard',
              category: 'Data Structures',
              timeLimitMinutes: 20,
              language: 'javascript',
              codeAnswer: `class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.map = new Map();\n  }\n  get(key) {\n    if (!this.map.has(key)) return -1;\n    const val = this.map.get(key);\n    this.map.delete(key);\n    this.map.set(key, val);\n    return val;\n  }\n  put(key, value) {\n    if (this.map.has(key)) this.map.delete(key);\n    else if (this.map.size >= this.capacity) {\n      const oldestKey = this.map.keys().next().value;\n      this.map.delete(oldestKey);\n    }\n    this.map.set(key, value);\n  }\n}`,
              codeExecutionResult: {
                passed: true,
                totalTests: 3,
                passedTests: 3,
                executionTimeMs: 14,
                details: [
                  { input: 'get(1), put(1,10)', expected: '10', actual: '10', passed: true },
                  { input: 'put(2,20), put(3,30)', expected: 'Evict 1', actual: 'Evict 1', passed: true },
                  { input: 'get(2)', expected: '20', actual: '20', passed: true },
                ],
              },
              evaluation: {
                score: 9,
                correctness: 9,
                technicalDepth: 9,
                clarity: 9,
                timeComplexity: 'O(1)',
                spaceComplexity: 'O(capacity)',
                feedback: 'Clever use of JavaScript Map key insertion ordering to simulate a doubly linked list in O(1).',
                strengths: ['Succinct O(1) operations', 'Proper eviction logic'],
                improvements: ['Can implement explicit DoublyLinkedList node pointers in C++/Java contexts'],
              },
              answeredAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 1600 * 1000),
            },
            {
              questionId: 'demo_q_3',
              title: 'Distributed System Idempotency in Payment Processing',
              question: 'How do you guarantee exactly-once semantics and idempotency in distributed microservice payment architectures?',
              questionType: 'system-design',
              difficulty: 'Hard',
              category: 'System Design',
              timeLimitMinutes: 15,
              candidateAnswer: 'We generate unique client-side idempotency keys passed in HTTP headers. In the payment gateway, we use atomic distributed locks (Redis Redlock or PostgreSQL unique constraints) with status transitions (INITIATED, PROCESSING, COMPLETED) to return cached receipts on retry.',
              evaluation: {
                score: 9,
                correctness: 9,
                technicalDepth: 9,
                clarity: 8,
                feedback: 'Robust design addressing network timeouts, race conditions, and ledger reconciliation.',
                strengths: ['Accurate idempotency key lifecycle', 'Distributed locking insight'],
                improvements: ['Mention two-phase commit or saga pattern for multi-service compensation'],
              },
              answeredAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 2400 * 1000),
            },
          ],
        },
        {
          userId: demoUser._id,
          role: 'Software Engineer',
          technology: 'Data Structures & Algorithms',
          difficulty: 'Medium',
          interviewType: 'coding',
          status: 'completed',
          durationMinutes: 30,
          timeSpentSeconds: 1540,
          currentQuestionIndex: 2,
          overallScore: 92,
          technicalScore: 90,
          codingScore: 95,
          clarityScore: 90,
          overallFeedback: 'Outstanding algorithmic efficiency. Solved two pointer and sliding window problems with minimal iterations and clean edge case handling.',
          strengthsSummary: [
            'Optimal Big-O computational intuition',
            'Strong test case verification before submission',
          ],
          weaknessesSummary: [
            'Could comment on integer overflow scenarios in extreme bounds',
          ],
          recommendedRoadmap: [
            'Advance to Hard-difficulty Dynamic Programming and Graph traversal algorithms',
          ],
          startedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
          completedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000 + 1540 * 1000),
          questions: [
            {
              questionId: 'demo_q_4',
              title: 'Two Sum Problem',
              question: 'Given an array of integers nums and target, return indices of two numbers adding up to target in O(n).',
              questionType: 'coding',
              difficulty: 'Easy',
              category: 'Arrays',
              timeLimitMinutes: 10,
              language: 'javascript',
              codeAnswer: `function twoSum(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const comp = target - nums[i];\n    if (seen.has(comp)) return [seen.get(comp), i];\n    seen.set(nums[i], i);\n  }\n  return [];\n}`,
              codeExecutionResult: {
                passed: true,
                totalTests: 3,
                passedTests: 3,
                executionTimeMs: 11,
                details: [
                  { input: '[2,7,11,15], 9', expected: '[0,1]', actual: '[0,1]', passed: true },
                  { input: '[3,2,4], 6', expected: '[1,2]', actual: '[1,2]', passed: true },
                  { input: '[3,3], 6', expected: '[0,1]', actual: '[0,1]', passed: true },
                ],
              },
              evaluation: {
                score: 10,
                correctness: 10,
                technicalDepth: 9,
                clarity: 10,
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(n)',
                feedback: 'Optimal linear time complexity single-pass hash map solution.',
                strengths: ['Single pass', 'Optimal O(n) space/time balance'],
                improvements: ['Code is production ready'],
              },
              answeredAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000 + 600 * 1000),
            },
            {
              questionId: 'demo_q_5',
              title: 'Longest Substring Without Repeating Characters',
              question: 'Find the length of longest substring without duplicate characters using sliding window.',
              questionType: 'coding',
              difficulty: 'Medium',
              category: 'Sliding Window',
              timeLimitMinutes: 15,
              language: 'javascript',
              codeAnswer: `function lengthOfLongestSubstring(s) {\n  let maxLen = 0, start = 0;\n  const map = new Map();\n  for (let i = 0; i < s.length; i++) {\n    if (map.has(s[i]) && map.get(s[i]) >= start) {\n      start = map.get(s[i]) + 1;\n    }\n    map.set(s[i], i);\n    maxLen = Math.max(maxLen, i - start + 1);\n  }\n  return maxLen;\n}`,
              codeExecutionResult: {
                passed: true,
                totalTests: 3,
                passedTests: 3,
                executionTimeMs: 12,
                details: [
                  { input: '"abcabcbb"', expected: '3', actual: '3', passed: true },
                  { input: '"bbbbb"', expected: '1', actual: '1', passed: true },
                  { input: '"pwwkew"', expected: '3', actual: '3', passed: true },
                ],
              },
              evaluation: {
                score: 9,
                correctness: 9,
                technicalDepth: 9,
                clarity: 9,
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(min(m, n))',
                feedback: 'Clean sliding window with direct index skipping.',
                strengths: ['Optimal index jumps', 'Correct window expansion'],
                improvements: ['Mention Unicode vs ASCII character sets'],
              },
              answeredAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000 + 1500 * 1000),
            },
          ],
        },
        {
          userId: demoUser._id,
          role: 'Backend Developer',
          technology: 'Node.js & MongoDB',
          difficulty: 'Medium',
          interviewType: 'technical',
          status: 'completed',
          durationMinutes: 30,
          timeSpentSeconds: 1680,
          currentQuestionIndex: 2,
          overallScore: 84,
          technicalScore: 85,
          codingScore: 82,
          clarityScore: 86,
          overallFeedback: 'Good grasp of event loop phases, stream piping, and Mongoose indexing strategies. Clear verbal articulation.',
          strengthsSummary: [
            'Deep knowledge of libuv event loop and microtask scheduling',
            'Strong understanding of B-Tree indexing and compound key query optimization',
          ],
          weaknessesSummary: [
            'Could explain sharding key selection pitfalls in high-write volume databases',
          ],
          recommendedRoadmap: [
            'Study MongoDB replica set failover elections and write concerns (w: majority, j: true)',
          ],
          startedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
          completedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000 + 1680 * 1000),
          questions: [
            {
              questionId: 'demo_q_6',
              title: 'Node.js Event Loop Microtasks',
              question: 'Explain the order of execution between process.nextTick, Promise.then, setTimeout(0), and setImmediate.',
              questionType: 'conceptual',
              difficulty: 'Medium',
              category: 'Node.js',
              candidateAnswer: 'process.nextTick has the highest priority and drains immediately after the current operation before event loop phases. Promise.then microtasks drain right after. setTimeout(0) runs in the Timers phase, while setImmediate runs in the Check phase after I/O polling.',
              evaluation: {
                score: 9,
                correctness: 9,
                technicalDepth: 8,
                clarity: 9,
                feedback: 'Precise and accurate sequencing of queues.',
                strengths: ['Accurate queue distinction', 'Clear terminology'],
                improvements: ['Provide code example of recursive nextTick starvation'],
              },
              answeredAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000 + 800 * 1000),
            },
          ],
        },
        {
          userId: demoUser._id,
          role: 'Frontend Developer',
          technology: 'TypeScript & Web Performance',
          difficulty: 'Hard',
          interviewType: 'voice',
          status: 'completed',
          durationMinutes: 20,
          timeSpentSeconds: 1120,
          currentQuestionIndex: 2,
          overallScore: 90,
          technicalScore: 88,
          codingScore: 90,
          clarityScore: 94,
          overallFeedback: 'Articulate responses on Core Web Vitals (LCP, INP, CLS) and modern TypeScript conditional types.',
          strengthsSummary: [
            'Excellent spoken clarity and concise technical definitions',
            'Solid comprehension of interaction-to-next-paint (INP) optimization',
          ],
          weaknessesSummary: [
            'Expand on HTTP/3 multiplexing benefits over HTTP/2 head-of-line blocking',
          ],
          recommendedRoadmap: [
            'Explore edge computing and streaming server-side rendering with partial hydration',
          ],
          startedAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
          completedAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000 + 1120 * 1000),
          questions: [
            {
              questionId: 'demo_q_7',
              title: 'Core Web Vitals INP and Long Tasks',
              question: 'How do you profile and diagnose poor Interaction to Next Paint (INP) scores in modern single-page applications?',
              questionType: 'conceptual',
              difficulty: 'Hard',
              category: 'Web Vitals',
              candidateAnswer: 'INP measures the latency of all interactions. We identify long tasks (>50ms) blocking the main thread using PerformanceObserver. We break up heavy JavaScript loops using scheduler.yield() or requestIdleCallback, and optimize heavy React renders with useTransition.',
              evaluation: {
                score: 9,
                correctness: 9,
                technicalDepth: 9,
                clarity: 9,
                feedback: 'Modern and insightful answer referencing scheduler.yield() and useTransition.',
                strengths: ['Contemporary API knowledge', 'Practical remediation steps'],
                improvements: ['Mention layout trashing and forced reflows'],
              },
              answeredAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000 + 500 * 1000),
            },
          ],
        },
      ];

      for (const item of demoInterviews) {
        await Interview.create(item);
      }

      console.log('✅ [SeedService] Seeded 4 diverse past interviews with analytics, questions, code, and evaluations.');
    } catch (err: any) {
      console.error('❌ [SeedService] Error seeding demo data:', err.message);
    }
  }
}
