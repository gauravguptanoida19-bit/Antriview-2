import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { Moon, Sun, Volume2, Sliders, Shield, Terminal } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { speak, isSpeaking, cancel } = useSpeechSynthesis();
  const [editorFontSize, setEditorFontSize] = useState<number>(14);

  const handleTestVoice = () => {
    if (isSpeaking) {
      cancel();
    } else {
      speak('Hello! I am your AI interviewer on Antiview. I am ready to evaluate your technical solutions.');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="pb-6 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            Platform Settings
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Configure appearance, editor defaults, and voice simulation parameters
          </p>
        </div>

        {/* Theme Preference */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-400">
            <Sun className="w-4 h-4 text-brand-500" />
            Appearance & Interface Theme
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
                theme === 'dark'
                  ? 'bg-brand-500/10 border-brand-500 text-brand-400 ring-1 ring-brand-500'
                  : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-400'
              }`}
            >
              <Moon className="w-5 h-5" />
              <div className="text-left">
                <div className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">Dark Mode</div>
                <div className="text-[11px] text-gray-500">Linear / Dev tools theme (Recommended)</div>
              </div>
            </button>

            <button
              onClick={() => setTheme('light')}
              className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
                theme === 'light'
                  ? 'bg-brand-500/10 border-brand-500 text-brand-600 ring-1 ring-brand-500'
                  : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-400'
              }`}
            >
              <Sun className="w-5 h-5" />
              <div className="text-left">
                <div className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">Light Mode</div>
                <div className="text-[11px] text-gray-500">High-contrast daytime styling</div>
              </div>
            </button>
          </div>
        </Card>

        {/* Voice Interview Engine Settings */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-400">
            <Volume2 className="w-4 h-4 text-purple-400" />
            Voice Synthesis & Audio
          </div>

          <p className="text-xs text-gray-600 dark:text-gray-400">
            Antiview utilizes the browser Web Speech API for low-latency narration and speech-to-text
            recognition without external network latency.
          </p>

          <div className="pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleTestVoice}
              leftIcon={<Volume2 className="w-4 h-4 text-emerald-400" />}
            >
              {isSpeaking ? 'Stop Test Speech' : 'Test AI Voice Narration'}
            </Button>
          </div>
        </Card>

        {/* Monaco Editor Preferences */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-400">
            <Terminal className="w-4 h-4 text-emerald-400" />
            Monaco Editor Default Typography
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Default Code Font Size</span>
              <span className="font-mono text-brand-500 font-bold">{editorFontSize}px</span>
            </div>
            <input
              type="range"
              min={11}
              max={22}
              value={editorFontSize}
              onChange={(e) => setEditorFontSize(Number(e.target.value))}
              className="w-full accent-brand-500"
            />
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};
