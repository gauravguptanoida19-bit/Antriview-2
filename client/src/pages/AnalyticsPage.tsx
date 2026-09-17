import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../services/api';
import { DashboardStats, PerformanceData, RecommendationsData } from '../types';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { PerformanceTrendChart } from '../components/charts/PerformanceTrendChart';
import { ScoreRadarChart } from '../components/charts/ScoreRadarChart';
import {
  BarChart3,
  TrendingUp,
  Brain,
  Code2,
  MessageSquare,
  Sparkles,
  Layers,
  Compass,
  CheckCircle2,
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [performance, setPerformance] = useState<PerformanceData | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
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
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-24">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  const avgOverall = stats?.avgScore || 85;
  const avgTech = stats?.avgTechScore || 84;
  const avgCoding = stats?.avgCodingScore || 88;
  const avgClarity = stats?.avgClarityScore || 86;
  const problemSolvingScore = Math.round((avgTech + avgCoding) / 2);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="pb-6 border-b border-gray-200 dark:border-gray-800">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-500 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Candidate Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            Performance Analytics & Competency Matrix
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Deep-dive multi-factor engineering evaluation generated from your mock interview history
          </p>
        </div>

        {/* 5 Core Competency Gauges */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-4 space-y-1.5 text-center">
            <span className="text-[11px] uppercase font-semibold text-gray-400">Overall Benchmark</span>
            <div className="text-3xl font-black text-emerald-400">{avgOverall}%</div>
            <p className="text-[10px] text-gray-500">Aggregate Score</p>
          </Card>

          <Card className="p-4 space-y-1.5 text-center">
            <span className="text-[11px] uppercase font-semibold text-gray-400">Technical Depth</span>
            <div className="text-3xl font-black text-blue-400">{avgTech}%</div>
            <p className="text-[10px] text-gray-500">Core Systems & Concepts</p>
          </Card>

          <Card className="p-4 space-y-1.5 text-center">
            <span className="text-[11px] uppercase font-semibold text-gray-400">Problem Solving</span>
            <div className="text-3xl font-black text-purple-400">{problemSolvingScore}%</div>
            <p className="text-[10px] text-gray-500">Algorithmic Strategy</p>
          </Card>

          <Card className="p-4 space-y-1.5 text-center">
            <span className="text-[11px] uppercase font-semibold text-gray-400">Coding Execution</span>
            <div className="text-3xl font-black text-amber-400">{avgCoding}%</div>
            <p className="text-[10px] text-gray-500">Monaco Sandbox Tests</p>
          </Card>

          <Card className="p-4 space-y-1.5 text-center col-span-2 md:col-span-1">
            <span className="text-[11px] uppercase font-semibold text-gray-400">Communication</span>
            <div className="text-3xl font-black text-rose-400">{avgClarity}%</div>
            <p className="text-[10px] text-gray-500">Clarity & Terminology</p>
          </Card>
        </div>

        {/* Analytics Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skill Analysis Radar Card */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Brain className="w-4 h-4 text-brand-500" />
                  Engineering Skill Radar (8 Domains)
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  DSA, OOP, DBMS, OS, Networks, System Design, Programming, Web Dev
                </p>
              </div>
            </div>
            <ScoreRadarChart data={performance?.radarData || []} />
          </Card>

          {/* Progress Timeline Chart */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Progress & Score Growth
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Demonstrated score improvement across previous technical sessions
                </p>
              </div>
            </div>
            <PerformanceTrendChart data={performance?.trend || []} />
          </Card>
        </div>

        {/* Breakdown by Difficulty & Focus Areas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Difficulty Volume Distribution */}
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-500" />
              Difficulty Distribution
            </h3>
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs mb-1 font-semibold">
                  <span className="text-emerald-400">Easy Rounds</span>
                  <span className="text-gray-400">
                    {performance?.difficultyDistribution?.Easy || 0} completed
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{
                      width: `${
                        ((performance?.difficultyDistribution?.Easy || 0) /
                          Math.max(1, stats?.completedInterviews || 1)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-semibold">
                  <span className="text-amber-400">Medium Rounds</span>
                  <span className="text-gray-400">
                    {performance?.difficultyDistribution?.Medium || 0} completed
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full"
                    style={{
                      width: `${
                        ((performance?.difficultyDistribution?.Medium || 0) /
                          Math.max(1, stats?.completedInterviews || 1)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-semibold">
                  <span className="text-rose-400">Hard Rounds</span>
                  <span className="text-gray-400">
                    {performance?.difficultyDistribution?.Hard || 0} completed
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-rose-500 h-2 rounded-full"
                    style={{
                      width: `${
                        ((performance?.difficultyDistribution?.Hard || 0) /
                          Math.max(1, stats?.completedInterviews || 1)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* AI Growth Recommendations */}
          <Card className="md:col-span-2 p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
              <Compass className="w-4 h-4" />
              Strategic SDE Preparation Recommendations
            </h3>
            <p className="text-xs text-gray-400">
              Synthesized actionable recommendations from all Gemini rubric evaluations:
            </p>

            <div className="space-y-2.5 pt-1">
              {recommendations?.actionItems?.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs text-gray-700 dark:text-gray-300 flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};
