import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { useTheme } from '../../context/ThemeContext';
import { RotateCcw, ZoomIn, ZoomOut, Check, Terminal } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  language: string;
  onChange: (newCode: string) => void;
  onLanguageChange: (lang: string) => void;
  onResetStarter: () => void;
  height?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  language = 'javascript',
  onChange,
  onLanguageChange,
  onResetStarter,
  height = '480px',
}) => {
  const { theme } = useTheme();
  const [fontSize, setFontSize] = useState<number>(14);

  const monacoLanguageMap: Record<string, string> = {
    javascript: 'javascript',
    typescript: 'typescript',
    python: 'python',
    cpp: 'cpp',
    c: 'c',
    java: 'java',
  };

  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '');
  };

  return (
    <div className="w-full flex flex-col rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-900 shadow-md">
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-950 border-b border-gray-800 text-xs">
        {/* Language selector & title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-gray-400 font-mono">
            <Terminal className="w-4 h-4 text-brand-500" />
            <span className="font-semibold text-gray-300">Monaco Sandbox</span>
          </div>

          <div className="h-4 w-px bg-gray-800" />

          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-gray-200 text-xs rounded-md px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
          >
            <option value="javascript">JavaScript (ES2022)</option>
            <option value="python">Python 3</option>
            <option value="cpp">C++ (GCC)</option>
          </select>
        </div>

        {/* Editor adjustments */}
        <div className="flex items-center gap-2 text-gray-400">
          <button
            onClick={() => setFontSize((prev) => Math.max(11, prev - 1))}
            className="p-1 rounded hover:bg-gray-800 hover:text-gray-200 transition-colors"
            title="Decrease font size"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[11px] text-gray-500">{fontSize}px</span>
          <button
            onClick={() => setFontSize((prev) => Math.min(22, prev + 1))}
            className="p-1 rounded hover:bg-gray-800 hover:text-gray-200 transition-colors"
            title="Increase font size"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-gray-800 mx-1" />

          <button
            onClick={onResetStarter}
            className="flex items-center gap-1 px-2 py-1 rounded bg-gray-800/80 hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
            title="Reset code to original starter code"
          >
            <RotateCcw className="w-3 h-3 text-amber-400" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="relative w-full">
        <Editor
          height={height}
          language={monacoLanguageMap[language] || 'javascript'}
          value={code}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          onChange={handleEditorChange}
          options={{
            fontSize,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            lineNumbers: 'on',
            lineNumbersMinChars: 3,
            wordWrap: 'on',
            padding: { top: 12, bottom: 12 },
            cursorBlinking: 'smooth',
            smoothScrolling: true,
          }}
        />
      </div>
    </div>
  );
};
