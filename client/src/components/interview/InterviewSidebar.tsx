import React from 'react';
import { IInterview } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { AiAvatar, AIInterviewerStatus } from './AiAvatar';
import {
  Clock,
  Play,
  Pause,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
} from 'lucide-react';

interface InterviewSidebarProps {
  interview: IInterview;
  currentIndex: number;
  aiStatus: AIInterviewerStatus;
  aiMessage?: string;
  formattedTime: string;
  isPaused: boolean;
  isCritical: boolean;
  onTogglePause: () => void;
  onSelectQuestion: (index: number) => void;
  onPrevQuestion: () => void;
  onNextQuestion: () => void;
  onOpenEndModal: () => void;
}

export const InterviewSidebar: React.FC<InterviewSidebarProps> = ({
  interview,
  currentIndex,
  aiStatus,
  aiMessage,
  formattedTime,
  isPaused,
  isCritical,
  onTogglePause,
  onSelectQuestion,
  onPrevQuestion,
  onNextQuestion,
  onOpenEndModal,
}) => {
  const answeredCount = interview.questions.filter((q) => Boolean(q.evaluation || q.candidateAnswer || q.codeAnswer)).length;
  const totalQuestions = interview.questions.length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  // Compute live current estimated average score if questions evaluated
  const evaluatedQuestions = interview.questions.filter((q) => q.evaluation?.score);
  const currentLiveScore = evaluatedQuestions.length
    ? Math.round(
        (evaluatedQuestions.reduce((acc, q) => acc + (q.evaluation?.score || 0), 0) /
          evaluatedQuestions.length) *
          10
      )
    : 0;

  return (
    <aside className="w-full lg:w-80 flex flex-col gap-5">
      {/* Timer & Session Status Card */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            <Clock className="w-4 h-4 text-brand-500" />
            <span>Time Remaining</span>
          </div>
          <button
            onClick={onTogglePause}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-200 px-2 py-0.5 rounded border border-gray-700 hover:border-gray-500 transition-colors"
          >
            {isPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3 text-amber-400" />}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>
        </div>

        <div className="flex items-baseline justify-between mb-3">
          <div
            className={`font-mono text-3xl font-bold tracking-tight ${
              isCritical ? 'text-rose-500 animate-pulse' : 'text-gray-900 dark:text-white'
            }`}
          >
            {formattedTime}
          </div>
          {isPaused && (
            <span className="text-xs font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Session Paused
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Progress ({answeredCount}/{totalQuestions})</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-brand-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </Card>

      {/* AI Interviewer Status Panel */}
      <Card className="p-5 flex flex-col items-center text-center">
        <div className="w-full flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            AI Interviewer
          </span>
          <span className="text-xs text-gray-500">Gemini 3.8</span>
        </div>

        <AiAvatar status={aiStatus} statusMessage={aiMessage} size="md" />

        {currentLiveScore > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 w-full flex items-center justify-between text-xs">
            <span className="text-gray-400">Live AI Benchmark</span>
            <span className="font-bold text-emerald-400 text-sm">{currentLiveScore}%</span>
          </div>
        )}
      </Card>

      {/* Question Navigation List */}
      <Card className="p-5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
          Question Navigator
        </h4>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {interview.questions.map((q, idx) => {
            const isCurrent = idx === currentIndex;
            const isAnswered = Boolean(q.evaluation || q.candidateAnswer || q.codeAnswer);

            return (
              <button
                key={q.questionId || idx}
                onClick={() => onSelectQuestion(idx)}
                className={`relative flex items-center justify-center h-10 rounded-lg text-xs font-bold transition-all ${
                  isCurrent
                    ? 'ring-2 ring-brand-500 bg-brand-500 text-gray-950 shadow-md shadow-brand-500/20 scale-105'
                    : isAnswered
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                title={`Question ${idx + 1}: ${q.title}`}
              >
                <span>{idx + 1}</span>
                {isAnswered && !isCurrent && (
                  <CheckCircle2 className="w-2.5 h-2.5 absolute top-1 right-1 text-emerald-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Step Prev / Next Controls */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
          <Button
            variant="secondary"
            size="sm"
            onClick={onPrevQuestion}
            disabled={currentIndex === 0}
            leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
          >
            Prev
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onNextQuestion}
            disabled={currentIndex === totalQuestions - 1}
            rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
          >
            Next
          </Button>
        </div>
      </Card>

      {/* End Interview Trigger */}
      <Button
        variant="danger"
        size="md"
        onClick={onOpenEndModal}
        leftIcon={<LogOut className="w-4 h-4" />}
        className="w-full"
      >
        Complete & Submit Interview
      </Button>
    </aside>
  );
};
