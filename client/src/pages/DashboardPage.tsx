import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardApi } from '../services/api';
import { DashboardStats, PerformanceData, RecommendationsData } from '../types';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Spinner } from '../components/common/Spinner';
import { EmptyState } from '../components/common/EmptyState';
import { PerformanceTrendChart } from '../components/charts/PerformanceTrendChart';
import { ScoreRadarChart } from '../components/charts/ScoreRadarChart';
import {
  Sparkles,
  PlusCircle,
  Trophy,
  Target,
  Code2,
  Clock,
  ArrowRight,
  TrendingUp,
  Lightbulb,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { formatDate, formatDuration, getScoreBadgeColor, getStatusColor, getDifficultyColor } from '../utils/formatters';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [performance, setPerformance] = useState<PerformanceData | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, perfRes, recRes] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getPerformance(),
          dashboardApi.getRecommendations(),
        ]);

        if (statsRes.success) setStats(statsRes.stats);
        if (perfRes.success) {
          setPerformance({
            trend: perfRes.trend,
            radarData: perfRes.radarData,
            difficultyDistribution: perfRes.difficultyDistribution,
          });
        }
        if (recRes.success) setRecommendations(recRes);
      } catch (err: any) {
        console.error('Failed to load dashboard:', err);
        setError('Failed to load dashboard metrics. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Spinner size="lg" />
          <p className="text-sm text-gray-500">Synthesizing interview metrics...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Welcome back, {user?.name?.split(' ')[0] || 'Candidate'}!
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Target Role: <strong className="text-brand-500">{user?.targetRole || 'Software Engineer'}</strong> ({user?.experienceLevel || 'Mid-Level'})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/interview/setup">
              <Button
                variant="primary"
                size="md"
                leftIcon={<PlusCircle className="w-4 h-4" />}
                className="shadow-md shadow-brand-500/20"
              >
                Start New Interview
              </Button>
            </Link>
          </div>
        </div>

        {/* Top KPI Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 sm:p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500 uppercase tracking-wider font-semibold">
              <span>Total Sessions</span>
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                <Target className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              {stats?.totalInterviews || 0}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {stats?.completedInterviews || 0} completed successfully
            </div>
          </Card>

          <Card className="p-4 sm:p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500 uppercase tracking-wider font-semibold">
              <span>Average Score</span>
              <div className="p-1.5 rounded-lg bg-brand-500/10 text-brand-500">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {stats?.avgScore || 0}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Best achieved: <strong className="text-gray-300">{stats?.bestScore || 0}%</strong>
            </div>
          </Card>

          <Card className="p-4 sm:p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500 uppercase tracking-wider font-semibold">
              <span>Technical Knowledge</span>
              <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400">
              {stats?.avgTechScore || 0}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Clarity: <strong className="text-gray-300">{stats?.avgClarityScore || 0}%</strong>
            </div>
          </Card>

          <Card className="p-4 sm:p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500 uppercase tracking-wider font-semibold">
              <span>Coding Proficiency</span>
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                <Code2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">
              {stats?.avgCodingScore || 0}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Total practice: <strong className="text-gray-300">{stats?.totalMinutesSpent || 0} mins</strong>
            </div>
          </Card>
        </div>

        {/* Visual Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Trend Chart */}
          <Card className="lg:col-span-2 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-brand-500" />
                  Score Progression Over Time
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Tracks Overall, Technical Depth, and Coding execution across completed sessions
                </p>
              </div>
              <Link to="/analytics" className="text-xs font-medium text-brand-500 hover:underline">
                View Details
              </Link>
            </div>
            <PerformanceTrendChart data={performance?.trend || []} />
          </Card>

          {/* Skill Radar Chart */}
          <Card className="p-5 sm:p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Technical Skill Matrix
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                8-factor engineering competency evaluation
              </p>
            </div>
            <ScoreRadarChart data={performance?.radarData || []} />
          </Card>
        </div>

        {/* Recent Interviews & AI Recommendations Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Interviews Table */}
          <Card className="lg:col-span-2 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand-500" />
                Recent Technical Interviews
              </h3>
              <Link to="/history" className="text-xs text-brand-500 hover:underline flex items-center gap-1">
                <span>View Full History</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {stats?.recentInterviews && stats.recentInterviews.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-gray-500 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
                    <tr>
                      <th className="pb-3 font-semibold">Date</th>
                      <th className="pb-3 font-semibold">Target Role</th>
                      <th className="pb-3 font-semibold">Tech / Difficulty</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold">Score</th>
                      <th className="pb-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                    {stats.recentInterviews.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                        <td className="py-3 text-gray-500">{formatDate(item.createdAt)}</td>
                        <td className="py-3 font-medium text-gray-900 dark:text-gray-200">
                          {item.role}
                        </td>
                        <td className="py-3">
                          <span className="text-gray-400 mr-2">{item.technology}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] border ${getDifficultyColor(item.difficulty)}`}>
                            {item.difficulty}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold border ${getStatusColor(item.status)}`}>
                            {item.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3">
                          {item.status === 'completed' ? (
                            <span className={`px-2 py-0.5 rounded font-bold border ${getScoreBadgeColor(item.overallScore)}`}>
                              {item.overallScore}%
                            </span>
                          ) : (
                            <span className="text-gray-500 font-mono">-</span>
                          )}
                        </td>
                        <td className="py-3 text-right">
                          {item.status === 'completed' ? (
                            <Link
                              to={`/interview/${item._id}/results`}
                              className="text-brand-500 hover:underline font-semibold"
                            >
                              Review
                            </Link>
                          ) : (
                            <Link
                              to={`/interview/${item._id}`}
                              className="text-blue-400 hover:underline font-semibold"
                            >
                              Resume
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                title="No interview sessions yet"
                description="Launch your first AI-evaluated interview session to start building your portfolio score!"
                actionText="Start First Interview"
                onAction={() => navigate('/interview/setup')}
              />
            )}
          </Card>

          {/* AI Recommended Improvement Areas */}
          <Card className="p-5 sm:p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                Targeted AI Roadmap
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Identified weak spots synthesized from candidate evaluations:
              </p>

              <div className="space-y-2 pt-1">
                {recommendations?.recommendedAreas?.slice(0, 3).map((area, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200/90 flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                    <span>{area}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Action Item
              </span>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                {recommendations?.actionItems?.[0] ||
                  'Solve 5 medium-difficulty Sliding Window & Monotonic Stack challenges.'}
              </p>
              <Link to="/interview/setup" className="block pt-2">
                <Button variant="secondary" size="sm" className="w-full">
                  Practice Weak Topics
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};
