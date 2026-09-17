import React, { useState } from 'react';
import { ITestCase, ICodeExecutionResult, IQuestionEvaluation } from '../../types';
import { Button } from '../common/Button';
import { Play, CheckCircle2, XCircle, Clock, Sparkles, Send } from 'lucide-react';

interface TestCasesPanelProps {
  testCases: ITestCase[];
  executionResult?: ICodeExecutionResult;
  evaluation?: IQuestionEvaluation;
  onRunTests: () => void;
  onSubmitCode: () => void;
  isRunning: boolean;
  isSubmitting: boolean;
}

export const TestCasesPanel: React.FC<TestCasesPanelProps> = ({
  testCases = [],
  executionResult,
  evaluation,
  onRunTests,
  onSubmitCode,
  isRunning,
  isSubmitting,
}) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const activeTestCase = testCases[activeTab] || testCases[0];
  const activeDetail = executionResult?.details?.[activeTab];

  return (
    <div className="flex flex-col rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] overflow-hidden mt-4 shadow-sm">
      {/* Test Case Tab Bar & Action Controls */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {testCases.map((tc, idx) => {
            const detail = executionResult?.details?.[idx];
            return (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === idx
                    ? 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <span>Case {idx + 1}</span>
                {detail && (
                  detail.passed ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <XCircle className="w-3 h-3 text-rose-500" />
                  )
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRunTests}
            isLoading={isRunning}
            leftIcon={<Play className="w-3 h-3 text-emerald-400" />}
          >
            Run Test Cases
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onSubmitCode}
            isLoading={isSubmitting}
            leftIcon={<Send className="w-3 h-3" />}
          >
            Submit Solution
          </Button>
        </div>
      </div>

      {/* Test Runner Body */}
      <div className="p-4 space-y-4">
        {/* Results Banner if tests have been run */}
        {executionResult && (
          <div
            className={`flex items-center justify-between p-3 rounded-xl border text-xs sm:text-sm font-medium ${
              executionResult.passed
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}
          >
            <div className="flex items-center gap-2">
              {executionResult.passed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-400" />
              )}
              <span>
                {executionResult.passed
                  ? 'All Test Cases Passed!'
                  : `${executionResult.passedTests} / ${executionResult.totalTests} Test Cases Passed`}
              </span>
            </div>
            <div className="flex items-center gap-1 font-mono text-xs opacity-80">
              <Clock className="w-3.5 h-3.5" />
              <span>{executionResult.executionTimeMs} ms</span>
            </div>
          </div>
        )}

        {/* Selected Test Case Inputs & Outputs */}
        {activeTestCase ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {/* Input Vector */}
            <div className="space-y-1">
              <span className="text-gray-500 dark:text-gray-400 uppercase tracking-wider font-sans text-[11px] font-semibold">
                Input Parameters
              </span>
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 break-all">
                {activeTestCase.input}
              </div>
            </div>

            {/* Expected Output */}
            <div className="space-y-1">
              <span className="text-gray-500 dark:text-gray-400 uppercase tracking-wider font-sans text-[11px] font-semibold">
                Expected Output
              </span>
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-emerald-600 dark:text-emerald-400 break-all">
                {activeTestCase.expectedOutput}
              </div>
            </div>

            {/* Actual Output if evaluated */}
            {activeDetail && (
              <div className="md:col-span-2 space-y-1">
                <span className="text-gray-500 dark:text-gray-400 uppercase tracking-wider font-sans text-[11px] font-semibold">
                  Actual Output from Code Execution
                </span>
                <div
                  className={`p-3 rounded-lg border font-mono ${
                    activeDetail.passed
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500 dark:text-emerald-400'
                      : 'bg-rose-500/5 border-rose-500/20 text-rose-500 dark:text-rose-400'
                  }`}
                >
                  {activeDetail.actual}
                  {activeDetail.error && (
                    <div className="mt-1 text-xs text-rose-400 font-sans">{activeDetail.error}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-gray-400">No test cases configured for this challenge.</p>
        )}

        {/* AI Evaluation Card if evaluated */}
        {evaluation && (
          <div className="mt-4 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-900 dark:text-purple-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-semibold flex items-center gap-1.5 text-purple-400">
                <Sparkles className="w-4 h-4" />
                Gemini AI Code Assessment
              </div>
              <div className="flex items-center gap-3">
                {evaluation.timeComplexity && (
                  <span className="bg-purple-500/20 px-2 py-0.5 rounded font-mono">
                    Time: {evaluation.timeComplexity}
                  </span>
                )}
                {evaluation.spaceComplexity && (
                  <span className="bg-purple-500/20 px-2 py-0.5 rounded font-mono">
                    Space: {evaluation.spaceComplexity}
                  </span>
                )}
                <span className="font-bold text-sm text-purple-300">
                  Score: {evaluation.score}/10
                </span>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed font-sans">{evaluation.feedback}</p>
          </div>
        )}
      </div>
    </div>
  );
};
