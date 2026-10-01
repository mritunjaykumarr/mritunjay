import {
  useState, useRef, useEffect, useCallback,
  type ReactNode, type RefObject, type ChangeEvent,
  type ClipboardEvent, type KeyboardEvent,
} from 'react';
import { createPortal } from 'react-dom';
import {
  Bot, Send, Copy, Check, Download, RefreshCw, Paperclip, X,
  Maximize2, Minimize2, ThumbsUp, ThumbsDown, MessageSquare,
  Code2, FileText, Languages, Wand2, AlertTriangle, Sparkles,
  ChevronRight, Rocket, Plus, Image as ImageIcon, History, Trash2,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { streamPrinceAIChat, type ChatMessage } from '../lib/princeAiService';
import {
  listSessions, createSession, updateSession, deleteSession, deriveTitle,
  type ChatSession,
} from '../lib/princeChatStore';

/* Relative "time ago" for the history list */
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

/* ———————————————————————————————————————
   Suggestions & Quick Actions
   ——————————————————————————————————————— */
const SUGGESTIONS = [
  { icon: Sparkles, title: 'What can you do?', prompt: 'What can you do? What questions can I ask you?', desc: 'Explore capabilities' },
  { icon: Rocket, title: 'Show projects', prompt: "Show me Mritunjay's best projects with their technical architecture and live links.", desc: 'Featured work & code' },
  { icon: Code2, title: 'Skills & stack', prompt: 'What technologies and frameworks does Mritunjay specialize in?', desc: 'Technical expertise' },
  { icon: MessageSquare, title: 'Why hire him?', prompt: 'Why should an engineering team hire Mritunjay Kumar? What makes him stand out?', desc: 'Value proposition' },
];

interface QuickAction {
  id: string;
  icon: typeof Code2;
  label: string;
  /** text prefilled into the composer, or 'attach' to open the file picker */
  prefill?: string;
  attach?: boolean;
}

// Only actions the current chat backend genuinely supports (freeform prompt + image
// attach). Web Search / Document upload are intentionally omitted — no faked modes.
const QUICK_ACTIONS: QuickAction[] = [
  { id: 'ask', icon: MessageSquare, label: 'Ask Anything', prefill: '' },
  { id: 'code', icon: Code2, label: 'Code', prefill: 'Write code for the following:\n' },
  { id: 'image', icon: ImageIcon, label: 'Image', attach: true },
  { id: 'summarize', icon: FileText, label: 'Summarize', prefill: 'Summarize the following:\n' },
  { id: 'fix', icon: AlertTriangle, label: 'Fix Error', prefill: 'Help me fix this error:\n' },
  { id: 'improve', icon: Wand2, label: 'Improve', prefill: 'Improve and refactor this:\n' },
  { id: 'translate', icon: Languages, label: 'Translate', prefill: 'Translate the following to English:\n' },
];

/* ———————————————————————————————————————
   Code block — dark, with language label + copy
   ——————————————————————————————————————— */
function CodeBlock({ children }: { children?: ReactNode }) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  // The immediate child is a <code> element from react-markdown.
  const codeEl = Array.isArray(children) ? children[0] : children;
  const className: string =
    (codeEl && typeof codeEl === 'object' && 'props' in codeEl
      ? (codeEl as { props?: { className?: string } }).props?.className
      : '') || '';
  const langMatch = /language-([\w-]+)/.exec(className);
  const lang = langMatch ? langMatch[1] : 'code';

  const copy = () => {
    const text = preRef.current?.innerText ?? '';
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="pai-codeblock">
      <div className="pai-codeblock-bar">
        <span className="pai-codeblock-lang">{lang}</span>
        <button type="button" className="pai-codeblock-copy" onClick={copy} aria-label="Copy code">
          {copied ? <Check size={12} /> : <Copy size={12} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre ref={preRef}>{children}</pre>
    </div>
  );
}

const MARKDOWN_COMPONENTS = {
  pre: ({ children }: { children?: ReactNode }) => <CodeBlock>{children}</CodeBlock>,
};

/* ———————————————————————————————————————
   Single message row (user or assistant)
   ——————————————————————————————————————— */
interface MessageItemProps {
  msg: ChatMessage;
  index: number;
  isLast: boolean;
  isLoading: boolean;
  copiedIndex: number | null;
  feedback: Record<number, 'up' | 'down'>;
  onCopy: (text: string, index: number) => void;
  onExport: (text: string) => void;
  onRegenerate: (index: number) => void;
  onFeedback: (index: number, dir: 'up' | 'down') => void;
}

function MessageItem({
  msg, index, isLast, isLoading, copiedIndex, feedback,
  onCopy, onExport, onRegenerate, onFeedback,
}: MessageItemProps) {
  const isUser = msg.role === 'user';
  const showActions = !isUser && msg.content && (!isLoading || !isLast);

  return (
    <div className={`pai-msg ${isUser ? 'pai-msg-user' : 'pai-msg-ai'}`}>
      {!isUser && (
        <div className="pai-msg-avatar" aria-hidden="true">
          <Bot size={14} />
        </div>
      )}

      <div className="pai-msg-body">
        {msg.image && <img src={msg.image} alt="Attachment" className="pai-msg-img" />}

        {msg.content ? (
          <div className="pai-bubble">
            {isUser ? (
              <p>{msg.content}</p>
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={MARKDOWN_COMPONENTS}>
                {msg.content}
              </ReactMarkdown>
            )}
          </div>
        ) : (
          <div className="pai-typing" aria-label="Prince AI is typing">
            <span /><span /><span />
          </div>
        )}

        {showActions && (
          <div className="pai-msg-actions">
            <button onClick={() => onCopy(msg.content, index)} className="pai-action-chip" title="Copy" aria-label="Copy response">
              {copiedIndex === index ? <Check size={13} /> : <Copy size={13} />}
              <span className="pai-action-lbl">{copiedIndex === index ? 'Copied' : 'Copy'}</span>
            </button>
            <button onClick={() => onExport(msg.content)} className="pai-action-chip" title="Export as Markdown" aria-label="Export response">
              <Download size={13} />
              <span className="pai-action-lbl">Export</span>
            </button>
            <button
              onClick={() => onRegenerate(index)}
              className="pai-action-chip"
              title="Regenerate"
              aria-label="Regenerate response"
              disabled={isLoading}
            >
              <RefreshCw size={13} />
              <span className="pai-action-lbl">Regenerate</span>
            </button>
            <span className="pai-action-sep" aria-hidden="true" />
            <button
              onClick={() => onFeedback(index, 'up')}
              className={`pai-action-chip pai-action-icon ${feedback[index] === 'up' ? 'pai-fb-up' : ''}`}
              title="Helpful"
              aria-label="Mark helpful"
              aria-pressed={feedback[index] === 'up'}
            >
              <ThumbsUp size={13} />
            </button>
            <button
              onClick={() => onFeedback(index, 'down')}
              className={`pai-action-chip pai-action-icon ${feedback[index] === 'down' ? 'pai-fb-down' : ''}`}
              title="Not helpful"
              aria-label="Mark not helpful"
              aria-pressed={feedback[index] === 'down'}
            >
              <ThumbsDown size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ———————————————————————————————————————
   Welcome / empty state
   ——————————————————————————————————————— */
function WelcomeScreen({
  onPrompt, onFocusComposer, isLoading,
}: {
  onPrompt: (p: string) => void;
  onFocusComposer: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="pai-welcome">
      <div className="pai-welcome-head">
        <div className="pai-welcome-avatar" aria-hidden="true">
          <Bot size={22} />
        </div>
        <h2 className="pai-welcome-title">How can I help you today?</h2>
        <p className="pai-welcome-desc">
          I'm Prince AI, trained by Mritify on Mritunjay's portfolio, projects, and engineering
          background. Ask about his work, tech stack, or any software question.
        </p>
      </div>

      <div className="pai-suggestions-grid">
        {SUGGESTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.title}
              className="pai-suggestion-card"
              onClick={() => onPrompt(s.prompt)}
              disabled={isLoading}
            >
              <span className="pai-sug-icon" aria-hidden="true"><Icon size={16} /></span>
              <span className="pai-sug-text">
                <span className="pai-sug-title">{s.title}</span>
                <span className="pai-sug-desc">{s.desc}</span>
              </span>
              <ChevronRight size={15} className="pai-sug-arrow" aria-hidden="true" />
            </button>
          );
        })}
      </div>

      <button className="pai-welcome-start" onClick={onFocusComposer}>
        <MessageSquare size={15} />
        <span>Start a conversation</span>
      </button>
    </div>
  );
}

/* ———————————————————————————————————————
   Quick action strip (pills, above composer)
   ——————————————————————————————————————— */
function QuickActionBar({ onAction }: { onAction: (a: QuickAction) => void }) {
  return (
    <div className="pai-quickbar" role="toolbar" aria-label="Quick actions">
      {QUICK_ACTIONS.map((a) => {
        const Icon = a.icon;
        return (
          <button
            key={a.id}
            type="button"
            className="pai-quickbar-pill"
            onClick={() => onAction(a)}
          >
            <Icon size={14} />
            <span>{a.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ———————————————————————————————————————
   Chat history panel (saved sessions)
   ——————————————————————————————————————— */
function SessionList({
  sessions, currentSessionId, onNewChat, onLoad, onDelete, onClose,
}: {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onNewChat: () => void;
  onLoad: (s: ChatSession) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <>
      <div className="pai-history-backdrop" onClick={onClose} aria-hidden="true" />
      <aside className="pai-history" aria-label="Chat history">
        <div className="pai-history-head">
          <span className="pai-history-title">Chats</span>
          <button className="pai-history-close" onClick={onClose} aria-label="Close history">
            <X size={15} />
          </button>
        </div>

        <button className="pai-history-new" onClick={onNewChat}>
          <Plus size={15} />
          <span>New chat</span>
        </button>

        <div className="pai-history-list">
          {sessions.length === 0 ? (
            <p className="pai-history-empty">No saved chats yet. Your conversations appear here.</p>
          ) : (
            sessions.map((s) => (
              <div
                key={s.id}
                className={`pai-history-item ${s.id === currentSessionId ? 'is-active' : ''}`}
              >
                <button className="pai-history-item-main" onClick={() => onLoad(s)}>
                  <MessageSquare size={14} className="pai-history-item-icon" />
                  <span className="pai-history-item-text">
                    <span className="pai-history-item-title">{s.title}</span>
                    <span className="pai-history-item-time">{timeAgo(s.updated_at)}</span>
                  </span>
                </button>
                <button
                  className="pai-history-item-del"
                  onClick={() => onDelete(s.id)}
                  title="Delete chat"
                  aria-label={`Delete chat: ${s.title}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
}

/* ———————————————————————————————————————
   Shared chat surface (header + body + quickbar + composer)
   Rendered identically in embedded and maximized variants.
   ——————————————————————————————————————— */
interface SurfaceProps {
  variant: 'embedded' | 'maximized';
  messages: ChatMessage[];
  input: string;
  isLoading: boolean;
  selectedImage: string | null;
  copiedIndex: number | null;
  feedback: Record<number, 'up' | 'down'>;
  chatRef: RefObject<HTMLDivElement | null>;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  fileInputRef: RefObject<HTMLInputElement | null>;
  maximizeBtnRef: RefObject<HTMLButtonElement | null>;
  onInputChange: (v: string) => void;
  onKeyDown: (e: KeyboardEvent) => void;
  onPaste: (e: ClipboardEvent) => void;
  onImageSelect: (e: ChangeEvent<HTMLInputElement>) => void;
  onSend: (text?: string) => void;
  onNewChat: () => void;
  onQuickAction: (a: QuickAction) => void;
  onPrompt: (p: string) => void;
  onFocusComposer: () => void;
  onCopy: (text: string, index: number) => void;
  onExport: (text: string) => void;
  onRegenerate: (index: number) => void;
  onFeedback: (index: number, dir: 'up' | 'down') => void;
  onRemoveImage: () => void;
  onMaximize: () => void;
  onRestore: () => void;
  sessions: ChatSession[];
  currentSessionId: string | null;
  historyOpen: boolean;
  onToggleHistory: () => void;
  onCloseHistory: () => void;
  onLoadSession: (s: ChatSession) => void;
  onDeleteSession: (id: string) => void;
}

function PrinceChatSurface(props: SurfaceProps) {
  const {
    variant, messages, input, isLoading, selectedImage, copiedIndex, feedback,
    chatRef, textareaRef, fileInputRef, maximizeBtnRef,
    onInputChange, onKeyDown, onPaste, onImageSelect, onSend, onNewChat,
    onQuickAction, onPrompt, onFocusComposer, onCopy, onExport, onRegenerate,
    onFeedback, onRemoveImage, onMaximize, onRestore,
    sessions, currentSessionId, historyOpen, onToggleHistory, onCloseHistory,
    onLoadSession, onDeleteSession,
  } = props;

  const hasMessages = messages.length > 0;
  const isMax = variant === 'maximized';
  const canSend = (input.trim() || selectedImage) && !isLoading;

  return (
    <div className={`pai-surface pai-surface--${variant}`} onPaste={onPaste}>
      {/* ── Header ── */}
      <header className="pai-header">
        <div className="pai-header-left">
          <div className="pai-avatar" aria-hidden="true"><Bot size={18} /></div>
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
          <button
            className={`pai-icon-btn ${historyOpen ? 'is-active' : ''}`}
            onClick={onToggleHistory}
            title="Chat history"
            aria-label="Chat history"
            aria-pressed={historyOpen}
          >
            <History size={16} />
            <span className="pai-btn-label">History</span>
            {sessions.length > 0 && <span className="pai-history-count">{sessions.length}</span>}
          </button>

          <button className="pai-icon-btn" onClick={onNewChat} title="New Chat" aria-label="New chat">
            <Plus size={16} />
            <span className="pai-btn-label">New Chat</span>
          </button>

          {isMax ? (
            <>
              <button className="pai-icon-btn pai-icon-only" onClick={onRestore} title="Restore" aria-label="Restore to embedded view">
                <Minimize2 size={16} />
              </button>
              <button className="pai-icon-btn pai-icon-only" onClick={onRestore} title="Close" aria-label="Close workspace">
                <X size={17} />
              </button>
            </>
          ) : (
            <button
              ref={maximizeBtnRef}
              className="pai-icon-btn pai-icon-only"
              onClick={onMaximize}
              title="Maximize"
              aria-label="Maximize Prince AI"
            >
              <Maximize2 size={16} />
            </button>
          )}
        </div>
      </header>

      {/* ── Chat history panel ── */}
      {historyOpen && (
        <SessionList
          sessions={sessions}
          currentSessionId={currentSessionId}
          onNewChat={onNewChat}
          onLoad={onLoadSession}
          onDelete={onDeleteSession}
          onClose={onCloseHistory}
        />
      )}

      {/* ── Scrollable body ── */}
      <div className="pai-body" ref={chatRef}>
        {!hasMessages ? (
          <WelcomeScreen onPrompt={onPrompt} onFocusComposer={onFocusComposer} isLoading={isLoading} />
        ) : (
          <div className={`pai-thread ${isMax ? 'pai-thread--wide' : ''}`}>
            {messages.map((msg, i) => (
              <MessageItem
                key={i}
                msg={msg}
                index={i}
                isLast={i === messages.length - 1}
                isLoading={isLoading}
                copiedIndex={copiedIndex}
                feedback={feedback}
                onCopy={onCopy}
                onExport={onExport}
                onRegenerate={onRegenerate}
                onFeedback={onFeedback}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Composer (quickbar + input) ── */}
      <footer className="pai-composer">
        <div className={`pai-composer-inner ${isMax ? 'pai-composer-inner--wide' : ''}`}>
          <QuickActionBar onAction={onQuickAction} />

          {selectedImage && (
            <div className="pai-attach-preview">
              <img src={selectedImage} alt="Attached screenshot" />
              <span className="pai-attach-label">Screenshot attached</span>
              <button onClick={onRemoveImage} className="pai-attach-remove" title="Remove attachment" aria-label="Remove attachment">
                <X size={12} />
              </button>
            </div>
          )}

          <div className="pai-input-wrap">
            <input type="file" accept="image/*" ref={fileInputRef} onChange={onImageSelect} hidden />
            <button
              className="pai-composer-btn"
              onClick={() => fileInputRef.current?.click()}
              title="Attach image or screenshot (or press Ctrl+V)"
              aria-label="Attach image"
            >
              <Paperclip size={17} />
            </button>

            <textarea
              ref={textareaRef}
              className="pai-textarea"
              placeholder="Ask Prince AI anything (or paste screenshot with Ctrl+V)..."
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={onKeyDown}
              onPaste={onPaste}
              disabled={isLoading}
              rows={1}
            />

            <button
              className={`pai-send-btn ${canSend ? 'pai-send-active' : ''}`}
              onClick={() => onSend()}
              disabled={!canSend}
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>

          <p className="pai-disclaimer">
            Prince AI is trained by Mritify on Mritunjay's verified portfolio data.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ———————————————————————————————————————
   Main PrinceAI — single state owner for both states
   ——————————————————————————————————————— */
interface PrinceAIProps {
  fullPage?: boolean;
}

export default function PrinceAI({ fullPage = false }: PrinceAIProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Record<number, 'up' | 'down'>>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);

  // Saved chat history (Supabase, anonymous device-scoped)
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maximizeBtnRef = useRef<HTMLButtonElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const wasMaximized = useRef(false);
  const messagesRef = useRef<ChatMessage[]>([]);
  const currentSessionRef = useRef<string | null>(null);

  /* ——— Keep refs in sync (used by persist after streaming) ——— */
  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { currentSessionRef.current = currentSessionId; }, [currentSessionId]);

  /* ——— Load saved history once; restore most recent conversation ——— */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const loaded = await listSessions();
      if (cancelled) return;
      setSessions(loaded);
      if (loaded.length > 0) {
        setMessages(loaded[0].messages ?? []);
        setCurrentSessionId(loaded[0].id);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  /* ——— Auto-scroll to newest ——— */
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, isLoading, isMaximized]);

  /* ——— Auto-resize textarea ——— */
  const resizeTextarea = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
  }, []);
  useEffect(() => { resizeTextarea(); }, [input, isMaximized, resizeTextarea]);

  /* ——— Maximize: scroll-lock, Escape, focus trap ——— */
  useEffect(() => {
    if (!isMaximized) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const ws = workspaceRef.current;
    // Focus the workspace so Escape / tab-trapping work immediately.
    requestAnimationFrame(() => ws?.focus());

    const handleKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsMaximized(false);
        return;
      }
      if (e.key === 'Tab' && ws) {
        const focusables = ws.querySelectorAll<HTMLElement>(
          'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        const list = Array.from(focusables).filter((el) => !el.hasAttribute('disabled'));
        if (list.length === 0) return;
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isMaximized]);

  /* ——— Return focus to Maximize button after restore ——— */
  useEffect(() => {
    if (!isMaximized && wasMaximized.current) {
      requestAnimationFrame(() => maximizeBtnRef.current?.focus());
    }
    wasMaximized.current = isMaximized;
  }, [isMaximized]);

  /* ——— Image attachment & paste (Ctrl+V) ——— */
  const readImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => setSelectedImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };
  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readImage(file);
  };
  const handlePaste = (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          e.preventDefault();
          readImage(file);
          break;
        }
      }
    }
  };

  /* ——— Response actions ——— */
  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };
  const handleExport = (text: string) => {
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prince-ai-response-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };
  const handleFeedback = (index: number, dir: 'up' | 'down') => {
    setFeedback((prev) => ({ ...prev, [index]: prev[index] === dir ? undefined as never : dir }));
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
    setSelectedImage(null);
    setFeedback({});
    setCurrentSessionId(null);
    setHistoryOpen(false);
  };

  /* ——— Persist the finished conversation to Supabase history ——— */
  const persist = async (finalMessages: ChatMessage[]) => {
    if (finalMessages.length === 0) return;
    const sid = currentSessionRef.current;
    if (sid) {
      await updateSession(sid, finalMessages);
      const now = new Date().toISOString();
      setSessions((prev) =>
        prev
          .map((s) =>
            s.id === sid
              ? { ...s, messages: finalMessages, title: deriveTitle(finalMessages), updated_at: now }
              : s
          )
          .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
      );
    } else {
      const created = await createSession(finalMessages);
      if (created) {
        setCurrentSessionId(created.id);
        setSessions((prev) => [created, ...prev]);
      }
    }
  };

  /* ——— Streaming (shared by send + regenerate) ——— */
  const runStream = async (convo: ChatMessage[]): Promise<ChatMessage[]> => {
    setMessages([...convo, { role: 'assistant', content: '' }]);
    setIsLoading(true);
    let assistantContent = '';
    await streamPrinceAIChat(
      convo,
      (chunk) => {
        assistantContent += chunk;
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
        assistantContent = `⚠️ ${err}`;
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
    return [...convo, { role: 'assistant', content: assistantContent }];
  };

  const handleSend = async (text?: string) => {
    const userMessage = (text ?? input).trim();
    if ((!userMessage && !selectedImage) || isLoading) return;

    const convo: ChatMessage[] = [
      ...messages,
      { role: 'user', content: userMessage, image: selectedImage || undefined },
    ];
    setInput('');
    setSelectedImage(null);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    const finalMessages = await runStream(convo);
    await persist(finalMessages);
  };

  const handleRegenerate = async (assistantIndex: number) => {
    if (isLoading) return;
    const userIdx = assistantIndex - 1;
    if (userIdx < 0 || messages[userIdx]?.role !== 'user') return;
    // Drop this assistant answer (and anything after) then re-run from the user turn.
    const finalMessages = await runStream(messages.slice(0, assistantIndex));
    await persist(finalMessages);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const focusComposer = () => {
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const handlePrompt = (p: string) => handleSend(p);

  const handleQuickAction = (a: QuickAction) => {
    if (a.attach) {
      fileInputRef.current?.click();
      return;
    }
    setInput(a.prefill ?? '');
    focusComposer();
  };

  /* ——— History: load / delete / toggle ——— */
  const handleLoadSession = (s: ChatSession) => {
    setMessages(s.messages ?? []);
    setCurrentSessionId(s.id);
    setInput('');
    setSelectedImage(null);
    setFeedback({});
    setHistoryOpen(false);
  };

  const handleDeleteSession = async (id: string) => {
    await deleteSession(id);
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (id === currentSessionId) {
      setMessages([]);
      setInput('');
      setSelectedImage(null);
      setFeedback({});
      setCurrentSessionId(null);
    }
  };

  /* ——— Shared props for the surface ——— */
  const surfaceProps = {
    messages, input, isLoading, selectedImage, copiedIndex, feedback,
    chatRef, textareaRef, fileInputRef, maximizeBtnRef,
    onInputChange: setInput,
    onKeyDown: handleKeyDown,
    onPaste: handlePaste,
    onImageSelect: handleImageSelect,
    onSend: handleSend,
    onNewChat: handleNewChat,
    onQuickAction: handleQuickAction,
    onPrompt: handlePrompt,
    onFocusComposer: focusComposer,
    onCopy: handleCopy,
    onExport: handleExport,
    onRegenerate: handleRegenerate,
    onFeedback: handleFeedback,
    onRemoveImage: () => setSelectedImage(null),
    onMaximize: () => setIsMaximized(true),
    onRestore: () => setIsMaximized(false),
    sessions,
    currentSessionId,
    historyOpen,
    onToggleHistory: () => setHistoryOpen((v) => !v),
    onCloseHistory: () => setHistoryOpen(false),
    onLoadSession: handleLoadSession,
    onDeleteSession: handleDeleteSession,
  };

  return (
    <>
      {/* Embedded card — kept mounted only while not maximized */}
      {!isMaximized && (
        <div className={`pai-embed ${fullPage ? 'pai-embed--fullpage' : ''}`}>
          <PrinceChatSurface variant="embedded" {...surfaceProps} />
        </div>
      )}

      {/* Maximized workspace — same state, rendered through a portal */}
      {isMaximized &&
        createPortal(
          <div
            className="pai-overlay"
            onClick={() => setIsMaximized(false)}
          >
            <div
              className="pai-workspace"
              ref={workspaceRef}
              role="dialog"
              aria-modal="true"
              aria-label="Prince AI workspace"
              tabIndex={-1}
              onClick={(e) => e.stopPropagation()}
            >
              <PrinceChatSurface variant="maximized" {...surfaceProps} />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
