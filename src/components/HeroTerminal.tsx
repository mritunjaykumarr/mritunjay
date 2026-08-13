import { useState, useEffect } from 'react';
import { Terminal, Copy, Check, Play, RefreshCw } from 'lucide-react';

interface TerminalTab {
  id: string;
  command: string;
  output: string[];
}

const TERMINAL_DATA: TerminalTab[] = [
  {
    id: 'npx',
    command: 'npx mritunjay-portfolio',
    output: [
      '🚀 Launching Mritunjay Kumar Portfolio CLI v2.4.0...',
      '------------------------------------------------',
      '👤 Name:       Mritunjay Kumar',
      '💼 Role:       Full Stack & AI Application Developer',
      '🏢 Current:    Full Stack Developer @ Epigroww Global',
      '🌟 Specialty:  AI Products, B2B SaaS, System Architecture',
      '⚡ Best Proj:   Bulk Mail Sender (High-Volume Email)',
      '------------------------------------------------',
      '✨ Use arrow keys or chat with Prince AI to explore!',
    ],
  },
  {
    id: 'stack',
    command: 'cat stack.json',
    output: [
      '{',
      '  "frontend": ["React", "TypeScript", "Vite", "TailwindCSS"],',
      '  "backend": ["Node.js", "Express", "Python", "FastAPI"],',
      '  "ai_ml": ["OpenRouter API", "Gemini 1.5/3.6", "LangChain", "Vector DBs"],',
      '  "database": ["Supabase", "PostgreSQL", "MongoDB", "Redis"],',
      '  "devops": ["Docker", "Vercel", "GitHub Actions", "CI/CD"]',
      '}',
    ],
  },
  {
    id: 'whoami',
    command: 'whoami --summary',
    output: [
      'Mritunjay Kumar — Enterprise Full Stack & AI Architect.',
      'Transformed retail distribution & high-volume bulk messaging platforms.',
      'Passionate about building intuitive, zero-downtime, sub-100ms applications.',
    ],
  },
  {
    id: 'git',
    command: 'git log --oneline -n 4',
    output: [
      'a7b3d2e (HEAD -> main) feat(hero): 3D canvas, animated terminal & Ask Prince AI',
      'f91e02c feat(saas): launch B2B SaaS platform',
      'c4d812b feat(ai): integrate Prince AI portfolio intelligence agent',
      'e83109a perf(core): 99.9% uptime & sub-20ms WebSocket chat engine',
    ],
  },
];

export default function HeroTerminal() {
  const [activeTab, setActiveTab] = useState(0);
  const [typedOutput, setTypedOutput] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const currentTab = TERMINAL_DATA[activeTab];

  useEffect(() => {
    let currentLineIndex = 0;
    const startTimer = setTimeout(() => {
      setIsRunning(true);
      setTypedOutput([]);
    }, 0);

    const interval = setInterval(() => {
      if (currentLineIndex < currentTab.output.length) {
        const nextLine = currentTab.output[currentLineIndex];
        setTypedOutput((prev) => [...prev, nextLine]);
        currentLineIndex++;
      } else {
        setIsRunning(false);
        clearInterval(interval);
      }
    }, 120);

    return () => {
      clearTimeout(startTimer);
      clearInterval(interval);
    };
  }, [activeTab, currentTab.output]);

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(currentTab.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="hero-terminal-card card-glass">
      {/* Terminal Window Header */}
      <div className="terminal-header">
        <div className="terminal-dots">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>
        <div className="terminal-title">
          <Terminal size={14} />
          <span>mritunjay@developer-station:~</span>
        </div>
        <button
          onClick={handleCopyCommand}
          className="terminal-copy-btn"
          title="Copy Command"
          aria-label="Copy Command"
        >
          {copied ? <Check size={14} className="text-green" /> : <Copy size={14} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Terminal Tab Bar */}
      <div className="terminal-tabs">
        {TERMINAL_DATA.map((tab, idx) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(idx)}
            className={`terminal-tab ${activeTab === idx ? 'active' : ''}`}
          >
            {tab.command.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Terminal Body */}
      <div className="terminal-body">
        <div className="terminal-command-line">
          <span className="prompt-symbol">$</span>
          <span className="prompt-command">{currentTab.command}</span>
          {isRunning && <RefreshCw size={14} className="spin text-primary ml-auto" />}
        </div>

        <div className="terminal-output">
          {typedOutput.map((line, i) => (
            <div key={i} className="terminal-line">
              {line.startsWith('🚀') || line.startsWith('✨') ? (
                <span className="terminal-highlight">{line}</span>
              ) : line.startsWith('{') || line.startsWith('}') || line.includes('"') ? (
                <span className="terminal-json">{line}</span>
              ) : line.startsWith('a7b3') || line.startsWith('f91e') ? (
                <span className="terminal-git">{line}</span>
              ) : (
                <span>{line}</span>
              )}
            </div>
          ))}
          {isRunning && (
            <div className="terminal-cursor-line">
              <span className="blinking-cursor">▌</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Interactive Command Buttons */}
      <div className="terminal-footer">
        <span className="terminal-hint">Quick commands:</span>
        <button
          onClick={() => setActiveTab(0)}
          className={`terminal-chip ${activeTab === 0 ? 'active' : ''}`}
        >
          <Play size={12} /> npx CLI
        </button>
        <button
          onClick={() => setActiveTab(1)}
          className={`terminal-chip ${activeTab === 1 ? 'active' : ''}`}
        >
          cat stack.json
        </button>
        <button
          onClick={() => setActiveTab(3)}
          className={`terminal-chip ${activeTab === 3 ? 'active' : ''}`}
        >
          git log
        </button>
      </div>
    </div>
  );
}
