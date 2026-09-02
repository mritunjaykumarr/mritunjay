import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Mail, Phone } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  { label: '🚀 Build an MVP / Web App', text: 'Hi Mritunjay, I need help building an MVP web application. What is your process and timeline?' },
  { label: '🤖 Integrate Custom AI / LLMs', text: 'Hi! We are looking to integrate generative AI / streaming LLM features into our product. Are you available?' },
  { label: '⚡ Performance & UI Redesign', text: 'Hi Mritunjay, I want to overhaul our frontend performance and UI animations with React 19.' },
  { label: '💰 Rates & Availability', text: 'Hi! What are your current rates for full-stack contract work or part-time retainer?' },
];

export default function LeadCaptureChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Hey there! 👋 I’m Mritunjay’s quick inquiry assistant. Have a project in mind, need an AI feature, or want an estimate?',
      timestamp: 'Just now'
    }
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [clientName, setClientName] = useState('');
  const [step, setStep] = useState<'question' | 'contact' | 'sent'>('question');
  const [loading, setLoading] = useState(false);
  const [capturedQuestion, setCapturedQuestion] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, step]);

  const handleSelectPrompt = (promptText: string) => {
    setCapturedQuestion(promptText);
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), sender: 'user', text: promptText, timestamp: now },
      {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: 'Awesome! Where should Mritunjay reply? Drop your email or WhatsApp below with your name:',
        timestamp: now
      }
    ]);
    setStep('contact');
  };

  const handleSendQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuestion.trim()) return;
    const userText = inputQuestion.trim();
    setCapturedQuestion(userText);
    setInputQuestion('');

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), sender: 'user', text: userText, timestamp: now },
      {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: 'Got your question! Please leave your email or WhatsApp number so Mritunjay can reach back to you directly:',
        timestamp: now
      }
    ]);
    setStep('contact');
  };

  const handleSendContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInfo.trim()) return;

    setLoading(true);
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: 'af71a9aa-dfeb-4439-a91b-afa7bc2e17d8',
          subject: `🚀 New Freelance Live Chat Lead: ${clientName || 'Prospective Client'}`,
          name: clientName || 'Live Chat Visitor',
          contact: contactInfo,
          inquiry: capturedQuestion,
          source: 'Live Chat Widget (Bottom Right)'
        })
      });

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'user',
          text: `Contact: ${contactInfo}${clientName ? ` (${clientName})` : ''}`,
          timestamp: now
        },
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: '✓ Perfect! Your inquiry has been dispatched straight to Mritunjay’s direct inbox. He will reply within a few hours!',
          timestamp: now
        }
      ]);
      setStep('sent');
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'assistant',
          text: 'Something went wrong submitting. You can also email directly at me@mritify.online or WhatsApp +91 94708 80956.',
          timestamp: now
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="lead-chat-launcher"
          aria-label="Open Quick Inquiry Chat"
          title="Ask a Quick Question / Hire Mritunjay"
        >
          <div className="lead-chat-badge-pulse" />
          <MessageSquare size={18} />
          <span className="lead-chat-launcher-text">Quick Inquiry</span>
        </button>
      )}

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div className="lead-chat-window" role="dialog" aria-label="Freelance Quick Chat">
          {/* Header */}
          <div className="lead-chat-header">
            <div className="lead-chat-header-info">
              <div className="lead-chat-avatar-wrap">
                <img src="/assets/profile1.jpg" alt="Mritunjay Kumar" className="lead-chat-avatar" />
                <span className="lead-chat-online-dot" />
              </div>
              <div>
                <h4 className="lead-chat-name">Mritunjay Kumar</h4>
                <p className="lead-chat-status">🟢 Online · Quick Lead Capture</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lead-chat-close-btn"
              aria-label="Close chat window"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="lead-chat-messages">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`lead-chat-msg-row ${m.sender === 'user' ? 'msg-user' : 'msg-assistant'}`}
              >
                <div className="lead-chat-msg-bubble">
                  <p>{m.text}</p>
                  <span className="lead-chat-timestamp">{m.timestamp}</span>
                </div>
              </div>
            ))}

            {/* Quick Prompts when in question step */}
            {step === 'question' && (
              <div className="lead-chat-prompts-wrap">
                <span className="lead-chat-prompts-label">Quick topics:</span>
                <div className="lead-chat-prompts-grid">
                  {QUICK_PROMPTS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPrompt(p.text)}
                      className="lead-chat-prompt-pill"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Contact collection card */}
            {step === 'contact' && (
              <form onSubmit={handleSendContact} className="lead-chat-contact-form">
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>
                  📬 How should Mritunjay contact you?
                </div>
                <input
                  type="text"
                  placeholder="Your Name (Optional)"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="lead-chat-input"
                  style={{ marginBottom: '6px' }}
                />
                <input
                  type="text"
                  placeholder="Your Email or WhatsApp number *"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  required
                  className="lead-chat-input"
                  style={{ marginBottom: '8px' }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '0.55rem', fontSize: '0.82rem' }}
                >
                  <span>{loading ? 'Sending…' : 'Submit Quick Inquiry'}</span>
                  <Send size={13} />
                </button>
              </form>
            )}

            {/* Step 3: Success Action Row */}
            {step === 'sent' && (
              <div className="lead-chat-success-actions">
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Need an immediate reply?
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <a
                    href="https://wa.me/919470880956"
                    target="_blank"
                    rel="noreferrer"
                    className="lead-chat-action-link"
                    style={{ background: 'rgba(34, 197, 94, 0.12)', color: '#22c55e', borderColor: 'rgba(34, 197, 94, 0.3)' }}
                  >
                    <Phone size={12} /> WhatsApp Direct
                  </a>
                  <a
                    href="mailto:me@mritify.online"
                    className="lead-chat-action-link"
                  >
                    <Mail size={12} /> Email Direct
                  </a>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer for Step 1 */}
          {step === 'question' && (
            <form onSubmit={handleSendQuestion} className="lead-chat-footer">
              <input
                type="text"
                placeholder="Ask about project, tech stack, rates..."
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                className="lead-chat-text-input"
              />
              <button
                type="submit"
                disabled={!inputQuestion.trim()}
                className="lead-chat-send-btn"
                aria-label="Send question"
              >
                <Send size={14} />
              </button>
            </form>
          )}

          {/* Reset Action */}
          {step !== 'question' && (
            <div className="lead-chat-bottom-bar">
              <button
                type="button"
                onClick={() => {
                  setStep('question');
                  setCapturedQuestion('');
                  setContactInfo('');
                }}
                className="lead-chat-reset-btn"
              >
                ← Ask another question
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
