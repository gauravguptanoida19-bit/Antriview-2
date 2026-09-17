import React from 'react';
import { Bot, Mic, Sparkles, Volume2 } from 'lucide-react';

export type AIInterviewerStatus = 'idle' | 'speaking' | 'listening' | 'thinking' | 'evaluating';

interface AiAvatarProps {
  status: AIInterviewerStatus;
  statusMessage?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AiAvatar: React.FC<AiAvatarProps> = ({
  status = 'idle',
  statusMessage,
  size = 'md',
  className = '',
}) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'speaking':
        return {
          text: 'Speaking...',
          color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-400 animate-ping',
          icon: <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />,
        };
      case 'listening':
        return {
          text: 'Listening to candidate...',
          color: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
          dot: 'bg-blue-400 animate-ping',
          icon: <Mic className="w-3.5 h-3.5 text-blue-400 animate-pulse" />,
        };
      case 'thinking':
      case 'evaluating':
        return {
          text: 'Analyzing response with Gemini...',
          color: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
          dot: 'bg-purple-400 animate-ping',
          icon: <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" />,
        };
      case 'idle':
      default:
        return {
          text: 'AI Interviewer Ready',
          color: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
          dot: 'bg-emerald-400',
          icon: <Bot className="w-3.5 h-3.5 text-gray-400" />,
        };
    }
  };

  const badge = getStatusBadge();

  const avatarSizes = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Orb Avatar Container */}
      <div className="relative flex items-center justify-center">
        {/* Animated Glow Rings */}
        <div
          className={`absolute rounded-full transition-all duration-700 ${
            status === 'speaking'
              ? 'w-28 h-28 bg-emerald-500/20 blur-xl animate-pulse'
              : status === 'listening'
              ? 'w-28 h-28 bg-blue-500/25 blur-xl animate-pulse'
              : status === 'thinking' || status === 'evaluating'
              ? 'w-28 h-28 bg-purple-500/30 blur-xl animate-pulse-slow'
              : 'w-24 h-24 bg-brand-500/10 blur-lg'
          }`}
        />

        {/* Primary AI Avatar Sphere */}
        <div
          className={`relative rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 border border-gray-700/80 shadow-2xl flex items-center justify-center overflow-hidden transition-transform duration-300 ${
            avatarSizes[size]
          } ${status === 'speaking' ? 'scale-105' : ''}`}
        >
          {/* Subtle Grid / Circuit Background */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:8px_8px]" />

          {/* Dynamic Waves / Audio Visualizer Bars inside Avatar */}
          {status === 'speaking' ? (
            <div className="flex items-center gap-1 z-10">
              <span className="w-1.5 h-5 bg-emerald-400 rounded-full animate-[wave_0.8s_ease-in-out_infinite]" />
              <span className="w-1.5 h-8 bg-emerald-300 rounded-full animate-[wave_0.6s_ease-in-out_infinite_0.1s]" />
              <span className="w-1.5 h-10 bg-emerald-400 rounded-full animate-[wave_0.7s_ease-in-out_infinite_0.2s]" />
              <span className="w-1.5 h-6 bg-emerald-300 rounded-full animate-[wave_0.5s_ease-in-out_infinite_0.3s]" />
            </div>
          ) : status === 'listening' ? (
            <div className="flex items-center gap-1 z-10">
              <span className="w-1.5 h-4 bg-blue-400 rounded-full animate-bounce" />
              <span className="w-1.5 h-6 bg-blue-300 rounded-full animate-bounce [animation-delay:0.15s]" />
              <span className="w-1.5 h-4 bg-blue-400 rounded-full animate-bounce [animation-delay:0.3s]" />
            </div>
          ) : status === 'thinking' || status === 'evaluating' ? (
            <div className="relative z-10 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-purple-400 animate-spin [animation-duration:3s]" />
            </div>
          ) : (
            <div className="relative z-10 flex flex-col items-center justify-center text-brand-400">
              <Bot className="w-9 h-9 text-brand-400" />
            </div>
          )}

          {/* Active Status Pip in Corner */}
          <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
            <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${badge.dot}`} />
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${badge.dot}`} />
          </span>
        </div>
      </div>

      {/* Status Pill */}
      <div className="mt-3 flex flex-col items-center">
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${badge.color}`}
        >
          {badge.icon}
          <span>{statusMessage || badge.text}</span>
        </div>
      </div>
    </div>
  );
};
