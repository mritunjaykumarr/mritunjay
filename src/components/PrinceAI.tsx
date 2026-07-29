import { useState, useRef, useEffect } from 'react';
import { Bot, SendHorizonal, ArrowRight, Copy, Check, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `You are Prince AI — a premium AI assistant embedded in Mritunjay Kumar's developer portfolio. You are sharp, helpful, and speak in a confident, modern tone. You help with:
- Product strategy and UX guidance
- Frontend development best practices (React, TypeScript, Next.js, Shopify)
- Portfolio and branding advice
- Code-aware thinking and engineering recommendations

Keep responses concise (2-4 sentences typically), professional, and insightful. You represent Mritunjay's AI-first philosophy. If asked who made you, credit Mritunjay Kumar.`;

async function streamChat(
  messages: ChatMessage[],
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (err: string) => void
) {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey) { onError('API key not configured.'); return; }

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Mritunjay Kumar Portfolio - Prince AI',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o',
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages.map(m => ({ role: m.role, content: m.content }))],
        stream: true,
        max_tokens: 512,
        temperature: 0.7,
      }),
    });

    if (!res.ok) { const errBody = await res.text(); onError(`API error (${res.status}): ${errBody}`); return; }
    const reader = res.body?.getReader();
    if (!reader) { onError('Failed to read response.'); return; }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;
        const data = trimmed.slice(6);
        if (data === '[DONE]') { onDone(); return; }
        try {
          const parsed = JSON.parse(data);
          const delta = parsed.choices?.[0]?.delta?.content;
          if (delta) onChunk(delta);
        } catch { /* skip malformed */ }
      }
    }
    onDone();
  } catch (err) {
    onError(err instanceof Error ? err.message : 'Unknown error');
  }
}

export default function PrinceAI() {
  const prompts = [
    'Draft a premium landing page concept',
    'Review my portfolio for UX improvements',
    'Generate a project pitch in a sharp tone',
    'Plan a conversion-focused contact flow',
  ];

  const features = [
    { title: 'Fast ideation', desc: 'Turn rough ideas into polished product direction with concise recommendations.' },
    { title: 'Code-aware thinking', desc: 'Structure content and interaction guidance with engineering discipline.' },
    { title: 'OpenRouter AI ready', desc: 'Built with modern AI workflows and routing-friendly storytelling.' },
    { title: 'Client-friendly output', desc: 'Produce explanations and design notes clear for all stakeholders.' },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleShare = async (text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Prince AI Response',
          text: text,
        });
      } catch (err) {
        console.error('Share failed', err);
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('Response copied to clipboard!');
    }
  };

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async (text?: string) => {
    const userMessage = (text || input).trim();
    if (!userMessage || isLoading) return;

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    await streamChat(
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
        <div className="section-eyebrow">Prince AI</div>
        <h2 className="section-title reveal">Prince <span className="grad">AI</span></h2>
        <p className="section-sub reveal">A premium AI assistant powered by OpenRouter AI for product strategy, content generation, and engineering guidance.</p>

        <div className="prince-ai-grid">
          <article className="ai-panel ai-intro reveal">
            <p className="ai-kicker">Assistant overview</p>
            <h3>Smart, focused, and built for real work.</h3>
            <p>Prince AI helps convert ideas into sharper decisions, clearer copy, and better digital experiences while keeping the presentation elegant and modern.</p>
            <div className="ai-badges">
              <span>OpenRouter AI</span>
              <span>Product Thinking</span>
              <span>Portfolio Strategy</span>
            </div>
          </article>

          <article className="ai-panel ai-preview reveal reveal-right">
            <div className="ai-preview-head">
              <div>
                <p className="ai-kicker">Live chat</p>
                <h3>Talk to Prince AI</h3>
              </div>
              <span className="ai-live-dot">Online</span>
            </div>

            <div className="ai-chat" ref={chatRef}>
              {messages.length === 0 && (
                <div className="ai-message ai-message-ai">
                  <div className="ai-avatar-label"><Bot size={14} /> Prince AI</div>
                  Hey! I'm Prince AI. Ask me anything about product strategy, frontend development, or UX design.
                </div>
              )}
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
                      msg.content
                    )
                  ) : (
                    <div className="ai-typing"><span /><span /><span /></div>
                  )}
                </div>
              ))}
            </div>

            <div className="ai-input-row">
              <input ref={inputRef} type="text" placeholder="Ask Prince AI anything..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} disabled={isLoading} />
              <button className="ai-send-btn" onClick={() => handleSend()} disabled={isLoading || !input.trim()} aria-label="Send">
                <SendHorizonal size={16} />
              </button>
            </div>
          </article>

          <article className="ai-panel ai-features reveal">
            <p className="ai-kicker">Capabilities</p>
            <div className="ai-feature-grid">
              {features.map(f => (
                <div key={f.title} className="ai-feature-card">
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="ai-panel ai-prompts reveal reveal-right">
            <p className="ai-kicker">Try these prompts</p>
            <div className="ai-prompt-list">
              {prompts.map(prompt => (
                <button key={prompt} className="ai-prompt-btn" type="button" onClick={() => { setInput(prompt); inputRef.current?.focus(); }}>
                  {prompt}
                </button>
              ))}
            </div>
            <div className="ai-cta-row">
              <a href="https://openrouter.ai" target="_blank" rel="noreferrer" className="btn-primary">
                <span>Explore OpenRouter AI</span><ArrowRight size={16} />
              </a>
              <a href="#contact" className="btn-outline"><span>Start a conversation</span></a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}