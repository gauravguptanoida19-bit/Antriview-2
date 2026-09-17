import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { interviewApi } from '../services/api';
import { IInterview } from '../types';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Spinner } from '../components/common/Spinner';
import {
  Trophy,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Code2,
  Clock,
  Compass,
  RotateCcw,
  Share2,
} from 'lucide-react';
import { formatDate, formatDuration, getScoreBadgeColor, getDifficultyColor } from '../utils/formatters';

export const InterviewResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [interview, setInterview] = useState<IInterview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedQuestionIdx, setExpandedQuestionIdx] = useState<number | null>(0);

  useEffect(() => {
    const fetchResults = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await interviewApi.getById(id);
        if (res.success && res.interview) {
          setInterview(res.interview);

          // Trigger celebratory confetti if score is solid
          if ((res.interview.overallScore || 0) >= 70) {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#22c55e', '#3b82f6', '#a855f7'],
            });
          }
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch interview results.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Spinner size="lg" />
          <p className="text-sm text-gray-500">Generating comprehensive AI scorecard...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !interview) {
    return (
      <DashboardLayout>
        <div className="text-center py-20 space-y-4">
          <h2 className="text-xl font-bold text-rose-500">Results Not Available</h2>
          <p className="text-sm text-gray-400">{error || 'Could not locate interview report.'}</p>
          <Button variant="primary" onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const overall = interview.overallScore || 75;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="success" size="sm">
                Evaluation Completed
              </Badge>
              <span className="text-xs text-gray-500">{formatDate(interview.completedAt || interview.createdAt)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              {interview.role} Interview Assessment
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Focus: <strong className="text-gray-200">{interview.technology}</strong> • Rigor:{' '}
              <span className={`px-1.5 py-0.5 rounded text-xs border ${getDifficultyColor(interview.difficulty)}`}>
                {interview.difficulty}
              </span>{' '}
              • Duration: {formatDuration(interview.timeSpentSeconds)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/interview/setup">
              <Button variant="outline" size="sm" leftIcon={<RotateCcw className="w-4 h-4" />}>
                Practice Again
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Scorecard Hero Banner */}
        <Card className="p-6 sm:p-8 bg-gradient-to-br from-white via-white to-brand-500/5 dark:from-[#111827] dark:via-[#111827] dark:to-brand-950/20 border-brand-500/30 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            {/* Main Score Radial / Gauge */}
            <div className="flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    className="text-gray-200 dark:text-gray-800 stroke-current"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    className="text-brand-500 stroke-current transition-all duration-1000 ease-out"
                    strokeWidth="10"
                    strokeDasharray={326.7}
                    strokeDashoffset={326.7 - (326.7 * overall) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
                    {overall}%
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider">
                    Overall
                  </span>
                </div>
              </div>

              <span className={`mt-3 px-3 py-1 rounded-full text-xs font-bold border ${getScoreBadgeColor(overall)}`}>
                {overall >= 85 ? 'Strong Hire Recommendation' : overall >= 70 ? 'Hire Recommendation' : 'Developing Candidate'}
              </span>
            </div>

            {/* Sub-scores Columns */}
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-gray-50/70 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 space-y-1">
                <span className="text-xs uppercase font-semibold tracking-wider text-gray-400">
                  Technical Knowledge
                </span>
                <div className="text-2xl font-bold text-blue-500">
                  {interview.technicalScore || overall}%
                </div>
                <p className="text-[11px] text-gray-500">
                  Conceptual depth, architecture, and language mechanics
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50/70 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 space-y-1">
                <span className="text-xs uppercase font-semibold tracking-wider text-gray-400">
                  Coding Proficiency
                </span>
                <div className="text-2xl font-bold text-emerald-400">
                  {interview.codingScore || overall}%
                </div>
                <p className="text-[11px] text-gray-500">
                  Algorithmic correctness, Big-O complexity, and syntax
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50/70 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 space-y-1">
                <span className="text-xs uppercase font-semibold tracking-wider text-gray-400">
                  Communication Clarity
                </span>
                <div className="text-2xl font-bold text-purple-400">
                  {interview.clarityScore || overall}%
                </div>
                <p className="text-[11px] text-gray-500">
                  Structured problem breakdown, terminology, and tone
                </p>
              </div>

              {/* Overall Executive Feedback */}
              <div className="sm:col-span-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-500 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Gemini AI Executive Evaluation
                </div>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {interview.overallFeedback ||
                    'Candidate showed good core competence and structured communication during the technical interview loop.'}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Strengths, Weaknesses, and Roadmap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Key Strengths */}
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Identified Engineering Strengths
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
              {interview.strengthsSummary?.map((s, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Areas for Growth */}
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Targeted Improvement Opportunities
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
              {interview.weaknessesSummary?.map((w, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Actionable Recommended Roadmap */}
          <Card className="md:col-span-2 p-6 space-y-4 bg-purple-500/5 border-purple-500/20">
            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
              <Compass className="w-4 h-4" />
              Tailored Preparation Roadmap
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {interview.recommendedRoadmap?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 text-xs text-gray-700 dark:text-gray-300 flex items-start gap-3"
                >
                  <span className="w-5 h-5 rounded-full bg-purple-500/10 text-purple-400 font-bold flex items-center justify-center text-[11px] flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Granular Question-by-Question Review */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Question-by-Question Deep Dive
          </h2>

          <div className="space-y-3">
            {interview.questions.map((q, idx) => {
              const isExpanded = expandedQuestionIdx === idx;
              const qScore = q.evaluation?.score || 0;

              return (
                <Card key={idx} className="overflow-hidden">
                  <div
                    onClick={() => setExpandedQuestionIdx(isExpanded ? null : idx)}
                    className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/40 select-none transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold text-xs flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                          {q.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                          <span className="capitalize">{q.questionType}</span>
                          <span>•</span>
                          <span>{q.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-0.5 rounded text-xs font-bold border ${getScoreBadgeColor(qScore * 10)}`}>
                        {qScore}/10
                      </span>
                    </div>
                  </div>

                  {/* Expanded Accordion Body */}
                  {isExpanded && (
                    <div className="p-5 border-t border-gray-100 dark:border-gray-800/80 bg-gray-50/40 dark:bg-gray-950/40 space-y-4 animate-in fade-in duration-150 text-xs sm:text-sm">
                      {/* Question Text */}
                      <div className="space-y-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                          Question Prompt
                        </span>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                          {q.question}
                        </p>
                      </div>

                      {/* Candidate Answer / Code */}
                      {q.codeAnswer ? (
                        <div className="space-y-1">
                          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Candidate Code Solution ({q.language || 'javascript'})
                          </span>
                          <pre className="p-3.5 rounded-xl bg-gray-950 text-gray-200 font-mono text-xs overflow-x-auto border border-gray-800">
                            {q.codeAnswer}
                          </pre>
                        </div>
                      ) : q.candidateAnswer ? (
                        <div className="space-y-1">
                          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Candidate Written / Spoken Response
                          </span>
                          <div className="p-3.5 rounded-xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 leading-relaxed">
                            {q.candidateAnswer}
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs italic text-gray-500">Question was skipped or unanswered.</p>
                      )}

                      {/* AI Evaluation */}
                      {q.evaluation && (
                        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-2 text-xs text-purple-200">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-purple-400 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5" />
                              Gemini Rubric Breakdown
                            </span>
                            <div className="flex items-center gap-2">
                              {q.evaluation.timeComplexity && (
                                <span className="bg-purple-500/20 px-2 py-0.5 rounded font-mono">
                                  Time: {q.evaluation.timeComplexity}
                                </span>
                              )}
                              {q.evaluation.spaceComplexity && (
                                <span className="bg-purple-500/20 px-2 py-0.5 rounded font-mono">
                                  Space: {q.evaluation.spaceComplexity}
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-gray-300 leading-relaxed">{q.evaluation.feedback}</p>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
