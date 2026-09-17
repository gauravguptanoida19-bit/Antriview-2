import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Sparkles, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0B0F19] text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-gray-950 font-bold shadow-lg shadow-brand-500/20 mb-6">
        <Sparkles className="w-8 h-8 text-gray-950" />
      </div>
      <h1 className="text-7xl font-black text-gray-900 dark:text-white font-mono tracking-tight mb-2">
        404
      </h1>
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
        Interview Endpoint Not Found
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mb-8">
        The route or interview session you were looking for doesn't exist or has expired.
      </p>
      <div className="flex items-center gap-3">
        <Link to="/dashboard">
          <Button variant="primary" size="md" leftIcon={<Home className="w-4 h-4" />}>
            Back to Dashboard
          </Button>
        </Link>
        <Link to="/">
          <Button variant="outline" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Landing Page
          </Button>
        </Link>
      </div>
    </div>
  );
};
