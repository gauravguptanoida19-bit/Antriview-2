import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { interviewApi } from '../services/api';
import { IInterview, IInterviewQuestion } from '../types';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { QuestionCard } from '../components/interview/QuestionCard';
import { InterviewSidebar } from '../components/interview/InterviewSidebar';
import { EndInterviewModal } from '../components/interview/EndInterviewModal';
import { CodeEditor } from '../components/coding/CodeEditor';
import { TestCasesPanel } from '../components/coding/TestCasesPanel';
import { VoiceController } from '../components/voice/VoiceController';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { AIInterviewerStatus } from '../components/interview/AiAvatar';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { useCountdownTimer } from '../hooks/useCountdownTimer';
import { Send, CheckCircle2, MessageSquare, Code2, Mic, Sparkles } from 'lucide-react';

export const InterviewSessionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [interview, setInterview] = useState<IInterview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Mode specific inputs for current question
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [codeAnswer, setCodeAnswer] = useState<string>('');
  const [codeLanguage, setCodeLanguage] = useState<string>('javascript');
  const [activeTabMode, setActiveTabMode] = useState<'text' | 'coding' | 'voice'>('text');

  // AI Interviewer state
  const [aiStatus, setAiStatus] = useState<AIInterviewerStatus>('idle');
  const [aiMessage, setAiMessage] = useState<string>('AI Interviewer Ready');

  // Action loaders
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState<boolean>(false);
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  const [isEndingInterview, setIsEndingInterview] = useState<boolean>(false);
  const [showEndModal, setShowEndModal] = useState<boolean>(false);

  // Speech Hooks
  const {
    isListening,
    transcript,
    isSupported: isSTTSupported,
    error: sttError,
    startListening,
    stopListening,
    resetTranscript,
    setTranscript,
  } = useSpeechRecognition();

  const {
    isSpeaking,
    isSupported: isTTSSupported,
    speak,
    cancel: cancelSpeech,
  } = useSpeechSynthesis();

  // Timer Hook
  const timer = useCountdownTimer({
    initialMinutes: interview?.durationMinutes || 30,
    autoStart: false,
    onExpire: () => {
      handleCompleteInterview();
    },
  });

  // Load Interview data
  useEffect(() => {
    const fetchInterview = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await interviewApi.getById(id);
        if (res.success && res.interview) {
          setInterview(res.interview);
          const initialIdx = res.interview.currentQuestionIndex || 0;
          setCurrentIndex(initialIdx);

          // If session is completed, redirect to results
          if (res.interview.status === 'completed') {
            navigate(`/interview/${res.interview._id}/results`, { replace: true });
            return;
          }

          // If pending, start it
          if (res.interview.status === 'pending') {
            await interviewApi.start(id);
          }
          timer.resume();
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load interview session.');
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [id, navigate]);

  // Sync inputs whenever currentIndex changes or interview loads
  useEffect(() => {
    if (!interview || !interview.questions[currentIndex]) return;
    const q = interview.questions[currentIndex];

    // Set initial text/voice
    setTextAnswer(q.candidateAnswer || '');
    setTranscript(q.candidateAnswer || '');

    // Set code answer & starter code
    const lang = q.language || 'javascript';
    setCodeLanguage(lang);
    if (q.codeAnswer) {
      setCodeAnswer(q.codeAnswer);
    } else if (q.starterCode) {
      setCodeAnswer(
        lang === 'python'
          ? q.starterCode.python || ''
          : lang === 'cpp'
          ? q.starterCode.cpp || ''
          : q.starterCode.javascript || ''
      );
    } else {
      setCodeAnswer('// Write your solution here\nfunction solution() {\n  \n}\n');
    }

    // Default view mode based on questionType or interviewType
    if (q.questionType === 'coding') {
      setActiveTabMode('coding');
    } else if (interview.interviewType === 'voice') {
      setActiveTabMode('voice');
    } else {
      setActiveTabMode('text');
    }

    // Reset voice synthesis
    cancelSpeech();
    setAiStatus('idle');
    setAiMessage('AI Interviewer Ready');
  }, [currentIndex, interview, cancelSpeech, setTranscript]);

  // Sync AI avatar status with speech hooks
  useEffect(() => {
    if (isSpeaking) {
      setAiStatus('speaking');
      setAiMessage('Interviewer asking question...');
    } else if (isListening) {
      setAiStatus('listening');
      setAiMessage('Listening to your spoken answer...');
    } else if (isSubmittingAnswer || isRunningTests) {
      setAiStatus('evaluating');
      setAiMessage('Evaluating with Gemini 3.8 Flash...');
    } else {
      setAiStatus('idle');
      setAiMessage('AI Interviewer Ready');
    }
  }, [isSpeaking, isListening, isSubmittingAnswer, isRunningTests]);

  // Autosave progress periodically
  const lastSaveTimeRef = useRef<number>(Date.now());
  useEffect(() => {
    const interval = setInterval(() => {
      if (interview && id && !timer.isPaused) {
        const timeSpent = timer.elapsedSeconds;
        interviewApi.update(id, {
          currentQuestionIndex: currentIndex,
          timeSpentSeconds: timeSpent,
        }).catch(() => {});
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [interview, id, currentIndex, timer.elapsedSeconds, timer.isPaused]);

  // Current Question
  const currentQuestion: IInterviewQuestion | undefined = interview?.questions[currentIndex];

  // Submit Textual or Verbal Answer
  const handleSubmitAnswer = async (submittedText?: string) => {
    if (!id || !currentQuestion) return;
    const answerToSubmit = submittedText !== undefined ? submittedText : textAnswer;

    try {
      setIsSubmittingAnswer(true);
      setAiStatus('evaluating');
      setAiMessage('Analyzing answer depth & correctness...');

      const res = await interviewApi.submitAnswer(id, currentIndex, answerToSubmit);
      if (res.success && res.question) {
        // Update local state
        setInterview((prev) => {
          if (!prev) return prev;
          const updatedQ = [...prev.questions];
          updatedQ[currentIndex] = res.question;
          return { ...prev, questions: updatedQ };
        });
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error submitting answer');
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  // Run Code Sandbox Test Cases
  const handleRunCodeTests = async () => {
    if (!id || !currentQuestion) return;
    try {
      setIsRunningTests(true);
      setAiStatus('thinking');
      setAiMessage('Executing sandbox tests in isolated runner...');

      const res = await interviewApi.submitCode(id, currentIndex, codeAnswer, codeLanguage, true);
      if (res.success) {
        setInterview((prev) => {
          if (!prev) return prev;
          const updatedQ = [...prev.questions];
          updatedQ[currentIndex] = {
            ...updatedQ[currentIndex],
            codeAnswer,
            language: codeLanguage,
            codeExecutionResult: res.executionResult,
          };
          return { ...prev, questions: updatedQ };
        });
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error executing test cases');
    } finally {
      setIsRunningTests(false);
    }
  };

  // Submit Code for Full AI Evaluation
  const handleSubmitCode = async () => {
    if (!id || !currentQuestion) return;
    try {
      setIsSubmittingAnswer(true);
      setAiStatus('evaluating');
      setAiMessage('Gemini analyzing code complexity & edge cases...');

      const res = await interviewApi.submitCode(id, currentIndex, codeAnswer, codeLanguage, false);
      if (res.success) {
        setInterview((prev) => {
          if (!prev) return prev;
          const updatedQ = [...prev.questions];
          updatedQ[currentIndex] = {
            ...updatedQ[currentIndex],
            codeAnswer,
            language: codeLanguage,
            codeExecutionResult: res.executionResult,
            evaluation: res.evaluation,
            answeredAt: new Date().toISOString(),
          };
          return { ...prev, questions: updatedQ };
        });
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error submitting code');
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  // Reset starter code
  const handleResetStarter = () => {
    if (!currentQuestion) return;
    if (codeLanguage === 'python' && currentQuestion.starterCode?.python) {
      setCodeAnswer(currentQuestion.starterCode.python);
    } else if (codeLanguage === 'cpp' && currentQuestion.starterCode?.cpp) {
      setCodeAnswer(currentQuestion.starterCode.cpp);
    } else if (currentQuestion.starterCode?.javascript) {
      setCodeAnswer(currentQuestion.starterCode.javascript);
    } else {
      setCodeAnswer('// Write your solution here\nfunction solution() {\n  \n}\n');
    }
  };

  // Change code language
  const handleLanguageChange = (newLang: string) => {
    setCodeLanguage(newLang);
    if (!currentQuestion?.starterCode) return;
    if (newLang === 'python' && currentQuestion.starterCode.python) {
      setCodeAnswer(currentQuestion.starterCode.python);
    } else if (newLang === 'cpp' && currentQuestion.starterCode.cpp) {
      setCodeAnswer(currentQuestion.starterCode.cpp);
    } else if (newLang === 'javascript' && currentQuestion.starterCode.javascript) {
      setCodeAnswer(currentQuestion.starterCode.javascript);
    }
  };

  // Complete Interview & generate final scorecard
  const handleCompleteInterview = async () => {
    if (!id) return;
    try {
      setIsEndingInterview(true);
      cancelSpeech();
      stopListening();
      const res = await interviewApi.complete(id, timer.elapsedSeconds);
      if (res.success) {
        navigate(`/interview/${id}/results`);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to complete interview session.');
      setIsEndingInterview(false);
      setShowEndModal(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Spinner size="lg" />
          <p className="text-sm text-gray-500">Preparing live interview environment...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !interview || !currentQuestion) {
    return (
      <DashboardLayout>
        <div className="text-center py-20 space-y-4">
          <h2 className="text-xl font-bold text-rose-500">Interview Not Found or Error</h2>
          <p className="text-sm text-gray-400">{error || 'Session could not be located.'}</p>
          <Button variant="primary" onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const answeredCount = interview.questions.filter((q) => Boolean(q.evaluation || q.candidateAnswer || q.codeAnswer)).length;

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* LEFT / MAIN WORKSPACE AREA */}
        <div className="flex-1 w-full min-w-0">
          {/* Question Card */}
          <QuestionCard
            question={currentQuestion}
            currentIndex={currentIndex}
            totalQuestions={interview.questions.length}
          />

          {/* Mode Switcher Tabs for Answering */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTabMode('text')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTabMode === 'text'
                    ? 'bg-brand-500/10 text-brand-500 border border-brand-500/30'
                    : 'text-gray-500 hover:text-gray-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Text Explanation</span>
              </button>

              <button
                onClick={() => setActiveTabMode('coding')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTabMode === 'coding'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'text-gray-500 hover:text-gray-200'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Monaco Code Sandbox</span>
              </button>

              <button
                onClick={() => setActiveTabMode('voice')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTabMode === 'voice'
                    ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                    : 'text-gray-500 hover:text-gray-200'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Voice Interview (STT/TTS)</span>
              </button>
            </div>

            {currentQuestion.evaluation && (
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-md flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Evaluated: {currentQuestion.evaluation.score}/10
              </span>
            )}
          </div>

          {/* Active Mode Workspace */}
          {activeTabMode === 'coding' ? (
            <div>
              <CodeEditor
                code={codeAnswer}
                language={codeLanguage}
                onChange={setCodeAnswer}
                onLanguageChange={handleLanguageChange}
                onResetStarter={handleResetStarter}
                height="440px"
              />

              <TestCasesPanel
                testCases={currentQuestion.testCases || []}
                executionResult={currentQuestion.codeExecutionResult}
                evaluation={currentQuestion.evaluation}
                onRunTests={handleRunCodeTests}
                onSubmitCode={handleSubmitCode}
                isRunning={isRunningTests}
                isSubmitting={isSubmittingAnswer}
              />
            </div>
          ) : activeTabMode === 'voice' ? (
            <VoiceController
              questionText={currentQuestion.question}
              transcript={transcript}
              isListening={isListening}
              isSpeaking={isSpeaking}
              isSTTSupported={isSTTSupported}
              isTTSSupported={isTTSSupported}
              sttError={sttError}
              onStartListening={startListening}
              onStopListening={stopListening}
              onResetTranscript={resetTranscript}
              onTranscriptChange={(t) => {
                setTranscript(t);
                setTextAnswer(t);
              }}
              onSpeakQuestion={() => speak(currentQuestion.question)}
              onStopSpeaking={cancelSpeech}
              onSubmitAnswer={() => handleSubmitAnswer(transcript)}
              isSubmitting={isSubmittingAnswer}
            />
          ) : (
            /* Mode 1: Textual Conceptual Answer */
            <Card className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Your Engineering Solution & Explanation
                </label>
                <span className="text-xs text-gray-500">
                  {textAnswer.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              </div>

              <textarea
                rows={9}
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                placeholder="Structure your answer clearly: state assumptions, explain the algorithmic approach, discuss computational complexity, and identify boundary conditions or trade-offs..."
                className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 resize-y leading-relaxed text-gray-900 dark:text-gray-100 font-sans"
              />

              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTextAnswer('')}
                  disabled={!textAnswer}
                >
                  Clear Draft
                </Button>

                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleSubmitAnswer()}
                  isLoading={isSubmittingAnswer}
                  disabled={!textAnswer.trim()}
                  leftIcon={<Send className="w-4 h-4" />}
                >
                  Submit Answer for AI Evaluation
                </Button>
              </div>

              {/* Feedback Review Card if evaluated */}
              {currentQuestion.evaluation && (
                <div className="mt-4 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-900 dark:text-purple-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold flex items-center gap-1.5 text-purple-400">
                      <Sparkles className="w-4 h-4" />
                      Gemini Evaluation Feedback
                    </div>
                    <span className="font-bold text-sm text-purple-300">
                      Score: {currentQuestion.evaluation.score}/10
                    </span>
                  </div>
                  <p className="text-gray-300 leading-relaxed font-sans">
                    {currentQuestion.evaluation.feedback}
                  </p>
                </div>
              )}
            </Card>
          )}
        </div>

        {/* RIGHT SIDEBAR CONTROLS & AI MONITOR */}
        <InterviewSidebar
          interview={interview}
          currentIndex={currentIndex}
          aiStatus={aiStatus}
          aiMessage={aiMessage}
          formattedTime={timer.formattedTime}
          isPaused={timer.isPaused}
          isCritical={timer.isCritical}
          onTogglePause={timer.toggle}
          onSelectQuestion={(idx) => setCurrentIndex(idx)}
          onPrevQuestion={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          onNextQuestion={() => setCurrentIndex((prev) => Math.min(interview.questions.length - 1, prev + 1))}
          onOpenEndModal={() => setShowEndModal(true)}
        />
      </div>

      {/* End Interview Confirmation Modal */}
      <EndInterviewModal
        isOpen={showEndModal}
        onClose={() => setShowEndModal(false)}
        onConfirm={handleCompleteInterview}
        answeredCount={answeredCount}
        totalQuestions={interview.questions.length}
        isLoading={isEndingInterview}
      />
    </DashboardLayout>
  );
};
