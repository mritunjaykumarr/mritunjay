import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bot, Send, Copy, Check, Share2, Paperclip, X,
  Sparkles, Maximize, Minimize, RotateCcw, ThumbsUp,
  User, Rocket, FileText, Mail,
  Code2, MessageSquare, ChevronRight
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { streamPrinceAIChat, type ChatMessage } from '../lib/princeAiService';

/* ———————————————————————————————————————
   Prompt Suggestions & Quick Actions Data
   ——————————————————————————————————————— */
const SUGGESTIONS = [
  { emoji: '✨', title: 'What can you do?', prompt: 'What can you do? What questions can I ask you?', desc: 'Explore my capabilities' },
  { emoji: '👤', title: 'About Mritunjay', prompt: 'Tell me about Mritunjay Kumar — his background, role, and what drives him as an engineer.', desc: 'Background & journey' },
  { emoji: '🚀', title: 'Show projects', prompt: 'Show me Mritunjay\'s best projects with their technical architecture and live links.', desc: 'Featured work & code' },
  { emoji: '🛠️', title: 'Skills & stack', prompt: 'What technologies and frameworks does Mritunjay specialize in?', desc: 'Technical expertise' },
  { emoji: '💼', title: 'Experience', prompt: 'Tell me about Mritunjay\'s professional experience and roles.', desc: 'Career & growth' },
  { emoji: '💡', title: 'Why hire him?', prompt: 'Why should an engineering team hire Mritunjay Kumar? What makes him stand out?', desc: 'Value proposition' },
];

const QUICK_ACTIONS = [
  { icon: User, label: 'About', prompt: 'Tell me about Mritunjay Kumar' },
  { icon: Rocket, label: 'Projects', prompt: 'Show me the best projects' },
  { icon: FileText, label: 'Resume', prompt: 'How can I download Mritunjay\'s resume?' },
  { icon: Mail, label: 'Contact', prompt: 'How can I contact Mritunjay?' },
];

/* ———————————————————————————————————————
   Robot SVG Illustration (inline)
   ——————————————————————————————————————— */
function RobotIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="botGrad" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ff6b35" stopOpacity="0.3" />
          <stop offset="1" stopColor="#f7931e" stopOpacity="0.15" />
        </linearGradient>
        <radialGradient id="glowGrad" cx="100" cy="90" r="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ff6b35" stopOpacity="0.12" />
          <stop offset="1" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="90" r="78" fill="url(#glowGrad)" />
      <rect x="55" y="50" width="90" height="80" rx="20" fill="url(#botGrad)" stroke="rgba(255,107,53,0.35)" strokeWidth="1.5" />
      <circle cx="78" cy="82" r="10" fill="#ff6b35" opacity="0.7" />
      <circle cx="122" cy="82" r="10" fill="#f7931e" opacity="0.7" />
      <circle cx="78" cy="82" r="4" fill="#ffffff" />
      <circle cx="122" cy="82" r="4" fill="#ffffff" />
      <rect x="85" y="100" width="30" height="6" rx="3" fill="rgba(255,107,53,0.4)" />
      <rect x="90" y="36" width="4" height="18" rx="2" fill="rgba(255,107,53,0.5)" />
      <circle cx="92" cy="32" r="5" fill="#ff6b35" opacity="0.5" />
      <rect x="42" y="75" width="16" height="8" rx="4" fill="rgba(255,107,53,0.3)" />
      <rect x="142" y="75" width="16" height="8" rx="4" fill="rgba(255,107,53,0.3)" />
      <rect x="68" y="138" width="14" height="24" rx="6" fill="rgba(255,107,53,0.25)" />
      <rect x="118" y="138" width="14" height="24" rx="6" fill="rgba(255,107,53,0.25)" />
    </svg>
  );
}

/* ———————————————————————————————————————
   Main PrinceAI Component
   ——————————————————————————————————————— */
interface PrinceAIProps {
  fullPage?: boolean;
}

