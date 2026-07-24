import { useState, useRef, useEffect } from 'react';

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

  if (!apiKey) {
    onError('OpenRouter API key is not configured. Add VITE_OPENROUTER_API_KEY to your .env file.');
    return;
  }

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
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
        ],
        stream: true,
        max_tokens: 512,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      onError(`API error (${res.status}): ${errBody}`);
      return;
    }

    const reader = res.body?.getReader();
    if (!reader) {
      onError('Failed to read response stream.');
      return;
    }

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
        if (data === '[DONE]') {
          onDone();
          return;
        }
        try {
          const parsed = JSON.parse(data);
          const delta = parsed.choices?.[0]?.delta?.content;
          if (delta) onChunk(delta);
        } catch {
          // skip malformed JSON chunks
        }
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
    {
      title: 'Fast ideation',
      desc: 'Turn rough ideas into polished product direction with concise, production-ready recommendations.',
    },
    {
      title: 'Code-aware thinking',
      desc: 'Structure content, layout, and interaction guidance with the discipline of a senior frontend engineer.',
    },
    {
      title: 'OpenRouter AI ready',
      desc: 'Designed with modern AI workflows and routing-friendly product storytelling in mind.',
    },
    {
      title: 'Client-friendly output',
      desc: 'Produce explanations, prompts, and design notes that are clear enough for stakeholders and engineers.',
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text?: string) => {
    const userMessage = (text || input).trim();
    if (!userMessage || isLoading) return;

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    // Add empty assistant message to fill via streaming
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    await streamChat(
      newMessages,
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
      () => {
        setIsLoading(false);
      },
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <section id="prince-ai" className="section prince-ai">
      <div className="container prince-ai-shell">
        <div className="section-eyebrow">10 · Prince AI</div>
        <h2 className="section-title reveal">Prince <span className="grad">AI</span></h2>
        <p className="section-sub reveal">
          A premium AI assistant powered by OpenRouter AI for product strategy, content generation, and engineering-friendly guidance.
        </p>

        <div className="prince-ai-grid">
          <article className="ai-panel ai-intro reveal">
            <p className="ai-kicker">Assistant overview</p>
            <h3>Smart, focused, and built for real work.</h3>
            <p>
              Prince AI helps convert ideas into sharper decisions, clearer copy, and better digital experiences while keeping the presentation elegant and modern.
            </p>
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
                  <div className="ai-avatar-label">
                    <i className="fa-solid fa-robot"></i> Prince AI
                  </div>
                  Hey! I'm Prince AI. Ask me anything about product strategy, frontend development, or UX design.
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`ai-message ${msg.role === 'user' ? 'ai-message-user' : 'ai-message-ai'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="ai-avatar-label">
                      <i className="fa-solid fa-robot"></i> Prince AI
                    </div>
                  )}
                  {msg.content || (
                    <div className="ai-typing">
                      <span></span><span></span><span></span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="ai-input-row">
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask Prince AI anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              <button
                className="ai-send-btn"
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
              >
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </article>

          <article className="ai-panel ai-features reveal">
            <p className="ai-kicker">Capabilities</p>
            <div className="ai-feature-grid">
              {features.map((feature) => (
                <div key={feature.title} className="ai-feature-card">
                  <h4>{feature.title}</h4>
                  <p>{feature.desc}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="ai-panel ai-prompts reveal reveal-right">
            <p className="ai-kicker">Try these prompts</p>
            <div className="ai-prompt-list">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  className="ai-prompt-btn"
                  type="button"
                  onClick={() => {
                    setInput(prompt);
                    inputRef.current?.focus();
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
            <div className="ai-cta-row">
              <a href="https://openrouter.ai" target="_blank" rel="noreferrer" className="btn-glow">
                <span>Explore OpenRouter AI</span>
                <i className="fa-solid fa-arrow-right"></i>
              </a>
              <a href="#contact" className="btn-ghost">
                <span>Start a conversation</span>
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}