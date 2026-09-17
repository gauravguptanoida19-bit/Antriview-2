# Antiview Database Architecture & Schema Design

Antiview uses MongoDB with Mongoose ODM for flexible document modeling, fast compound querying, and schema validation.

---

## 1. Schema Specifications

### 1.1 User Model (`User.ts`)
Stores candidate credentials, profile attributes, and target career goals.

| Field | Type | Validation / Description |
|---|---|---|
| `_id` | ObjectId | Primary Key |
| `name` | String | Required, trimmed, max 100 characters |
| `email` | String | Required, unique, lowercase, regex-validated |
| `password` | String | Required, hashed using bcrypt (cost 10), hidden by default |
| `role` | String | Enum: `candidate`, `interviewer`, `admin` (default: `candidate`) |
| `targetRole` | String | Target engineering role (e.g. `Full Stack Developer`) |
| `experienceLevel` | String | Enum: `Junior`, `Mid-Level`, `Senior`, `Lead` |
| `skills` | Array\<String\> | Keyword tags representing technical competencies |
| `createdAt` | Date | Timestamp |
| `updatedAt` | Date | Timestamp |

---

### 1.2 Interview Model (`Interview.ts`)
Manages interview sessions, questions, evaluations, and overall performance summaries.

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Primary Key |
| `userId` | ObjectId (ref: User) | Candidate owner (indexed) |
| `role` | String | Target position evaluated |
| `technology` | String | Primary technology evaluated |
| `difficulty` | String | Enum: `Easy`, `Medium`, `Hard` |
| `interviewType` | String | Enum: `technical`, `coding`, `voice`, `combined` |
| `status` | String | Enum: `pending`, `in_progress`, `completed`, `abandoned` |
| `durationMinutes` | Number | Allocated duration |
| `timeSpentSeconds` | Number | Active elapsed time |
| `currentQuestionIndex` | Number | Active question pointer |
| `overallScore` | Number | Percentage score (0 - 100) |
| `technicalScore` | Number | Core systems benchmark (0 - 100) |
| `codingScore` | Number | Sandbox coding benchmark (0 - 100) |
| `clarityScore` | Number | Verbal/conceptual communication (0 - 100) |
| `overallFeedback` | String | Gemini executive assessment paragraph |
| `strengthsSummary` | Array\<String\> | Key candidate strengths |
| `weaknessesSummary` | Array\<String\> | Key candidate growth areas |
| `recommendedRoadmap` | Array\<String\> | Concrete preparation action items |
| `questions` | Array\<IInterviewQuestion\> | Embedded array of questions & evaluations |
| `startedAt` | Date | Timestamp of interview start |
| `completedAt` | Date | Timestamp of interview completion |

---

### 1.3 Embedded Question Schema (`IInterviewQuestion`)

```json
{
  "questionId": "q_169490123_1",
  "title": "React Fiber Architecture and Reconciliation",
  "question": "Explain how React Fiber enables incremental rendering...",
  "questionType": "conceptual | coding | system-design | behavioral",
  "difficulty": "Medium",
  "category": "React Internals",
  "timeLimitMinutes": 10,
  "hints": ["Consider work loops and scheduling lanes"],
  "starterCode": {
    "javascript": "// Starter code",
    "python": "# Starter code",
    "cpp": "// Starter code"
  },
  "testCases": [
    {
      "input": "[2, 7, 11, 15], 9",
      "expectedOutput": "[0, 1]",
      "description": "Standard vector test"
    }
  ],
  "candidateAnswer": "Candidate written or spoken response",
  "codeAnswer": "function solution() { ... }",
  "language": "javascript",
  "codeExecutionResult": {
    "passed": true,
    "totalTests": 3,
    "passedTests": 3,
    "executionTimeMs": 14,
    "details": [ ... ]
  },
  "evaluation": {
    "score": 9,
    "correctness": 9,
    "technicalDepth": 9,
    "clarity": 8,
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "feedback": "Optimal linear scan with hash map lookup.",
    "strengths": ["Single pass implementation"],
    "improvements": ["Defensive input bounds checks"]
  }
}
```

---

## 2. Database Indexing Strategy

To guarantee rapid query response times on dashboard and history queries:
```typescript
// Fast sorted retrieval of user interview histories
InterviewSchema.index({ userId: 1, createdAt: -1 });

// Fast filtering by completion status (for analytics calculations)
InterviewSchema.index({ userId: 1, status: 1 });

// Fast domain-specific search
InterviewSchema.index({ userId: 1, role: 1 });
```

---

## 3. Zero-Config Dual-Mode Engine

To enable seamless portfolio evaluation:
1. **Cloud / Local MongoDB**: If `MONGODB_URI` is provided in `.env`, Mongoose connects directly with a 4000ms selection timeout.
2. **Auto-Fallback to `mongodb-memory-server`**: If `MONGODB_URI` is blank or local connection is refused, Antiview automatically initializes an in-memory MongoDB daemon in the background with `launchTimeout: 120000ms`.
3. **Automatic Demo Seeder**: When running in demo mode, the database immediately populates sample senior candidate profiles (`demo@antiview.dev`), realistic past interviews, code diffs, and analytics charts.
