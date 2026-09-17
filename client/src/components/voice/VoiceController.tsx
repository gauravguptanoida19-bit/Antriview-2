import React from 'react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  AlertCircle,
  Keyboard,
  Send,
} from 'lucide-react';

interface VoiceControllerProps {
  questionText: string;
  transcript: string;
  isListening: boolean;
  isSpeaking: boolean;
  isSTTSupported: boolean;
  isTTSSupported: boolean;
  sttError: string | null;
  onStartListening: () => void;
  onStopListening: () => void;
  onResetTranscript: () => void;
  onTranscriptChange: (text: string) => void;
  onSpeakQuestion: () => void;
  onStopSpeaking: () => void;
  onSubmitAnswer: () => void;
  isSubmitting: boolean;
}

export const VoiceController: React.FC<VoiceControllerProps> = ({
  questionText,
  transcript,
  isListening,
  isSpeaking,
  isSTTSupported,
  isTTSSupported,
  sttError,
  onStartListening,
  onStopListening,
  onResetTranscript,
  onTranscriptChange,
  onSpeakQuestion,
  onStopSpeaking,
  onSubmitAnswer,
  isSubmitting,
}) => {
  return (
    <div className="space-y-4">
      {/* Speech API Warning Banner if unsupported in browser */}
      {(!isSTTSupported || !isTTSSupported || sttError) && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200">
          <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <span>
              {sttError || 'Web Speech API is partially unsupported in this browser.'}{' '}
              You can still practice in Voice Mode or edit the transcript below via keyboard.
            </span>
          </div>
        </div>
      )}

      {/* Voice Controls Deck */}
      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-gray-800 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-500" />
              Voice Mode Cockpit
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* AI Speech Output Button */}
            {isSpeaking ? (
              <Button
                variant="outline"
                size="sm"
                onClick={onStopSpeaking}
                leftIcon={<VolumeX className="w-3.5 h-3.5 text-rose-400" />}
              >
                Mute AI
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={onSpeakQuestion}
                leftIcon={<Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
              >
                Hear AI Ask Question
              </Button>
            )}
          </div>
        </div>

        {/* Center Microphone Orb & Wave Visualizer */}
        <div className="flex flex-col items-center justify-center py-6">
          <div className="relative">
            {isListening && (
              <span className="absolute -inset-3 rounded-full bg-blue-500/20 animate-ping" />
            )}
            <button
              onClick={isListening ? onStopListening : onStartListening}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer ${
                isListening
                  ? 'bg-rose-500 text-white shadow-rose-500/30 scale-105'
                  : 'bg-brand-500 hover:bg-brand-600 text-gray-950 shadow-brand-500/25 hover:scale-105'
              }`}
              title={isListening ? 'Click to pause microphone' : 'Click to start speaking'}
            >
              {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </button>
          </div>

          <div className="mt-4 text-center">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {isListening ? 'Microphone Active — Listening...' : 'Click Microphone to Answer'}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {isListening
                ? 'Speak clearly. Your response will transcribe below in real-time.'
                : 'Press the mic or type in the transcript box below.'}
            </p>
          </div>

          {/* Real-time wave bars */}
          {isListening && (
            <div className="flex items-center gap-1 mt-4 h-6">
              {[4, 8, 14, 20, 12, 18, 24, 16, 10, 18, 12, 6].map((h, i) => (
                <span
                  key={i}
                  className="w-1 bg-brand-500 rounded-full animate-[wave_0.9s_ease-in-out_infinite]"
                  style={{
                    height: `${h}px`,
                    animationDelay: `${(i % 5) * 0.15}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Live Candidate Transcript Box */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Keyboard className="w-3.5 h-3.5" />
              Your Spoken Response (Live Transcript)
            </label>
            {transcript && (
              <button
                onClick={onResetTranscript}
                className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-200 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>

          <textarea
            rows={4}
            value={transcript}
            onChange={(e) => onTranscriptChange(e.target.value)}
            placeholder="Your voice will appear here as you speak. You can also edit or append thoughts directly using your keyboard..."
            className="w-full p-3.5 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 resize-y leading-relaxed font-sans"
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-gray-500">
              {transcript.trim().split(/\s+/).filter(Boolean).length} words spoken
            </span>
            <Button
              variant="primary"
              size="sm"
              onClick={onSubmitAnswer}
              isLoading={isSubmitting}
              disabled={!transcript.trim()}
              leftIcon={<Send className="w-3.5 h-3.5" />}
            >
              Submit Verbal Answer
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
