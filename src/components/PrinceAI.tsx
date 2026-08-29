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
    <section id="prince-ai" className="section prince-ai" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
      <div className="container prince-ai-shell" style={{ width: '100%', maxWidth: '1200px', boxSizing: 'border-box' }}>
        <div className="section-eyebrow"><Sparkles size={14} /> Differentiator Feature</div>
        <h2 className="section-title reveal visible" style={{ color: 'var(--text)' }}>AI Portfolio <span className="grad">Assistant</span></h2>
        <p className="section-sub reveal visible" style={{ color: 'var(--text-muted)' }}>
          Instead of scrolling through text, ask <strong>Prince AI</strong> anything about Mritunjay's projects, architecture, skills, and why to hire him.
        </p>

        <div className="prince-ai-grid" style={{ width: '100%', boxSizing: 'border-box' }}>
          {/* Left Panel: Intro & Interactive Prompt Chips */}
          <article className="ai-panel ai-intro reveal visible" style={{ minWidth: 0, boxSizing: 'border-box' }}>
            <p className="ai-kicker">Interactive Prompts</p>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)', margin: '0.25rem 0 0.75rem' }}>
              Quick Questions:
            </h3>
            
            <div className="ai-mandatory-chips-list" style={{ display: 'grid', gap: '0.5rem' }}>
              {MANDATORY_PROMPT_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip)}
                  className="ai-chip-prompt-btn"
                  style={{
                    textAlign: 'left',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--surface-2)',
                    color: 'var(--text)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '6px',
                    transition: 'all 0.2s ease',
                    minWidth: 0,
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>💬 {chip}</span>
                  <ArrowRight size={13} style={{ flexShrink: 0, color: 'var(--text-muted)' }} />
                </button>
              ))}
            </div>
          </article>

          {/* Right Panel: Live Chat Box */}
          <article 
            className="ai-panel ai-preview reveal reveal-right visible" 
            style={{ 
              minWidth: 0, 
              boxSizing: 'border-box',
              ...(isFullScreen ? { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, borderRadius: 0, display: 'flex', flexDirection: 'column' } : {}) 
            }}
          >
            <div className="ai-preview-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)', marginBottom: '0.75rem' }}>
              <div>
                <p className="ai-kicker" style={{ margin: 0, fontSize: '0.72rem' }}>Interactive Assistant</p>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)', margin: '2px 0 0' }}>Talk to Prince AI</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="ai-live-dot" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ready</span>
                <button 
                  onClick={() => setIsFullScreen(!isFullScreen)} 
                  className="ai-action-btn"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '6px', padding: '4px 6px', cursor: 'pointer', color: 'var(--text)' }}
                  aria-label={isFullScreen ? "Minimize" : "Maximize"}
                >
                  {isFullScreen ? <Minimize size={15} /> : <Maximize size={15} />}
                </button>
              </div>
            </div>

            <div 
              className="ai-chat" 
              ref={chatRef} 
              style={{ 
                minHeight: isFullScreen ? '0' : '300px', 
                maxHeight: isFullScreen ? 'none' : '440px', 
                flex: isFullScreen ? 1 : 'none', 
                overflowY: 'auto',
                overflowX: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                paddingRight: '4px',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              {messages.map((msg, i) => (
                <div key={i} className={`ai-message ${msg.role === 'user' ? 'ai-message-user' : 'ai-message-ai'}`} style={{ minWidth: 0, maxWidth: '94%', boxSizing: 'border-box' }}>
                  {msg.role === 'assistant' && (
                    <div className="ai-avatar-label" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
                      <Bot size={13} /> Prince AI
                    </div>
                  )}
                  {msg.content ? (
                    msg.role === 'assistant' ? (
                      <div className="ai-markdown-content" style={{ minWidth: 0, overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                        {msg.content && (!isLoading || i !== messages.length - 1) && (
                          <div className="ai-message-actions" style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                            <button onClick={() => handleCopy(msg.content, i)} title="Copy response" className="ai-action-btn">
                              {copiedIndex === i ? <Check size={13} /> : <Copy size={13} />}
                              <span>{copiedIndex === i ? 'Copied' : 'Copy'}</span>
                            </button>
                            <button onClick={() => handleShare(msg.content)} title="Share response" className="ai-action-btn">
                              <Share2 size={13} />
                              <span>Share</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="ai-user-content" style={{ minWidth: 0, overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                        {msg.image && <img src={msg.image} alt="User Upload" className="ai-message-img" />}
                        {msg.content && <p style={{ margin: 0 }}>{msg.content}</p>}
                      </div>
                    )
                  ) : (
                    <div className="ai-typing"><span /><span /><span /></div>
                  )}
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="ai-input-container" style={{ width: '100%', boxSizing: 'border-box', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
              {selectedImage && (
                <div className="ai-image-preview">
                  <img src={selectedImage} alt="Preview" />
                  <button onClick={() => setSelectedImage(null)} className="ai-image-remove" aria-label="Remove image">
                    <X size={14} />
                  </button>
                </div>
              )}
              <div className="ai-input-row" style={{ width: '100%', boxSizing: 'border-box', minWidth: 0 }}>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageSelect} style={{ display: 'none' }} />
                <button className="ai-attach-btn" onClick={() => fileInputRef.current?.click()} aria-label="Attach Image" type="button">
                  <Paperclip size={16} />
                </button>
                <input 
                  ref={inputRef} 
                  type="text" 
                  placeholder="Ask Prince AI anything..." 
                  value={input} 
                  onChange={e => setInput(e.target.value)} 
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} 
                  disabled={isLoading} 
                  style={{ minWidth: 0, flex: 1, width: '100%' }}
                />
                <button className="ai-send-btn" onClick={() => handleSend()} disabled={isLoading || (!input.trim() && !selectedImage)} aria-label="Send" type="button">
                  <SendHorizonal size={15} />
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}