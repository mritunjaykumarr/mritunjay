import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, RotateCcw, Check, Terminal as TerminalIcon } from 'lucide-react';

interface HistoryItem {
  id: string;
  command: string;
  output: React.ReactNode;
}

const COMMAND_GUIDE = [
  { cmd: 'whoami', desc: 'Developer bio & background' },
  { cmd: 'projects', desc: 'Featured production software' },
  { cmd: 'skills', desc: 'Tech stack & proficiencies' },
  { cmd: 'tools', desc: 'SaaS micro-tools & analyzers' },
  { cmd: 'resume', desc: 'Open verified resume PDF' },
  { cmd: 'contact', desc: 'Direct message & socials' },
  { cmd: 'help', desc: 'List all commands' },
  { cmd: 'clear', desc: 'Clear terminal screen' },
];

export default function InteractiveHeroTerminal() {
  const [inputVal, setInputVal] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>(['focus --current']);
  const [historyPointer, setHistoryPointer] = useState<number | null>(null);

  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: 'init-header',
      command: 'focus --current',
      output: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.81rem', color: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Check size={14} style={{ color: '#22c55e', flexShrink: 0 }} />
            <span style={{ color: '#f8fafc', fontWeight: 500 }}>Crafting crisp, high-performance interfaces with React 19 & TypeScript</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Check size={14} style={{ color: '#22c55e', flexShrink: 0 }} />
            <span style={{ color: '#f8fafc', fontWeight: 500 }}>Connecting LLMs to actionable, automated business workflows</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Check size={14} style={{ color: '#22c55e', flexShrink: 0 }} />
            <span style={{ color: '#f8fafc', fontWeight: 500 }}>Shipping reliable full-stack architecture with Node.js, Express & Supabase</span>
          </div>
        </div>
      ),
    },
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const executeCommand = (cmdText: string) => {
    const raw = cmdText.trim();
    if (!raw) return;

    const lower = raw.toLowerCase();
    setCmdHistory((prev) => [...prev, raw]);
    setHistoryPointer(null);

    let outputContent: React.ReactNode = null;

    if (lower === 'clear' || lower === 'cls') {
      setHistory([]);
      setInputVal('');
      return;
    } else if (lower === 'help' || lower === '?') {
      outputContent = (
        <div style={{ padding: '4px 0', lineHeight: 1.6 }}>
          <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.82rem', marginBottom: '6px' }}>
            Available Commands:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '6px' }}>
            {COMMAND_GUIDE.map((g) => (
              <div
                key={g.cmd}
                onClick={() => executeCommand(g.cmd)}
                style={{
                  fontSize: '0.76rem',
                  cursor: 'pointer',
                  padding: '4px 7px',
                  borderRadius: '4px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.09)',
                }}
              >
                <span style={{ color: '#38bdf8', fontWeight: 600 }}>{g.cmd}</span>
                <span style={{ color: '#cbd5e1', marginLeft: '5px' }}>— {g.desc}</span>
              </div>
            ))}
          </div>
        </div>
      );
    } else if (lower === 'whoami' || lower === 'bio' || lower === 'about') {
      outputContent = (
        <div style={{ lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.88rem' }}>
            Mritunjay Kumar
          </div>
          <div style={{ color: '#38bdf8', fontSize: '0.8rem', fontWeight: 500 }}>
            Full Stack Developer @ Epigroww Global
          </div>
          <div style={{ color: '#e2e8f0', fontSize: '0.78rem' }}>
            Specializing in React 19, TypeScript, Node.js & Streaming LLMs. Based in India, collaborating with product teams globally.
          </div>
          <div style={{ color: '#4ade80', fontSize: '0.76rem', marginTop: '2px', fontWeight: 600 }}>
            ● Status: Available for contract and full-time engineering roles
          </div>
        </div>
      );
    } else if (lower === 'projects' || lower === 'proj') {
      outputContent = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '2px 0' }}>
          <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.82rem' }}>Featured Production Projects:</span>
          <div style={{ fontSize: '0.79rem', color: '#e2e8f0', lineHeight: 1.4 }}>
            1. <strong style={{ color: '#ffffff' }}>Bulk Mail Sender</strong> — 10k+ emails sent via Gmail API OAuth2.{' '}
            <a href="https://www.bulkmailsender.online/" target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'underline', fontWeight: 600 }}>Live Link ↗</a>
          </div>
          <div style={{ fontSize: '0.79rem', color: '#e2e8f0', lineHeight: 1.4 }}>
            2. <strong style={{ color: '#ffffff' }}>ToolOut Developer Platform</strong> — Next.js dev suite & WHOIS RDAP.{' '}
            <a href="https://toolout.online" target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'underline', fontWeight: 600 }}>Live Link ↗</a>
          </div>
          <div style={{ fontSize: '0.79rem', color: '#e2e8f0', lineHeight: 1.4 }}>
            3. <strong style={{ color: '#ffffff' }}>CLI Portfolio Experience</strong> — Runnable globally via <code style={{ color: '#4ade80', background: 'rgba(34, 197, 94, 0.12)', padding: '1px 5px', borderRadius: '3px' }}>npx mritunjay-portfolio</code>
          </div>
          <div style={{ fontSize: '0.79rem', color: '#e2e8f0', lineHeight: 1.4 }}>
            4. <strong style={{ color: '#ffffff' }}>Real-Time Chat Engine</strong> — Sub-20ms WebSocket multi-room architecture.
          </div>
          <button
            onClick={() => navigate('/projects')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '4px',
              color: '#38bdf8',
              fontSize: '0.76rem',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline',
              background: 'transparent',
              border: 'none',
              padding: 0,
              width: 'fit-content',
            }}
          >
            <span>View all projects in gallery</span>
            <ArrowRight size={12} />
          </button>
        </div>
      );
    } else if (lower === 'skills' || lower === 'stack') {
      outputContent = (
        <div style={{ padding: '3px 0', fontSize: '0.79rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div>⚡ <strong style={{ color: '#38bdf8' }}>Frontend:</strong> <span style={{ color: '#f1f5f9' }}>React 19, TypeScript, Next.js, Vite, Framer Motion, Tailwind CSS</span></div>
          <div>⚙️ <strong style={{ color: '#fbbf24' }}>Backend:</strong> <span style={{ color: '#f1f5f9' }}>Node.js, Express, Python 3.12, REST APIs, WebSockets, Socket.io</span></div>
          <div>🧠 <strong style={{ color: '#c084fc' }}>AI & Cloud:</strong> <span style={{ color: '#f1f5f9' }}>Gemini API, OpenRouter, Supabase, PostgreSQL, Docker, Vercel</span></div>
        </div>
      );
    } else if (lower === 'tools' || lower === 'saas') {
      outputContent = (
        <div style={{ padding: '2px 0', fontSize: '0.78rem', color: '#e2e8f0' }}>
          All developer micro-tools, WHOIS RDAP engines, and utilities have moved to our standalone platform: <a href="https://toolout.online" target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'underline', fontWeight: 600 }}>toolout.online ↗</a>
        </div>
      );
    } else if (lower === 'resume' || lower === 'cv') {
      window.open('/updated_resume.pdf', '_blank');
      outputContent = (
        <div style={{ color: '#4ade80', fontSize: '0.79rem', fontWeight: 500 }}>
          ✓ Verified Resume PDF opened in a new tab! (/updated_resume.pdf)
        </div>
      );
    } else if (lower === 'contact' || lower === 'hire' || lower === 'email') {
      window.dispatchEvent(new Event('open-contact'));
      outputContent = (
        <div style={{ fontSize: '0.79rem', color: '#e2e8f0' }}>
          <div style={{ color: '#ffffff', fontWeight: 600, marginBottom: '2px' }}>📬 Contact Modal opened!</div>
          <div>Direct Email: <a href="mailto:me@mritify.online" style={{ color: '#38bdf8', textDecoration: 'underline', fontWeight: 600 }}>me@mritify.online</a></div>
          <div>GitHub: <a href="https://github.com/mritunjaykumarr" target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'underline', fontWeight: 600 }}>github.com/mritunjaykumarr</a></div>
          <div>LinkedIn: <a href="https://www.linkedin.com/in/mritunjay-kumar-22a7a828b" target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'underline', fontWeight: 600 }}>linkedin.com/in/mritunjay-kumar</a></div>
        </div>
      );
    } else if (lower === 'book' || lower === 'schedule') {
      navigate('/book-call');
      outputContent = (
        <div style={{ color: '#4ade80', fontSize: '0.79rem', fontWeight: 500 }}>
          Navigating to Interactive Call Scheduler (/book-call)...
        </div>
      );
    } else if (lower === 'focus' || lower === 'focus --current') {
      outputContent = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.79rem', color: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={13} style={{ color: '#22c55e' }} /> <span>Crafting crisp, high-performance interfaces with React 19 & TypeScript</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={13} style={{ color: '#22c55e' }} /> <span>Connecting LLMs to actionable business workflows</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={13} style={{ color: '#22c55e' }} /> <span>Shipping reliable full-stack architecture with Node.js & Supabase</span></div>
        </div>
      );
    } else if (lower === 'status') {
      outputContent = (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.79rem', color: '#4ade80', fontWeight: 500 }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
          <span>Available for contract & engineering roles (Q2 2026)</span>
        </div>
      );
    } else if (lower === 'prince' || lower === 'ai') {
      navigate('/prince-ai');
      outputContent = (
        <div style={{ color: '#c084fc', fontSize: '0.79rem', fontWeight: 500 }}>
          Launching Prince AI Assistant (/prince-ai)...
        </div>
      );
    } else if (lower === 'npx' || lower === 'cli') {
      navigator.clipboard.writeText('npx mritunjay-portfolio');
      outputContent = (
        <div style={{ fontSize: '0.79rem', color: '#4ade80', fontWeight: 500 }}>
          ✓ Copied &ldquo;npx mritunjay-portfolio&rdquo; to clipboard!
        </div>
      );
    } else if (lower === 'theme') {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      outputContent = (
        <div style={{ fontSize: '0.79rem', color: '#38bdf8', fontWeight: 600 }}>
          ✓ Switched theme to {next.toUpperCase()} mode!
        </div>
      );
    } else {
      outputContent = (
        <div style={{ color: '#f87171', fontSize: '0.79rem' }}>
          bash: command not found: &ldquo;{raw}&rdquo;. Type <strong style={{ color: '#38bdf8', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => executeCommand('help')}>help</strong> to list all commands.
        </div>
      );
    }

    setHistory((prev) => [
      ...prev,
      {
        id: `cmd-${Date.now()}-${Math.random()}`,
        command: raw,
        output: outputContent,
      },
    ]);

    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIndex = historyPointer === null ? cmdHistory.length - 1 : Math.max(0, historyPointer - 1);
      setHistoryPointer(nextIndex);
      setInputVal(cmdHistory[nextIndex] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cmdHistory.length === 0 || historyPointer === null) return;
      const nextIndex = historyPointer + 1;
      if (nextIndex < cmdHistory.length) {
        setHistoryPointer(nextIndex);
        setInputVal(cmdHistory[nextIndex]);
      } else {
        setHistoryPointer(null);
        setInputVal('');
      }
    }
  };

  const resetTerminal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory([
      {
        id: 'init-header',
        command: 'focus --current',
        output: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.81rem', color: '#f8fafc' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Check size={14} style={{ color: '#22c55e', flexShrink: 0 }} />
              <span style={{ color: '#f8fafc', fontWeight: 500 }}>Crafting crisp, high-performance interfaces with React 19 & TypeScript</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Check size={14} style={{ color: '#22c55e', flexShrink: 0 }} />
              <span style={{ color: '#f8fafc', fontWeight: 500 }}>Connecting LLMs to actionable, automated business workflows</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Check size={14} style={{ color: '#22c55e', flexShrink: 0 }} />
              <span style={{ color: '#f8fafc', fontWeight: 500 }}>Shipping reliable full-stack architecture with Node.js, Express & Supabase</span>
            </div>
          </div>
        ),
      },
    ]);
    setInputVal('');
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      style={{
        background: '#0d1117',
        border: '1px solid rgba(255, 255, 255, 0.14)',
        borderRadius: '12px',
        overflow: 'hidden',
        fontFamily: 'var(--font-mono, "SF Mono", "Fira Code", Menlo, Consolas, monospace)',
        fontSize: '0.82rem',
        boxShadow: '0 24px 60px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: '400px',
      }}
    >
      {/* Terminal Top Window Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.7rem 1rem',
          background: '#161b22',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* macOS traffic light window dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#ff5f56', display: 'inline-block' }} />
            <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#ffbd2e', display: 'inline-block' }} />
            <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#27c93f', display: 'inline-block' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '6px' }}>
            <TerminalIcon size={14} style={{ color: '#38bdf8' }} />
            <span style={{ fontSize: '0.78rem', color: '#ffffff', fontWeight: 600, letterSpacing: '-0.01em' }}>
              mritunjay.ai <span style={{ color: '#94a3b8', fontWeight: 400 }}>/ bash (interactive)</span>
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.7rem', color: '#4ade80' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 6px #22c55e' }} />
            <span style={{ fontWeight: 600 }}>live</span>
          </div>
          <button
            onClick={resetTerminal}
            title="Reset Terminal"
            style={{
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px',
              display: 'grid',
              placeItems: 'center',
              background: 'transparent',
              border: 'none',
              borderRadius: '4px',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; }}
            aria-label="Reset terminal"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* Terminal Main Body */}
      <div
        className="terminal-body-scroll"
        style={{
          padding: '1.15rem 1.25rem',
          color: '#ffffff',
          flex: 1,
          minHeight: '250px',
          maxHeight: '340px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {/* Intro developer line */}
        <div style={{ color: '#e2e8f0', fontSize: '0.81rem', lineHeight: 1.5, borderBottom: '1px dashed rgba(255, 255, 255, 0.12)', paddingBottom: '10px' }}>
          <span style={{ color: '#ffffff', fontWeight: 600 }}>Full Stack Developer</span>{' '}
          <span style={{ color: '#38bdf8' }}>@ Epigroww Global</span> •{' '}
          <span style={{ color: '#cbd5e1' }}>Specializing in React 19, TypeScript, Node.js & Streaming LLMs</span>
        </div>

        {/* History items */}
        {history.map((item) => (
          <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#4ade80', fontWeight: 700 }}>~</span>
              <span style={{ color: '#38bdf8', fontWeight: 700 }}>$</span>
              <span style={{ color: '#ffffff', fontWeight: 600 }}>{item.command}</span>
            </div>
            <div style={{ paddingLeft: '14px', color: '#f8fafc' }}>
              {item.output}
            </div>
          </div>
        ))}

        {/* Active Command Input Prompt */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
          <span style={{ color: '#4ade80', fontWeight: 700 }}>~</span>
          <span style={{ color: '#38bdf8', fontWeight: 700 }}>$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="type 'help' or any command..."
            style={{
              flex: 1,
              background: 'transparent',
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
              padding: 0,
              margin: 0,
              color: '#ffffff',
              fontFamily: 'inherit',
              fontSize: '0.83rem',
              caretColor: '#22c55e',
            }}
            aria-label="Terminal command input"
            spellCheck={false}
            autoCapitalize="none"
            autoComplete="off"
          />
        </div>

        <div ref={terminalEndRef} />
      </div>

      {/* Command Guide Strip Below */}
      <div
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: '#161b22',
          padding: '0.65rem 1rem',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '6px',
          userSelect: 'none',
        }}
      >
        <span
          style={{
            fontSize: '0.68rem',
            color: '#94a3b8',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginRight: '2px',
          }}
        >
          GUIDE:
        </span>
        {COMMAND_GUIDE.map((g) => (
          <button
            key={g.cmd}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              executeCommand(g.cmd);
            }}
            title={g.desc}
            className="terminal-guide-chip"
          >
            {g.cmd}
          </button>
        ))}
      </div>
    </div>
  );
}
