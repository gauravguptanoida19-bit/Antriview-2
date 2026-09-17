# Antiview AI Engine & Google Gemini Integration

The Antiview intelligence layer is powered by **Google Gemini 3.8 Flash** via the official `@google/genai` TypeScript SDK (v2.3+).

---

## 1. Model Selection & Rationale

| Parameter | Value | Rationale |
|---|---|---|
| **Model** | `gemini-3.8-flash` | High-throughput, sub-second latency, 1M token context, native JSON schema support |
| **SDK** | `@google/genai` (≥ 2.3.0) | Official modern Google GenAI library utilizing typed interaction schemas |
| **Response Format** | `application/json` | Enforces deterministic parsing for rubrics, test vectors, and Big-O notation |

---

## 2. Core AI Capabilities

### 2.1 Dynamic Technical Question Generation
Questions are dynamically composed at runtime matching:
- **Target Role**: e.g., Full Stack Developer, ML Engineer, Backend Developer.
- **Technology Domain**: e.g., React, Node.js, C++, System Design, SQL.
- **Difficulty Tier**: Easy, Medium, or Hard.
- **Mode**: Conceptual, Coding (includes starter code & test cases), or Verbal.

```typescript
const interaction = await client.interactions.create({
  model: 'gemini-3.8-flash',
  input: prompt,
  response_format: {
    type: 'text',
    mime_type: 'application/json',
  },
});
```

### 2.2 Candidate Answer Rubric Evaluation
When a candidate submits a written or voice-transcribed answer, Gemini evaluates three distinct dimensions on a 1-10 scale:
1. **Correctness**: Technical accuracy and alignment with production realities.
2. **Technical Depth**: Understanding of runtime internals, memory lifecycle, and edge cases.
3. **Communication Clarity**: Terminology precision and structured presentation.

Example evaluation output:
```json
{
  "score": 9,
  "correctness": 9,
  "technicalDepth": 8,
  "clarity": 9,
  "feedback": "Articulate explanation of libuv event loop microtask sequencing.",
  "strengths": [
    "Correctly distinguished nextTick queue from standard microtasks"
  ],
  "improvements": [
    "Mention recursive nextTick starvation risks in production servers"
  ]
}
```

### 2.3 Coding Complexity & Code Review
For Monaco Editor submissions:
- Assesses algorithmic structure and idiomatic language usage (JavaScript, Python, C++).
- Derives asymptotic Big-O computational bounds (`timeComplexity: "O(N)"`, `spaceComplexity: "O(1)"`).
- Highlights potential edge case oversights (integer overflow, empty inputs, null pointers).

### 2.4 Executive Summary & Personalized Roadmap
Upon session completion, Gemini analyzes all turn-by-turn evaluations and generates:
- Aggregate competency scores (Technical, Coding, Clarity).
- Synthesis of candidate strengths and growth opportunities.
- Actionable preparation roadmap (e.g. recommended LeetCode topic patterns, distributed system whitepapers).

---

## 3. Resilient Fallback Simulation Engine

To ensure that Antiview never crashes during live demonstrations, student evaluations, or portfolio reviews where `GEMINI_API_KEY` may not yet be configured:

- A dedicated heuristic generator with expertly curated domain knowledge pools (React Internals, Node.js Streams, Data Structures, System Design) activates transparently.
- Evaluates candidate input completeness, syntax correctness, and word density to output realistic, structured rubric scores and constructive feedback.
- Seamlessly transitions to live Google Gemini 3.8 Flash once a valid `GEMINI_API_KEY` is added to `.env`.
