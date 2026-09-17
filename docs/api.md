# Antiview REST API Documentation

Base URL: `http://localhost:5000/api`

All endpoints return JSON responses. Protected endpoints require the `Authorization` header with a valid JSON Web Token:
```http
Authorization: Bearer <jwt_token>
```

---

## 1. System Health

### `GET /health`
Returns system status, server version, and operational timestamps.

**Response `200 OK`**:
```json
{
  "status": "online",
  "app": "Antiview API",
  "version": "1.0.0",
  "timestamp": "2026-09-17T18:14:24.152Z"
}
```

---

## 2. Authentication API

### `POST /auth/register`
Creates a new candidate account and returns a JWT token.

**Request Body**:
```json
{
  "name": "Jordan Vance",
  "email": "jordan@example.com",
  "password": "SecurePassword123!",
  "targetRole": "Full Stack Developer",
  "experienceLevel": "Mid-Level"
}
```

**Response `201 Created`**:
```json
{
  "success": true,
  "message": "Account registered successfully",
  "token": "eyJhbGciOiJIUzI1Ni...",
  "user": {
    "id": "60d0fe4f5311236168a109ca",
    "name": "Jordan Vance",
    "email": "jordan@example.com",
    "role": "candidate",
    "targetRole": "Full Stack Developer",
    "experienceLevel": "Mid-Level",
    "skills": ["JavaScript", "TypeScript", "React", "Node.js"]
  }
}
```

---

### `POST /auth/login`
Authenticates user credentials and issues a JWT token.

**Request Body**:
```json
{
  "email": "jordan@example.com",
  "password": "SecurePassword123!"
}
```

---

### `POST /auth/demo-login`
Instant 1-click authentication as the pre-seeded demo user (`demo@antiview.dev`), enabling recruiters and evaluators to test the system immediately without typing credentials.

**Response `200 OK`**:
```json
{
  "success": true,
  "message": "Demo session active",
  "token": "eyJhbGciOiJIUzI1Ni...",
  "user": {
    "id": "6aac2df26e1841c78b3ce5ff",
    "name": "Alex Chen",
    "email": "demo@antiview.dev",
    "role": "candidate",
    "targetRole": "Full Stack Engineer",
    "experienceLevel": "Senior"
  }
}
```

---

### `GET /auth/me` *(Protected)*
Retrieves current authenticated user profile.

---

### `PUT /auth/profile` *(Protected)*
Updates candidate profile name, target role, experience level, and skills tags.

---

## 3. Interview Sessions API

### `POST /interviews` *(Protected)*
Configures and launches a new interview session. Automatically calls Google Gemini 3.8 Flash to synthesize custom questions.

**Request Body**:
```json
{
  "role": "Full Stack Developer",
  "technology": "React & Node.js",
  "difficulty": "Medium",
  "interviewType": "combined",
  "questionCount": 3,
  "durationMinutes": 30
}
```

**Response `201 Created`**:
```json
{
  "success": true,
  "message": "Interview session created successfully",
  "interview": {
    "_id": "64bf1829e01824128912",
    "userId": "6aac2df26e1841c78b3ce5ff",
    "role": "Full Stack Developer",
    "technology": "React & Node.js",
    "difficulty": "Medium",
    "interviewType": "combined",
    "status": "pending",
    "questions": [ ... ]
  }
}
```

---

### `GET /interviews` *(Protected)*
Lists interview sessions with multi-criteria filtering, search, sorting, and pagination.

**Query Parameters**:
- `status` (`completed` | `in_progress` | `pending` | `all`)
- `difficulty` (`Easy` | `Medium` | `Hard` | `all`)
- `interviewType` (`technical` | `coding` | `voice` | `combined` | `all`)
- `search`: Case-insensitive text search matching role or technology
- `sortBy` (`createdAt` | `overallScore` | `durationMinutes`)
- `order` (`asc` | `desc`)
- `page`: Page number (default: `1`)
- `limit`: Items per page (default: `10`)

---

### `GET /interviews/:id` *(Protected)*
Retrieves full interview session details, questions, answers, and evaluations.

---

### `POST /interviews/:id/start` *(Protected)*
Sets status to `in_progress` and records the start timestamp.

---

### `POST /interviews/:id/submit` *(Protected)*
Submits a verbal (voice transcript) or textual explanation for a specific question index. Invokes Gemini 3.8 Flash to score correctness, technical depth, and communication clarity.

**Request Body**:
```json
{
  "questionIndex": 0,
  "answer": "React Fiber restructures reconciliation into units of work linked as fibers..."
}
```

**Response `200 OK`**:
```json
{
  "success": true,
  "message": "Answer evaluated successfully",
  "evaluation": {
    "score": 9,
    "correctness": 9,
    "technicalDepth": 9,
    "clarity": 8,
    "feedback": "Clear explanation of fiber linked list units of work.",
    "strengths": ["Clear conceptual grasp of scheduling lanes"],
    "improvements": ["Elaborate on lane bitmasks"]
  }
}
```

---

### `POST /interviews/:id/code-submit` *(Protected)*
Submits candidate code for evaluation.

**Request Body**:
```json
{
  "questionIndex": 1,
  "code": "function twoSum(nums, target) { ... }",
  "language": "javascript",
  "runOnly": false
}
```
- When `runOnly: true`: Runs test cases in the safe execution runner and returns outputs without consuming Gemini evaluation tokens.
- When `runOnly: false`: Executes test cases AND triggers Google Gemini for Big-O time/space complexity analysis and code review.

---

### `POST /interviews/:id/complete` *(Protected)*
Finalizes the interview, marks status as `completed`, and generates aggregate score benchmarks, key strengths, growth opportunities, and a tailored study roadmap.

---

## 4. Candidate Dashboard & Analytics API

### `GET /dashboard/stats` *(Protected)*
Returns top-level metric counters:
- `totalInterviews`, `completedInterviews`, `inProgressInterviews`
- `avgScore`, `bestScore`, `avgTechScore`, `avgCodingScore`, `avgClarityScore`
- `totalMinutesSpent`
- `recentInterviews` (Last 5 records)

---

### `GET /dashboard/performance` *(Protected)*
Returns temporal score trends, 8-skill radar metrics (DSA, OOP, DBMS, OS, Networks, System Design, Programming, Web Dev), and difficulty distribution.

---

### `GET /dashboard/recommendations` *(Protected)*
Aggregates weak areas from recent candidate assessments and returns actionable preparation items.
