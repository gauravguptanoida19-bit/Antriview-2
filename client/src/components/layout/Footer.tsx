import React from 'react';
import { Sparkles, Heart, Terminal, Cpu, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-[#0B0F19]/60 backdrop-blur-md mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-gray-950 font-bold">
                <Sparkles className="w-4 h-4 text-gray-950" />
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">Antiview</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
              Your AI-powered technical interview simulator. Master algorithmic coding, system
              design, and conceptual Q&A with real-time Gemini evaluation.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-brand-500" /> Powered by Gemini 3.8 Flash
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5 text-brand-500" /> Monaco Sandbox
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-200 mb-3">
              Platform
            </h5>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link to="/dashboard" className="hover:text-brand-500 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/interview/setup" className="hover:text-brand-500 transition-colors">
                  New Interview
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-brand-500 transition-colors">
                  Interview History
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-brand-500 transition-colors">
                  Performance Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology & Compliance */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-200 mb-3">
              Architecture
            </h5>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Zero-Config MongoDB
              </li>
              <li>Web Speech API (STT/TTS)</li>
              <li>Sandboxed Test Runner</li>
              <li>JWT & Role-Based Auth</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 dark:text-gray-400 gap-3">
          <p>© {new Date().getFullYear()} Antiview — Production Technical Interview Platform. MIT Licensed.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for final-year project & developer portfolios
          </p>
        </div>
      </div>
    </footer>
  );
};
