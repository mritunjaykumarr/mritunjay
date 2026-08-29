import { useState, useRef, useEffect } from 'react';
import { Bot, SendHorizonal, ArrowRight, Copy, Check, Share2, Paperclip, X, Sparkles, Maximize, Minimize } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { streamPrinceAIChat, type ChatMessage } from '../lib/princeAiService';

const MANDATORY_PROMPT_CHIPS = [
  'Show your best project',
  'What technologies do you know?',
  'Why should we hire you?',
  'Show your GitHub',
  'Explain your architecture',
];

export default function PrinceAI() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "👋 Hello! I'm **Prince AI** — Mritunjay Kumar's portfolio assistant. Click any prompt chip below or type your question to chat directly with my knowledge base!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setSelectedImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleShare = async (text: string) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#prince-ai`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Prince AI Response | Mritunjay Kumar',
          text: text,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Share failed', err);
      }
    } else {
      navigator.clipboard.writeText(`${text}\n\nShared from: ${shareUrl}`);
      alert('Response copied to clipboard!');
    }
  };

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async (text?: string) => {
    const userMessage = (text || input).trim();
    if ((!userMessage && !selectedImage) || isLoading) return;

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: userMessage, image: selectedImage || undefined }];
    setMessages(newMessages);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    await streamPrinceAIChat(
      newMessages,
      (chunk) => {
        setMessages(prev => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last?.role === 'assistant') updated[updated.length - 1] = { ...last, content: last.content + chunk };
          return updated;
        });
      },
      () => setIsLoading(false),
      (err) => {
        setMessages(prev => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last?.role === 'assistant') updated[updated.length - 1] = { ...last, content: `⚠️ ${err}` };
          return updated;
        });
        setIsLoading(false);
      }
    );
  };

  return (
    <section id="prince-ai" className="section prince-ai">
      <div className="container prince-ai-shell">
        <div className="section-eyebrow"><Sparkles size={14} /> Differentiator Feature</div>
        <h2 className="section-title reveal visible">AI Portfolio <span className="grad">Assistant</span></h2>
        <p className="section-sub reveal visible">
          Instead of scrolling through text, ask <strong>Prince AI</strong> anything about Mritunjay's projects, architecture, skills, and why to hire him.
        </p>

        <div className="prince-ai-grid">
          {/* Left Panel: Intro & Interactive Prompt Chips */}
          <article className="ai-panel ai-intro reveal visible">
            <p className="ai-kicker">Interactive Prompts</p>
            <h3>Click any question to ask Prince AI:</h3>
            
            <div className="ai-mandatory-chips-list" style={{ gap: '0.65rem', marginTop: '0.6rem' }}>
              {MANDATORY_PROMPT_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip)}
                  className="ai-chip-prompt-btn card-glass"
                  style={{
                    textAlign: 'left',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--r-sm)',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-elevated)',
                    color: 'var(--text)',
                    cursor: 'pointer',
                    fontSize: '0.92rem',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span>💬 {chip}</span>
                  <ArrowRight size={14} className="text-primary" />
                </button>
              ))}
            </div>
          </article>

          {/* Right Panel: Live Chat Box */}
          <article className="ai-panel ai-preview reveal reveal-right visible" style={{ ...(isFullScreen ? { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, borderRadius: 0, display: 'flex', flexDirection: 'column' } : {}) }}>
            <div className="ai-preview-head">
              <div>
                <p className="ai-kicker">Interactive Assistant</p>
                <h3>Talk to Prince AI</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span className="ai-live-dot">Knowledge Engine Ready</span>
                <button 
                  onClick={() => setIsFullScreen(!isFullScreen)} 
                  className="ai-action-btn"
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                  aria-label={isFullScreen ? "Minimize" : "Maximize"}
                >
                  {isFullScreen ? <Minimize size={18} /> : <Maximize size={18} />}
                </button>
              </div>
            </div>

            <div className="ai-chat" ref={chatRef} style={{ minHeight: isFullScreen ? '0' : '380px', maxHeight: isFullScreen ? 'none' : '480px', flex: isFullScreen ? 1 : 'none', overflowY: 'auto' }}>
              {messages.map((msg, i) => (
                <div key={i} className={`ai-message ${msg.role === 'user' ? 'ai-message-user' : 'ai-message-ai'}`}>
                  {msg.role === 'assistant' && <div className="ai-avatar-label"><Bot size={14} /> Prince AI</div>}
                  {msg.content ? (
                    msg.role === 'assistant' ? (
                      <div className="ai-markdown-content">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                        {msg.content && (!isLoading || i !== messages.length - 1) && (
                          <div className="ai-message-actions">
                            <button onClick={() => handleCopy(msg.content, i)} title="Copy response" className="ai-action-btn">
                              {copiedIndex === i ? <Check size={14} /> : <Copy size={14} />}
                              <span>{copiedIndex === i ? 'Copied' : 'Copy'}</span>
                            </button>
                            <button onClick={() => handleShare(msg.content)} title="Share response" className="ai-action-btn">
                              <Share2 size={14} />
                              <span>Share</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="ai-user-content">
                        {msg.image && <img src={msg.image} alt="User Upload" className="ai-message-img" />}
                        {msg.content && <p>{msg.content}</p>}
                      </div>
                    )
                  ) : (
                    <div className="ai-typing"><span /><span /><span /></div>
                  )}
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="ai-input-container">
              {selectedImage && (
                <div className="ai-image-preview">
                  <img src={selectedImage} alt="Preview" />
                  <button onClick={() => setSelectedImage(null)} className="ai-image-remove" aria-label="Remove image">
                    <X size={14} />
                  </button>
                </div>
              )}
              <div className="ai-input-row">
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageSelect} style={{ display: 'none' }} />
                <button className="ai-attach-btn" onClick={() => fileInputRef.current?.click()} aria-label="Attach Image">
                  <Paperclip size={16} />
                </button>
                <input 
                  ref={inputRef} 
                  type="text" 
                  placeholder="Ask Prince AI about architecture, tech stack..." 
                  value={input} 
                  onChange={e => setInput(e.target.value)} 
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} 
                  disabled={isLoading} 
                />
                <button className="ai-send-btn" onClick={() => handleSend()} disabled={isLoading || (!input.trim() && !selectedImage)} aria-label="Send">
                  <SendHorizonal size={16} />
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}