export default function PrinceAI({ fullPage = false }: PrinceAIProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [likedIndex, setLikedIndex] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const hasMessages = messages.length > 0;

  /* ——— Auto-scroll ——— */
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  /* ——— Auto-resize textarea ——— */
  const resizeTextarea = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 140) + 'px';
  }, []);

  useEffect(() => {
    resizeTextarea();
  }, [input, resizeTextarea]);

  /* ——— Image attachment ——— */
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setSelectedImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  /* ——— Actions ——— */
  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleLike = (index: number) => {
    setLikedIndex(prev => prev === index ? null : index);
  };

  const handleShare = async (text: string) => {
    const url = `${window.location.origin}/prince-ai`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Prince AI', text, url }); } catch { /* cancelled */ }
    } else {
      navigator.clipboard.writeText(`${text}\n\n${url}`);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setInput('');
    setSelectedImage(null);
  };

  /* ——— Send message ——— */
  const handleSend = async (text?: string) => {
    const userMessage = (text || input).trim();
    if ((!userMessage && !selectedImage) || isLoading) return;

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', content: userMessage, image: selectedImage || undefined },
    ];
    setMessages(newMessages);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    await streamPrinceAIChat(
      newMessages,
      (chunk) => {
        setMessages(prev => {
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
        setMessages(prev => {
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /* ——— Render ——— */
  return (
    <div
      ref={containerRef}
      className={`pai-root ${fullPage ? 'pai-fullpage' : ''} ${isFullScreen ? 'pai-fs' : ''}`}
    >
      {/* ═══════ HEADER ═══════ */}
      <header className="pai-header">
        <div className="pai-header-left">
          <div className="pai-avatar">
            <Bot size={18} />
          </div>
          <div className="pai-header-info">
            <div className="pai-header-name-row">
              <span className="pai-name">Prince AI</span>
              <span className="pai-badge">AI Assistant</span>
            </div>
            <span className="pai-trained">
              <span className="pai-dot" />
              Trained by Mritify
            </span>
          </div>
        </div>
        <div className="pai-header-right">
          {hasMessages && (
            <button className="pai-icon-btn" onClick={handleClearChat} title="New Chat" aria-label="New Chat">
              <RotateCcw size={15} />
              <span className="pai-btn-label">New Chat</span>
            </button>
          )}
          <button
            className="pai-icon-btn"
            onClick={() => setIsFullScreen(!isFullScreen)}
            title={isFullScreen ? 'Exit fullscreen' : 'Fullscreen'}
            aria-label="Toggle fullscreen"
          >
            {isFullScreen ? <Minimize size={15} /> : <Maximize size={15} />}
          </button>
        </div>
      </header>

      {/* ═══════ SCROLLABLE BODY ═══════ */}
      <div className="pai-body" ref={chatRef}>

        {/* ——— Welcome State ——— */}
        {!hasMessages && (
          <div className="pai-welcome">
            {/* Welcome Card */}
            <div className="pai-welcome-card">
              <div className="pai-welcome-visual">
                <RobotIllustration className="pai-robot-svg" />
              </div>
              <div className="pai-welcome-content">
                <div className="pai-welcome-avatar-sm">
                  <Bot size={20} />
                </div>
                <h2 className="pai-welcome-title">
                  Hello! I'm <span className="pai-gradient-text">Prince AI</span>
                </h2>
                <p className="pai-welcome-desc">
                  Mritunjay's personal AI assistant, fully trained by <strong>Mritify</strong> on his
                  portfolio, projects, skills, and engineering background. Ask me anything!
                </p>
                <div className="pai-welcome-actions">
                  <button className="pai-btn-primary" onClick={() => textareaRef.current?.focus()}>
                    <MessageSquare size={15} />
                    <span>Start Conversation</span>
                  </button>
                  <a href="/projects" className="pai-btn-ghost">
                    <Rocket size={15} />
                    <span>Explore Portfolio</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Suggestion Prompts */}
            <div className="pai-section-label">
              <Sparkles size={13} />
              <span>Suggested prompts</span>
            </div>
            <div className="pai-suggestions-grid">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  className="pai-suggestion-card"
                  onClick={() => handleSend(s.prompt)}
                  disabled={isLoading}
                >
                  <span className="pai-sug-emoji">{s.emoji}</span>
                  <div className="pai-sug-text">
                    <span className="pai-sug-title">{s.title}</span>
                    <span className="pai-sug-desc">{s.desc}</span>
                  </div>
                  <ChevronRight size={14} className="pai-sug-arrow" />
                </button>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="pai-section-label">
              <Code2 size={13} />
              <span>Quick actions</span>
            </div>
            <div className="pai-quick-actions">
              {QUICK_ACTIONS.map((qa, i) => {
                const Icon = qa.icon;
                return (
                  <button
                    key={i}
                    className="pai-quick-btn"
                    onClick={() => handleSend(qa.prompt)}
                    disabled={isLoading}
                  >
                    <Icon size={16} />
                    <span>{qa.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ——— Chat Messages ——— */}
        {hasMessages && (
          <div className="pai-thread">
            {messages.map((msg, i) => (
              <div key={i} className={`pai-msg ${msg.role === 'user' ? 'pai-msg-user' : 'pai-msg-ai'}`}>
                {/* AI avatar */}
                {msg.role === 'assistant' && (
                  <div className="pai-msg-avatar">
                    <Bot size={14} />
                  </div>
                )}

                <div className="pai-msg-body">
                  {/* Attached image */}
                  {msg.image && (
                    <img src={msg.image} alt="Attachment" className="pai-msg-img" />
                  )}

                  {/* Message content */}
                  {msg.content ? (
                    <div className="pai-bubble">
                      {msg.role === 'assistant' ? (
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      ) : (
                        <p>{msg.content}</p>
                      )}
                    </div>
                  ) : (
                    <div className="pai-typing">
                      <span /><span /><span />
                    </div>
                  )}

                  {/* AI message actions */}
                  {msg.role === 'assistant' && msg.content && (!isLoading || i !== messages.length - 1) && (
                    <div className="pai-msg-actions">
                      <button onClick={() => handleCopy(msg.content, i)} className="pai-action-chip">
                        {copiedIndex === i ? <Check size={12} /> : <Copy size={12} />}
                        <span>{copiedIndex === i ? 'Copied' : 'Copy'}</span>
                      </button>
                      <button onClick={() => handleShare(msg.content)} className="pai-action-chip">
                        <Share2 size={12} />
                        <span>Share</span>
                      </button>
                      <button onClick={() => handleLike(i)} className={`pai-action-chip ${likedIndex === i ? 'pai-liked' : ''}`}>
                        <ThumbsUp size={12} />
                        <span>{likedIndex === i ? 'Liked' : 'Helpful'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ═══════ COMPOSER ═══════ */}
      <footer className="pai-composer">
        {/* Image preview */}
        {selectedImage && (
          <div className="pai-attach-preview">
            <img src={selectedImage} alt="Attached" />
            <button onClick={() => setSelectedImage(null)} className="pai-attach-remove" aria-label="Remove attachment">
              <X size={12} />
            </button>
          </div>
        )}

        <div className="pai-input-wrap">
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageSelect} hidden />

          <button
            className="pai-composer-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Attach image"
            aria-label="Attach image"
          >
            <Paperclip size={17} />
          </button>

          <textarea
            ref={textareaRef}
            className="pai-textarea"
            placeholder="Ask Prince AI anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={1}
          />

          <button
            className={`pai-send-btn ${(input.trim() || selectedImage) && !isLoading ? 'pai-send-active' : ''}`}
            onClick={() => handleSend()}
            disabled={(!input.trim() && !selectedImage) || isLoading}
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </div>

        <p className="pai-disclaimer">
          Prince AI is trained by Mritify on Mritunjay's verified portfolio data.
        </p>
      </footer>
    </div>
  );
}