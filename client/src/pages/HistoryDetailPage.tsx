import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { interviewApi } from '../services/api';
import { IInterview } from '../types';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Spinner } from '../components/common/Spinner';
import {
  ChevronLeft,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Clock,
  Compass,
  Calendar,
} from 'lucide-react';
import { formatDate, formatDuration, getScoreBadgeColor, getDifficultyColor } from '../utils/formatters';

export const HistoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [interview, setInterview] = useState<IInterview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await interviewApi.getById(id);
        if (res.success && res.interview) {
          setInterview(res.interview);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load historical record.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-24">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !interview) {
    return (
      <DashboardLayout>
        <div className="text-center py-20 space-y-4">
          <h2 className="text-xl font-bold text-rose-500">Record Not Found</h2>
          <p className="text-sm text-gray-400">{error || 'Session could not be located.'}</p>
          <Button variant="primary" onClick={() => navigate('/history')}>
            Back to History
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
          <Link
            to="/history"
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to All Records</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(interview.completedAt || interview.createdAt)}
            </span>
            <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getScoreBadgeColor(interview.overallScore)}`}>
              Score: {interview.overallScore}%
            </span>
          </div>
        </div>

        {/* Title Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            {interview.role} Assessment Record
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Focus: <strong className="text-gray-200">{interview.technology}</strong> • Rigor:{' '}
            <span className={`px-1.5 py-0.5 rounded text-xs border ${getDifficultyColor(interview.difficulty)}`}>
              {interview.difficulty}
            </span>{' '}
            • Duration: {formatDuration(interview.timeSpentSeconds)}
          </p>
        </div>

        {/* Executive Summary */}
        <Card className="p-6 space-y-3 bg-gray-50 dark:bg-gray-900/60">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-500">
            <Sparkles className="w-4 h-4" />
            AI Interview Evaluation Summary
          </div>
          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {interview.overallFeedback || 'Assessment completed successfully.'}
          </p>
        </Card>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Observed Strengths
            </h3>
            <ul className="space-y-2 text-xs text-gray-300">
              {interview.strengthsSummary?.map((s, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Growth Opportunities
            </h3>
            <ul className="space-y-2 text-xs text-gray-300">
              {interview.weaknessesSummary?.map((w, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Question Details List */}
        <div className="space-y-4 pt-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Questions, Candidate Responses & Evaluated Metrics
          </h2>

          <div className="space-y-4">
            {interview.questions.map((q, idx) => (
              <Card key={idx} className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
                  <div>
                    <span className="text-xs font-mono text-brand-500 font-semibold">
                      Question {idx + 1} • {q.category}
                    </span>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mt-1">
                      {q.title}
                    </h3>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getScoreBadgeColor((q.evaluation?.score || 0) * 10)}`}>
                    Score: {q.evaluation?.score || 0}/10
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-gray-300 whitespace-pre-line leading-relaxed">
                  {q.question}
                </div>

                {/* Candidate code / text response */}
                {q.codeAnswer ? (
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      Code Submission ({q.language || 'javascript'})
                    </span>
                    <pre className="p-3.5 rounded-xl bg-gray-950 text-gray-200 font-mono text-xs overflow-x-auto border border-gray-800">
                      {q.codeAnswer}
                    </pre>
                  </div>
                ) : q.candidateAnswer ? (
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      Spoken / Written Response
                    </span>
                    <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-xs sm:text-sm text-gray-200 leading-relaxed">
                      {q.candidateAnswer}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs italic text-gray-500">Unanswered</p>
                )}

                {/* AI Rubric */}
                {q.evaluation && (
                  <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200 space-y-1.5">
                    <div className="font-semibold text-purple-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Gemini Feedback
                    </div>
                    <p className="text-gray-300 leading-relaxed">{q.evaluation.feedback}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
