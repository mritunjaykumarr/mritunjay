import { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, X, SendHorizonal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { streamPrinceAIChat, generatePrinceAIResponse, type ChatMessage } from '../lib/princeAiService';

export { generatePrinceAIResponse };

const PRESET_QUESTIONS = [
  { label: 'Show your best project', prompt: 'Show your best project' },
  { label: 'What technologies do you know?', prompt: 'What technologies do you know?' },
  { label: 'Why should we hire you?', prompt: 'Why should we hire you?' },
  { label: 'Show your GitHub', prompt: 'Show your GitHub' },
  { label: 'Explain your architecture', prompt: 'Explain your architecture' },
];

export default function FloatingPrinceAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hello! I'm **Prince AI** — Mritunjay's AI Assistant. Ask me anything about his projects, skills, architecture, or why you should hire him!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (userText?: string) => {
    const text = (userText || input).trim();
    if (!text || isLoading) return;

    const newMsgs: ChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(newMsgs);
    setInput('');
    setIsLoading(true);
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    await streamPrinceAIChat(
      newMsgs,
      (chunk) => {
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last?.role === 'assistant') {
            updated[updated.length - 1] = { ...last, content: last.content + chunk };
          }
          return updated;
        });
      },
      () => setIsLoading(false),
      (err) => {
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last?.role === 'assistant') {
            updated[updated.length - 1] = { ...last, content: `⚠️ ${err}` };
          }
          return updated;
        });
        setIsLoading(false);
      }
    );
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
            <div className="floating-ai-body" ref={bodyRef}>
              {messages.map((m, i) => (
                <div key={i} className={`ai-msg ${m.role === 'user' ? 'ai-msg-user' : 'ai-msg-assistant'}`}>
                  {m.role === 'assistant' && (
                    <span className="ai-sender-name"><Bot size={12} /> Prince AI</span>
                  )}
                  <div className="ai-bubble">
                    {m.content ? (
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    ) : (
                      <span className="ai-typing"><span /><span /><span /></span>
                    )}
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
                disabled={isLoading}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
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
