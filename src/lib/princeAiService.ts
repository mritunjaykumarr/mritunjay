export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  image?: string;
}

export const SYSTEM_PROMPT = `You are Prince AI — an intelligent, friendly, and authoritative AI assistant embedded in Mritunjay Kumar's developer portfolio. 

### About Mritunjay Kumar:
- Role: Full Stack & AI Application Developer at Epigroww Global.
- Focus: Building modern AI-powered applications, high-performance web platforms, enterprise SaaS tools, and resilient event-driven architectures.
- Contact / Links:
  - GitHub: https://github.com/mritunjaykumarr
  - Direct Email: me@mritify.online
  - Support: support@mritify.online
  - General Info: info@mritify.online
  - Portfolio CLI: npx mritunjay-portfolio

### Top Featured Projects:
1. Bulk Mail Sender (https://www.bulkmailsender.online/) — High-volume email platform built with Node.js, Express, and Gmail API (10k+ emails sent, 99.2% deliverability).
2. Interactive CLI Portfolio — Developer terminal experience runnable globally via `npx mritunjay-portfolio` (1,500+ NPM runs).
3. Real-Time Multi-Room Chat App — Sub-20ms WebSocket instant messaging platform with Socket.io & React.
4. Ad-Free YouTube Experience — Minimalist video streaming engine removing ads and distractions.
5. Real-Time Currency Converter — Fast exchange-rate calculator with 150+ currencies.

### Primary Skills & Tech Stack:
- Frontend: React, TypeScript, Next.js, Vite, Tailwind CSS, GSAP, Framer Motion, HTML5/CSS3.
- Backend & APIs: Node.js, Express, Python, FastAPI, REST APIs, WebSockets (Socket.io), GraphQL.
- AI & Databases: OpenRouter API, Gemini AI models, Supabase, PostgreSQL, Docker, Redis/Caching.
- Architecture: System Design, Microservices, Real-Time Event Architecture, Performance Optimization.

### Guidance for Responses:
- Maintain a professional, friendly, and expert technical tone.
- Format responses cleanly with Markdown (bullet points, bold text, code blocks where applicable).
- Keep answers informative yet crisp. If asked general technical/programming questions or about Mritunjay's work, provide accurate and direct help!`;

export function generatePrinceAIResponse(query: string): string {
  const q = query.toLowerCase().trim();
  if (!q) return "Hello! I am Prince AI. Ask me anything about Mritunjay's projects, skills, tech stack, or experience!";

  if (q.includes('best project') || q.includes('top project') || q.includes('featured')) {
    return `### 🏆 Mritunjay's Top Featured Projects\n\n1. **Bulk Mail Sender** — High-volume email campaign tool ([Live Site](https://www.bulkmailsender.online/)).\n2. **Interactive CLI Portfolio** — Runnable anywhere via \`npx mritunjay-portfolio\`.\n3. **Real-Time WebSocket Chat** — Sub-20ms instant messaging app.\n4. **Ad-Free YouTube Experience** — Distraction-free streaming interface.`;
  }

  if (q.includes('technology') || q.includes('technologies') || q.includes('stack') || q.includes('skills') || q.includes('know')) {
    return `### ⚡ Core Skills & Stack\n\n- **Frontend:** React, TypeScript, Next.js, Vite, Tailwind CSS\n- **Backend:** Node.js, Express, Python, FastAPI, WebSockets\n- **AI & Cloud:** OpenRouter API, Gemini, Supabase, PostgreSQL, Docker`;
  }

  if (q.includes('hire') || q.includes('why') || q.includes('reason')) {
    return `### 💼 Why Hire Mritunjay Kumar?\n\n- **Product-Minded Engineer:** Focuses on business impact & clean UX.\n- **AI-First Integration:** Proficient in building modern LLM-driven tools.\n- **Full-Stack Competency:** End-to-end capabilities from DB design to pixel-perfect UI.`;
  }

  if (q.includes('github') || q.includes('code') || q.includes('contact') || q.includes('email') || q.includes('support')) {
    return `### 🔗 Links & Contact\n\n- **Direct / Work Email:** me@mritify.online\n- **Tech & Client Support:** support@mritify.online\n- **General Inquiries:** info@mritify.online\n- **GitHub:** [github.com/mritunjaykumarr](https://github.com/mritunjaykumarr)\n- **CLI Portfolio:** \`npx mritunjay-portfolio\``;
  }

  return `Thanks for asking! Mritunjay Kumar is a Full Stack & AI Application Developer specializing in enterprise SaaS, AI product integrations, and high-performance web applications. Feel free to ask about his projects, architecture, or tech stack!`;
}

export async function streamPrinceAIChat(
  messages: ChatMessage[],
  onChunk: (chunk: string) => void,
  onDone: () => void,
  onError: (errMessage: string) => void
) {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  if (!apiKey || !apiKey.trim()) {
    const lastMsg = messages[messages.length - 1]?.content || '';
    const fallback = generatePrinceAIResponse(lastMsg);
    onChunk(fallback);
    onDone();
    return;
  }

  try {
    const formattedMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((m) => {
        if (m.image) {
          return {
            role: m.role,
            content: [
              { type: 'text', text: m.content || 'Analyze this image:' },
              { type: 'image_url', image_url: { url: m.image } },
            ],
          };
        }
        return { role: m.role, content: m.content };
      }),
    ];

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173',
        'X-Title': 'Mritunjay Kumar Portfolio - Prince AI',
      },
      body: JSON.stringify({
        models: [
          'google/gemini-2.5-flash',
          'openai/gpt-4o-mini',
          'meta-llama/llama-3.3-70b-instruct'
        ],
        messages: formattedMessages,
        stream: true,
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      let errDetails = '';
      try {
        const errorJson = await res.json();
        errDetails = errorJson.error?.message || JSON.stringify(errorJson);
      } catch {
        errDetails = await res.text();
      }

      console.error('OpenRouter API Error:', res.status, errDetails);
      onError(`API Error (${res.status}): ${errDetails || 'Failed to generate response'}`);
      return;
    }

    const reader = res.body?.getReader();
    if (!reader) {
      onError('Response body reader uninitialized.');
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
        if (!trimmed || trimmed.startsWith(':')) continue;

        if (trimmed.startsWith('data: ')) {
          const dataStr = trimmed.slice(6);
          if (dataStr === '[DONE]') {
            onDone();
            return;
          }

          try {
            const parsed = JSON.parse(dataStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              onChunk(delta);
            }
          } catch {
            /* ignore partial chunk */
          }
        }
      }
    }

    onDone();
  } catch (err: unknown) {
    console.error('Prince AI Stream Exception:', err);
    onError((err as Error)?.message || 'Network error reaching OpenRouter API.');
  }
}
