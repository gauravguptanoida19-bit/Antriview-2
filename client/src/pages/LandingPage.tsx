import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import {
  Sparkles,
  ArrowRight,
  Code2,
  Mic,
  BarChart3,
  Bot,
  CheckCircle2,
  Cpu,
  Layers,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { isAuthenticated, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleDemoClick = async () => {
    await demoLogin();
    navigate('/dashboard');
  };

  const features = [
    {
      icon: <Sparkles className="w-6 h-6 text-brand-500" />,
      title: 'Gemini 3.8 Flash AI Engine',
      description:
        'Dynamic question generation tailored to exact tech stacks and difficulty levels, with instant deep rubric evaluations.',
    },
    {
      icon: <Code2 className="w-6 h-6 text-emerald-400" />,
      title: 'Monaco Sandbox & Test Runner',
      description:
        'Full-featured VS Code-style Monaco Editor supporting JavaScript, Python, and C++ with deterministic test cases and Big-O analysis.',
    },
    {
      icon: <Mic className="w-6 h-6 text-blue-400" />,
      title: 'Browser Voice Interaction',
      description:
        'Practice verbal communication with real-time Speech-to-Text and AI question narration using the Web Speech API.',
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-purple-400" />,
      title: 'Deep Performance Analytics',
      description:
        'Granular score tracking across algorithms, system design, clarity, and personalized study roadmaps.',
    },
  ];

  const techStackBadges = [
    'React 18',
    'TypeScript',
    'Vite',
    'Tailwind CSS',
    'Monaco Editor',
    'Web Speech API',
    'Node.js',
    'Express.js',
    'MongoDB & Mongoose',
    'Google Gemini API',
    'JWT Authentication',
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0F19] text-gray-900 dark:text-gray-100 selection:bg-brand-500 selection:text-white flex flex-col">
      {/* Header / Nav */}
      <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-gray-950 font-bold shadow-md shadow-brand-500/20">
              <Sparkles className="w-4 h-4 text-gray-950" />
            </div>
            <span className="text-xl font-bold tracking-tight">Antiview</span>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={handleDemoClick}>
                  Explore Demo
                </Button>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24 border-b border-gray-200 dark:border-gray-800/60">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-500/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-semibold text-brand-600 dark:text-brand-400 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Commercial-Grade Technical Interview Simulator</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.1]">
            Practice Interviews.{' '}
            <span className="bg-gradient-to-r from-brand-500 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Build Confidence.
            </span>{' '}
            Get Hired.
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Antiview simulates real technical interviews using AI-generated questions, coding
            challenges, voice interaction, and personalized performance analysis.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link to={isAuthenticated ? '/interview/setup' : '/register'}>
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto shadow-lg shadow-brand-500/20"
              >
                Start Free Interview
              </Button>
            </Link>
            <Button
              variant="secondary"
              size="lg"
              onClick={handleDemoClick}
              leftIcon={<Zap className="w-4 h-4 text-brand-400" />}
              className="w-full sm:w-auto"
            >
              Explore Demo Candidate
            </Button>
          </div>

          {/* Feature Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-xs font-medium text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Dynamic Gemini 3.8 Prompts
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Monaco Coding Sandbox
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Voice STT / TTS Support
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Zero-Config Embedded Database
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Mock Platform Preview Card */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] shadow-2xl p-4 sm:p-6 overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-gray-400 ml-2">antiview://session/live</span>
            </div>
            <Badge variant="brand" size="sm">
              Live Mock Session
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Main preview */}
            <div className="lg:col-span-2 space-y-4">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span className="font-semibold text-brand-500 uppercase tracking-wider">
                    Question 1 of 5 • Data Structures
                  </span>
                  <span className="text-amber-400 font-semibold">Medium</span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-gray-100">
                  Implement an LRU Cache with O(1) Operations
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                  Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.
                  Implement the get and put operations with an average time complexity of O(1).
                </p>
              </div>

              {/* Mock Monaco Editor snippet */}
              <div className="p-4 rounded-xl bg-gray-950 border border-gray-800 font-mono text-xs text-gray-300 leading-relaxed shadow-inner">
                <div className="flex justify-between text-gray-500 text-[11px] pb-2 border-b border-gray-800/80 mb-2">
                  <span>solution.js (Monaco Editor)</span>
                  <span className="text-emerald-400">All 3 Tests Passing (12ms)</span>
                </div>
                <div className="text-emerald-400 font-semibold">class LRUCache &#123;</div>
                <div className="pl-4 text-gray-300">constructor(capacity) &#123; this.capacity = capacity; this.map = new Map(); &#125;</div>
                <div className="pl-4 text-purple-400">get(key) &#123; ... &#125;</div>
                <div className="pl-4 text-purple-400">put(key, value) &#123; ... &#125;</div>
                <div className="text-emerald-400 font-semibold">&#125;</div>
              </div>
            </div>

            {/* Right Sidebar preview */}
            <div className="space-y-4 flex flex-col justify-between">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-gray-800 flex items-center justify-center mb-3 shadow-inner">
                  <Bot className="w-8 h-8 text-brand-400" />
                </div>
                <h4 className="font-semibold text-sm text-gray-900 dark:text-white">AI Interviewer</h4>
                <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Analyzing complexity & structure...
                </p>
              </div>

              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 space-y-1">
                <div className="font-semibold text-purple-400">Gemini Instant Feedback</div>
                <p className="text-gray-300 text-[11px]">
                  "Optimal single-pass approach using Map key insertion ordering. Big-O: O(1) Time, O(N) Space."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars Section */}
      <section className="py-16 bg-white dark:bg-[#0B0F19]/90 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-brand-500">
              Complete Preparation Suite
            </h2>
            <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Every Dimension of Modern Tech Interviews
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Antiview combines dynamic AI reasoning with code compilation and speech recognition to
              simulate the exact pressure of top tech hiring loops.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, idx) => (
              <Card key={idx} variant="elevated" className="p-6 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800/80 flex items-center justify-center shadow-sm">
                  {feat.icon}
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">{feat.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feat.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-16 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0E131F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">How Antiview Works</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              From configuration to in-depth evaluation in three streamlined steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-brand-500/10 text-brand-500 font-bold flex items-center justify-center">
                1
              </div>
              <h4 className="font-bold text-base text-gray-900 dark:text-white">Configure Target Role</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Choose from Frontend, Backend, Full Stack, ML, or Data Engineering, specify your tech stack
                and select difficulty from Easy to Hard.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center">
                2
              </div>
              <h4 className="font-bold text-base text-gray-900 dark:text-white">Conduct Live Simulation</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Experience real-time interactive questioning. Type conceptual answers, write code in
                Monaco Editor against test vectors, or speak into your microphone.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 font-bold flex items-center justify-center">
                3
              </div>
              <h4 className="font-bold text-base text-gray-900 dark:text-white">Review Detailed AI Scorecard</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Get an instant rubric evaluation breaking down correctness, technical depth, communication
                clarity, strengths, and a tailored study roadmap.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Banner */}
      <section className="py-12 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0B0F19]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Engineered with Modern Production Technologies
          </h4>
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
            {techStackBadges.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700/60"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 border-t border-gray-200 dark:border-gray-800 bg-gradient-to-b from-transparent to-brand-500/5">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-5">
          <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
            Ready to ace your upcoming technical interview?
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Get instant practice with realistic AI questioning, coding sandbox, and score benchmarking
            tailored for SDE final rounds.
          </p>
          <div className="pt-2">
            <Link to={isAuthenticated ? '/interview/setup' : '/register'}>
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Launch Your First Interview
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Simple landing footer */}
      <footer className="mt-auto border-t border-gray-200 dark:border-gray-800/80 py-8 px-4 text-center text-xs text-gray-500">
        Antiview — AI-Powered Technical Interview Platform • MIT Licensed • Final Year B.Tech & Portfolio Project
      </footer>
    </div>
  );
};
