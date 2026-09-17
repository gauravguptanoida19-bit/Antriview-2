import React, { useState } from 'react';
import { IInterviewQuestion } from '../../types';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';
import { HelpCircle, Lightbulb, ChevronDown, ChevronUp, Code2, MessageSquare, ShieldAlert } from 'lucide-react';
import { getDifficultyColor } from '../../utils/formatters';

interface QuestionCardProps {
  question: IInterviewQuestion;
  currentIndex: number;
  totalQuestions: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentIndex,
  totalQuestions,
}) => {
  const [showHints, setShowHints] = useState(false);

  const getQuestionTypeIcon = () => {
    switch (question.questionType) {
      case 'coding':
        return <Code2 className="w-4 h-4 text-emerald-400" />;
      case 'system-design':
        return <ShieldAlert className="w-4 h-4 text-purple-400" />;
      case 'conceptual':
      default:
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <Card className="p-6 mb-6">
      {/* Top Metadata Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-gray-800/80 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-500 bg-brand-500/10 px-2.5 py-1 rounded-md">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800 px-2.5 py-1 rounded-md">
            {getQuestionTypeIcon()}
            <span className="capitalize">{question.questionType}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">{question.category}</span>
          <Badge
            variant="neutral"
            size="sm"
            className={`capitalize font-semibold border ${getDifficultyColor(question.difficulty)}`}
          >
            {question.difficulty}
          </Badge>
        </div>
      </div>

      {/* Title & Body */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-snug">
          {question.title}
        </h2>
        <div className="text-gray-700 dark:text-gray-300 text-sm sm:text-base whitespace-pre-line leading-relaxed">
          {question.question}
        </div>
      </div>

      {/* Hints Dropdown */}
      {question.hints && question.hints.length > 0 && (
        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800/80">
          <button
            onClick={() => setShowHints(!showHints)}
            className="flex items-center gap-2 text-xs font-medium text-amber-500 dark:text-amber-400 hover:text-amber-300 transition-colors"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>{showHints ? 'Hide Interviewer Hints' : 'Need a hint? (Click to view)'}</span>
            {showHints ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showHints && (
            <div className="mt-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-300/90 space-y-1.5 animate-in fade-in duration-150">
              <div className="font-semibold flex items-center gap-1.5 mb-1">
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                Interviewer Clues & Directions:
              </div>
              <ul className="list-disc pl-5 space-y-1">
                {question.hints.map((hint, idx) => (
                  <li key={idx}>{hint}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
