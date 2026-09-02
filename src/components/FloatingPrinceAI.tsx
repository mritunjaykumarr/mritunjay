import React, { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, X, SendHorizonal, MessageSquare, Send, Mail, Phone, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { streamPrinceAIChat, type ChatMessage } from '../lib/princeAiService';

const PRESET_AI_QUESTIONS = [
  { label: 'Show your best project', prompt: 'Show your best project' },
  { label: 'What technologies do you know?', prompt: 'What technologies do you know?' },
  { label: 'Why should we hire you?', prompt: 'Why should we hire you?' },
  { label: 'Show your GitHub', prompt: 'Show your GitHub' },
  { label: 'Explain your architecture', prompt: 'Explain your architecture' },
];

const LEAD_PROMPTS = [
  { label: '🚀 Build an MVP / Web App', text: 'Hi Mritunjay, I need help building an MVP web application. What is your process and timeline?' },
  { label: '🤖 Integrate Custom AI / LLMs', text: 'Hi! We are looking to integrate generative AI / streaming LLM features into our product. Are you available?' },
  { label: '⚡ Performance & UI Redesign', text: 'Hi Mritunjay, I want to overhaul our frontend performance and UI animations with React 19.' },
  { label: '💰 Rates & Availability', text: 'Hi! What are your current rates for full-stack contract work or part-time retainer?' },
];

export default function FloatingPrinceAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'lead' | 'ai'>('lead');

  // Lead capture state
  const [leadStep, setLeadStep] = useState<'question' | 'contact' | 'sent'>('question');
  const [leadQuestion, setLeadQuestion] = useState('');
  const [leadContact, setLeadContact] = useState('');
  const [leadName, setLeadName] = useState('');
  const [leadLoading, setLeadLoading] = useState(false);
  const [capturedQuestion, setCapturedQuestion] = useState('');

  // AI Chat state
  const [aiMessages, setAiMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hello! I'm **Prince AI** — Mritunjay's AI Assistant. Ask me anything about his projects, skills, architecture, or why you should hire him!",
    },
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const aiBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (aiBodyRef.current) {
      aiBodyRef.current.scrollTop = aiBodyRef.current.scrollHeight;
    }
  }, [aiMessages, activeTab]);

  const handleSendAI = async (userText?: string) => {
    const text = (userText || aiInput).trim();
    if (!text || aiLoading) return;

    const newMsgs: ChatMessage[] = [...aiMessages, { role: 'user', content: text }];
    setAiMessages(newMsgs);
    setAiInput('');
    setAiLoading(true);
    setAiMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    await streamPrinceAIChat(
      newMsgs,
      (chunk) => {
        setAiMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last?.role === 'assistant') {
            updated[updated.length - 1] = { ...last, content: last.content + chunk };
          }
          return updated;
        });
      },
      () => setAiLoading(false),
      (err) => {
        setAiMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last?.role === 'assistant') {
            updated[updated.length - 1] = { ...last, content: `⚠️ ${err}` };
          }
          return updated;
        });
        setAiLoading(false);
      }
    );
  };

  const handleSelectLeadPrompt = (promptText: string) => {
    setCapturedQuestion(promptText);
    setLeadStep('contact');
  };

  const handleSendLeadQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadQuestion.trim()) return;
    setCapturedQuestion(leadQuestion.trim());
    setLeadQuestion('');
    setLeadStep('contact');
  };

  const handleSendLeadContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadContact.trim()) return;

    setLeadLoading(true);
    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: 'af71a9aa-dfeb-4439-a91b-afa7bc2e17d8',
          subject: `🚀 New Freelance Live Chat Lead: ${leadName || 'Prospective Client'}`,
          name: leadName || 'Live Chat Visitor',
          contact: leadContact,
          inquiry: capturedQuestion,
          source: 'Live Chat Widget (Bottom Right)'
        })
      });
      setLeadStep('sent');
    } catch {
      alert('Could not submit. Please email me directly at me@mritify.online');
    } finally {
      setLeadLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="floating-ai-btn"
          aria-label="Open Quick Inquiry and AI Assistant"
          title="Ask a Quick Question / Hire Mritunjay"
        >
          <div className="lead-chat-badge-pulse" style={{ marginRight: '2px' }} />
          <Bot size={19} />
          <span className="floating-ai-badge">Ask AI / Quick Inquiry</span>
          <Sparkles size={14} className="floating-ai-sparkle" />
        </button>
      )}

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
                  <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 600 }}>Mritunjay Assistant</h4>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)' }}>🟢 Online · Fast Reply</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="ai-close-btn" aria-label="Close">
                <X size={17} />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div style={{ display: 'flex', background: 'var(--surface-2)', borderBottom: '1px solid var(--border)', padding: '4px' }}>
              <button
                type="button"
                onClick={() => setActiveTab('lead')}
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: activeTab === 'lead' ? 'var(--card)' : 'transparent',
                  color: activeTab === 'lead' ? 'var(--text)' : 'var(--text-muted)',
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'lead' ? 'var(--shadow-sm)' : 'none'
                }}
              >
                <MessageSquare size={13} />
                <span>Quick Inquiry</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ai')}
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: activeTab === 'ai' ? 'var(--card)' : 'transparent',
                  color: activeTab === 'ai' ? 'var(--text)' : 'var(--text-muted)',
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'ai' ? 'var(--shadow-sm)' : 'none'
                }}
              >
                <Sparkles size={13} />
                <span>Ask Prince AI</span>
              </button>
            </div>

            {/* TAB 1: Lead Capture */}
            {activeTab === 'lead' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px', overflowY: 'auto' }}>
                {leadStep === 'question' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', padding: '10px', borderRadius: '10px', fontSize: '0.82rem', lineHeight: 1.5 }}>
                      👋 Looking for freelance builds, AI integrations, or contract engineering? Pick a topic or type your question:
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {LEAD_PROMPTS.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectLeadPrompt(p.text)}
                          className="lead-chat-prompt-pill"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>

                    <form onSubmit={handleSendLeadQuestion} style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                      <input
                        type="text"
                        placeholder="Type custom question..."
                        value={leadQuestion}
                        onChange={(e) => setLeadQuestion(e.target.value)}
                        className="lead-chat-input"
                      />
                      <button type="submit" disabled={!leadQuestion.trim()} className="btn-primary" style={{ padding: '0 12px' }}>
                        <Send size={13} />
                      </button>
                    </form>
                  </div>
                )}

                {leadStep === 'contact' && (
                  <form onSubmit={handleSendLeadContact} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', padding: '10px', borderRadius: '10px' }}>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Your inquiry:</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text)', marginTop: '2px' }}>
                        &ldquo;{capturedQuestion}&rdquo;
                      </div>
                    </div>

                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)' }}>
                      📬 Where should Mritunjay reply?
                    </div>

                    <input
                      type="text"
                      placeholder="Your Name (Optional)"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      className="lead-chat-input"
                    />

                    <input
                      type="text"
                      placeholder="Your Email or WhatsApp number *"
                      value={leadContact}
                      onChange={(e) => setLeadContact(e.target.value)}
                      required
                      className="lead-chat-input"
                    />

                    <button type="submit" disabled={leadLoading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.65rem' }}>
                      <span>{leadLoading ? 'Dispatching…' : 'Submit Quick Inquiry'}</span>
                      <Send size={13} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setLeadStep('question')}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.74rem', cursor: 'pointer' }}
                    >
                      ← Back to topics
                    </button>
                  </form>
                )}

                {leadStep === 'sent' && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '1.5rem 0', gap: '10px' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', display: 'grid', placeItems: 'center' }}>
                      <Check size={22} />
                    </div>
                    <h4 style={{ margin: 0, color: 'var(--text)', fontSize: '1rem' }}>Inquiry Sent!</h4>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      Mritunjay has received your note directly in his inbox and will respond within a few hours.
                    </p>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                      <a
                        href="https://wa.me/919470880956"
                        target="_blank"
                        rel="noreferrer"
                        className="lead-chat-action-link"
                        style={{ background: 'rgba(34, 197, 94, 0.12)', color: '#22c55e', borderColor: 'rgba(34, 197, 94, 0.3)' }}
                      >
                        <Phone size={12} /> WhatsApp Direct
                      </a>
                      <a href="mailto:me@mritify.online" className="lead-chat-action-link">
                        <Mail size={12} /> Email Direct
                      </a>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setLeadStep('question');
                        setCapturedQuestion('');
                        setLeadContact('');
                      }}
                      style={{ marginTop: '12px', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.74rem', cursor: 'pointer' }}
                    >
                      Ask another question
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: AI Assistant */}
            {activeTab === 'ai' && (
              <>
                {/* Prompt Chips */}
                <div className="floating-ai-chips">
                  {PRESET_AI_QUESTIONS.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendAI(item.prompt)}
                      className="ai-chip-btn"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Chat Body */}
                <div className="floating-ai-body" ref={aiBodyRef}>
                  {aiMessages.map((m, i) => (
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
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSendAI();
                      }
                    }}
                    disabled={aiLoading}
                  />
                  <button
                    onClick={() => handleSendAI()}
                    disabled={!aiInput.trim() || aiLoading}
                    className="ai-send-action"
                    aria-label="Send"
                  >
                    <SendHorizonal size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
