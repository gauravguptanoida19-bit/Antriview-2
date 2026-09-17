import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewApi } from '../services/api';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import {
  Sparkles,
  ArrowRight,
  Code2,
  Mic,
  MessageSquare,
  Layers,
  Clock,
  HelpCircle,
  Zap,
} from 'lucide-react';

export const InterviewSetupPage: React.FC = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState('Full Stack Developer');
  const [technology, setTechnology] = useState('React & Node.js');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [interviewType, setInterviewType] = useState<'technical' | 'coding' | 'voice' | 'combined'>('combined');
  const [questionCount, setQuestionCount] = useState<number>(3);
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const roles = [
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Engineer',
    'Machine Learning Engineer',
  ];

  const technologies = [
    'React & Node.js',
    'Data Structures & Algorithms',
    'JavaScript / TypeScript',
    'Python',
    'C++',
    'Java',
    'SQL & Relational Databases',
    'MongoDB & NoSQL',
    'System Design & Microservices',
  ];

  const modes = [
    {
      id: 'combined',
      title: 'Full Combined Interview',
      desc: 'Balanced mix of conceptual system questions, Monaco coding sandbox, and voice questions.',
      icon: <Layers className="w-5 h-5 text-brand-500" />,
    },
    {
      id: 'coding',
      title: 'Coding Sandbox Mode',
      desc: 'Algorithmic problem solving with Monaco Editor, custom test cases, and time/space complexity analysis.',
      icon: <Code2 className="w-5 h-5 text-emerald-400" />,
    },
    {
      id: 'technical',
      title: 'Technical & Conceptual',
      desc: 'In-depth engineering architecture, runtime internals, best practices, and trade-off questioning.',
      icon: <MessageSquare className="w-5 h-5 text-blue-400" />,
    },
    {
      id: 'voice',
      title: 'Voice Interview Simulation',
      desc: 'Web Speech API powered verbal questioning with AI voice question reading and microphone transcription.',
      icon: <Mic className="w-5 h-5 text-purple-400" />,
    },
  ];

  const handleStartInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await interviewApi.create({
        role,
        technology,
        difficulty,
        interviewType,
        questionCount,
        durationMinutes,
      });

      if (res.success && res.interview) {
        navigate(`/interview/${res.interview._id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create interview. Please check inputs.');
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-500 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Interview Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            Configure Your Technical Interview
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Customize role domain, difficulty, and interview modes. Gemini 3.8 Flash dynamically
            synthesizes unique questions tailored to your selection.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs sm:text-sm text-rose-500">
            {error}
          </div>
        )}

        <form onSubmit={handleStartInterview} className="space-y-6">
          {/* Step 1: Role & Technology */}
          <Card className="p-6 space-y-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-500 flex items-center justify-center text-xs">
                1
              </span>
              Target Role & Core Domain
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Target Engineering Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-gray-900 dark:text-gray-100"
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Primary Technology / Focus Area
                </label>
                <select
                  value={technology}
                  onChange={(e) => setTechnology(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-gray-900 dark:text-gray-100"
                >
                  {technologies.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Step 2: Interview Mode Selection */}
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-500 flex items-center justify-center text-xs">
                2
              </span>
              Select Interview Mode
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {modes.map((mode) => {
                const isSelected = interviewType === mode.id;
                return (
                  <div
                    key={mode.id}
                    onClick={() => setInterviewType(mode.id as any)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer select-none space-y-2 ${
                      isSelected
                        ? 'bg-brand-500/10 border-brand-500/50 ring-1 ring-brand-500/50'
                        : 'bg-gray-50/50 dark:bg-gray-900/60 border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                          {mode.icon}
                        </div>
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                          {mode.title}
                        </h4>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-brand-500 bg-brand-500' : 'border-gray-500'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-gray-950" />}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed pl-1">
                      {mode.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Step 3: Difficulty & Parameters */}
          <Card className="p-6 space-y-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-500 flex items-center justify-center text-xs">
                3
              </span>
              Difficulty & Pacing
            </h3>

            {/* Difficulty Selector */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Evaluation Rigor & Difficulty
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['Easy', 'Medium', 'Hard'] as const).map((lvl) => {
                  const isSelected = difficulty === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setDifficulty(lvl)}
                      className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                        isSelected
                          ? lvl === 'Easy'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500'
                            : lvl === 'Medium'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500'
                            : 'bg-rose-500/20 text-rose-400 border-rose-500'
                          : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-500 hover:text-gray-200'
                      }`}
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question count and duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Number of Technical Questions
                </label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-gray-900 dark:text-gray-100"
                >
                  <option value={3}>3 Questions (Quick Drill — ~15 mins)</option>
                  <option value={5}>5 Questions (Standard Technical — ~30 mins)</option>
                  <option value={8}>8 Questions (Full Mock Assessment — ~45 mins)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Total Allocated Session Time
                </label>
                <select
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-gray-900 dark:text-gray-100"
                >
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes</option>
                  <option value={45}>45 Minutes</option>
                  <option value={60}>60 Minutes</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Submission CTA */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="w-full shadow-lg shadow-brand-500/20 py-3.5 text-base"
            >
              {loading ? 'Synthesizing Questions with Gemini 3.8...' : 'Generate Questions & Launch Interview'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};
