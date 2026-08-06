import { useState } from 'react';
import { Bot, Sparkles, X, SendHorizonal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const PRESET_QUESTIONS = [
  { label: 'Show your best project', prompt: 'Show your best project' },
  { label: 'What technologies do you know?', prompt: 'What technologies do you know?' },
  { label: 'Why should we hire you?', prompt: 'Why should we hire you?' },
  { label: 'Show your GitHub', prompt: 'Show your GitHub' },
  { label: 'Explain your architecture', prompt: 'Explain your architecture' },
];

export function generatePrinceAIResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('best project') || q.includes('top project') || q.includes('featured')) {
    return `### 🏆 Mritunjay's Top Featured Projects

1. **Bulk Mail Sender** — High-volume email platform with CSV engine & Gmail API (10k+ emails sent).
2. **Interactive CLI Portfolio** — Developer terminal experience (\`npx mritunjay-portfolio\`).
3. **Ad-Free YouTube Experience** — Custom minimalist video streaming interface.
4. **Real-Time WebSocket Chat** — Multi-room instant messaging application.

[View Full Projects Showcase](/projects)`;
  }

  if (q.includes('technology') || q.includes('technologies') || q.includes('stack') || q.includes('skills') || q.includes('know')) {
    return `### ⚡ Technology Stack & Expertise

- **Frontend:** React, TypeScript, Next.js, Vite, Tailwind CSS, GSAP, Framer Motion
- **Backend & APIs:** Node.js, Express, Python, FastAPI, REST, WebSockets, GraphQL
- **AI & Cloud:** OpenRouter API, Gemini AI models, Supabase, PostgreSQL, Docker, CI/CD
- **Architecture:** System Design, Microservices, Async Event Pipelines, Performance Optimization`;
  }

  if (q.includes('hire') || q.includes('why') || q.includes('reason')) {
    return `### 💼 Why Hire Mritunjay Kumar?

- **Product-Minded Engineer:** Focuses on real business impact, performance, and clean UX.
- **AI-First Integration:** Proficient in building modern AI-powered applications, dynamic chat engines, and workflow automation.
- **Full-Stack Competency:** End-to-end capabilities from DB schema design & microservices to pixel-perfect responsive UIs.
- **Proven Execution:** Developed production platforms like Bulk Mail Sender with 99.9% uptime.`;
  }

  if (q.includes('github') || q.includes('code') || q.includes('repo')) {
    return `### 🐙 GitHub & Open Source

Mritunjay actively builds and publishes open-source software:
- **GitHub Profile:** [github.com/mritunjaykumarr](https://github.com/mritunjaykumarr)
- **CLI Portfolio NPM:** [CLI Portfolio Repo](https://github.com/mritunjaykumarr/CLI-Portfolio.git)
- **Email Platform:** [Bulk Mail Sender](https://www.bulkmailsender.online/)`;
  }

  if (q.includes('architecture') || q.includes('system') || q.includes('design')) {
    return `### 🏗️ Engineering Architecture Philosophy

Mritunjay designs systems with:
1. **Separation of Concerns:** Decoupled frontend components & lightweight API services.
2. **Real-time Event Architecture:** WebSockets for instant state sync and streaming updates.
3. **Resilient Data Pipelines:** Caching layers (Redis/LocalCache) & retrying backoffs.
4. **AI Routing:** Seamless fallbacks between cloud LLM providers and local heuristic logic.`;
  }

  return `Thanks for asking! Mritunjay Kumar is a Full Stack & AI Application Developer specializing in enterprise SaaS, AI product integrations, and high-performance Web applications. Feel free to click any quick question below or ask about the tech stack, or projects!`;
}

export default function FloatingPrinceAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hello! I'm **Prince AI** — Mritunjay's AI Assistant. Ask me anything about his projects, skills, architecture, or why you should hire him!",
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = (userText?: string) => {
    const text = (userText || input).trim();
    if (!text) return;

    const newMsgs: ChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(newMsgs);
    setInput('');

    setTimeout(() => {
      const reply = generatePrinceAIResponse(text);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    }, 400);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="floating-ai-btn"
        aria-label="Ask Prince AI"
        title="Ask Prince AI"
      >
        <Bot size={22} />
        <span className="floating-ai-badge">Ask Prince AI</span>
        <Sparkles size={14} className="floating-ai-sparkle" />
      </button>

      {/* Floating Modal Drawer */}
      {isOpen && (
        <div className="floating-ai-overlay" onClick={() => setIsOpen(false)}>
          <div className="floating-ai-drawer card-glass" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="floating-ai-header">
              <div className="ai-header-title">
                <div className="ai-avatar-icon">
                  <Bot size={18} />
                </div>
                <div>
                  <h4>Ask Prince AI</h4>
                  <p>Mritunjay's Portfolio Assistant</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="ai-close-btn" aria-label="Close">
                <X size={18} />
              </button>
            </div>

            {/* Prompt Chips */}
            <div className="floating-ai-chips">
              {PRESET_QUESTIONS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(item.prompt)}
                  className="ai-chip-btn"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Chat Body */}
            <div className="floating-ai-body">
              {messages.map((m, i) => (
                <div key={i} className={`ai-msg ${m.role === 'user' ? 'ai-msg-user' : 'ai-msg-assistant'}`}>
                  {m.role === 'assistant' && (
                    <span className="ai-sender-name"><Bot size={12} /> Prince AI</span>
                  )}
                  <div className="ai-bubble">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <div className="floating-ai-input-bar">
              <input
                type="text"
                placeholder="Ask Prince AI anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="ai-send-action"
                aria-label="Send"
              >
                <SendHorizonal size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
