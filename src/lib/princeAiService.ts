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
2. Domain Registrar & WHOIS Checker (/domain-checker) — Authoritative RDAP/WHOIS registry intelligence tool with 1-hr caching and rate limiting.
3. Interactive CLI Portfolio — Developer terminal experience runnable globally via \`npx mritunjay-portfolio\` (1,500+ NPM runs).
4. Real-Time Multi-Room Chat App — Sub-20ms WebSocket instant messaging platform with Socket.io & React.
5. Ad-Free YouTube Experience — Minimalist video streaming engine removing ads and distractions.
6. Real-Time Currency Converter — Fast exchange-rate calculator with 150+ currencies.

### Primary Skills & Tech Stack:
- Frontend: React 19, TypeScript, Next.js, Vite, Tailwind CSS, GSAP, Framer Motion, HTML5/CSS3.
- Backend & APIs: Node.js, Express, Python, FastAPI, REST APIs, WebSockets (Socket.io), GraphQL.
- AI & Databases: OpenRouter API, Gemini AI models, Supabase, PostgreSQL, Docker, Redis/Caching.
- Architecture: System Design, Microservices, Real-Time Event Architecture, Performance Optimization.

### Guidance for Responses:
- Maintain a professional, friendly, and expert technical tone.
- Format responses cleanly with Markdown (bullet points, bold text, code blocks where applicable).
- Keep answers informative yet crisp. If asked general technical/programming questions or about Mritunjay's work, provide accurate and direct help!`;

/**
 * High-precision, context-aware local intelligence engine for Prince AI.
 * Provides instant, zero-cost, 100% lifetime free responses for all portfolio,
 * technical, project, and conversational inquiries.
 */
export function generatePrinceAIResponse(query: string): string {
  const q = query.toLowerCase().trim();
  if (!q) return "Hello! I am Prince AI. Ask me anything about Mritunjay's projects, skills, tech stack, experience, or hire value!";

  // Greetings & Capabilities
  if (q === 'hi' || q === 'hello' || q === 'hey' || q.includes('who are you') || q.includes('what can you do')) {
    return `👋 **Hello! I'm Prince AI**, Mritunjay Kumar's personal AI assistant.

Here is what I can help you with:
- 🚀 **Explore Projects:** Ask about *Bulk Mail Sender*, *Domain Checker*, *CLI Portfolio*, or *Real-Time Chat*.
- ⚡ **Technical Skills:** Inquire about his frontend (React/TypeScript), backend (Node/Python), and AI stack.
- 💼 **Experience & Background:** Discover his work at *Epigroww Global* and product engineering philosophy.
- 📄 **Resume & Contact:** Get direct links to download his resume or reach him via email.
- 💡 **Code & Tech Advice:** Ask any software engineering or system architecture questions!

*What would you like to explore first?*`;
  }

  // Technologies & Frameworks / Skills
  if (
    q.includes('technology') ||
    q.includes('technologies') ||
    q.includes('framework') ||
    q.includes('frameworks') ||
    q.includes('stack') ||
    q.includes('skills') ||
    q.includes('specialize') ||
    q.includes('programming') ||
    q.includes('language') ||
    q.includes('languages')
  ) {
    return `### ⚡ Mritunjay's Core Technologies & Stack

Mritunjay specializes in **Modern Full-Stack Development and AI-Driven Web Applications**:

#### 🎨 Frontend Architecture
- **Frameworks & Core:** React 19, TypeScript, Next.js (App Router), Vite, JavaScript (ESNext)
- **Styling & Animation:** Tailwind CSS, Framer Motion, GSAP, CSS Modules, Modern CSS Design Tokens
- **State & Routing:** React Router v7, Context API, Zustand, TanStack Query

#### ⚙️ Backend & Systems
- **Runtimes & Frameworks:** Node.js, Express.js, Python 3.12, FastAPI
- **Real-Time Communication:** WebSockets, Socket.io, Server-Sent Events (SSE)
- **APIs & Protocols:** RESTful APIs, GraphQL, IANA RDAP, OAuth 2.0 / JWT Auth

#### 🧠 AI & Cloud Infrastructure
- **AI & LLM Integration:** OpenRouter API, Google Gemini, OpenAI APIs, Vector embeddings, Custom RAG
- **Databases & Storage:** Supabase, PostgreSQL, Redis (Caching), MongoDB
- **DevOps & Hosting:** Docker, Vercel Serverless, Git/GitHub Actions, Linux/Bash`;
  }

  // Projects
  if (
    q.includes('project') ||
    q.includes('projects') ||
    q.includes('built') ||
    q.includes('portfolio') ||
    q.includes('work') ||
    q.includes('app')
  ) {
    return `### 🚀 Top Featured Engineering Projects

Here are Mritunjay's standout projects:

1. 📧 **[Bulk Mail Sender](https://www.bulkmailsender.online/)**
   - **Stack:** Node.js, Express, Gmail API, React, CSS
   - **Highlights:** High-volume automated email dispatch engine with **99.2% inbox deliverability** and 10,000+ emails processed.

2. 🌐 **[Domain Registrar & WHOIS Checker](/domain-checker)**
   - **Stack:** React 19, TypeScript, IANA RDAP bootstrap protocol, In-memory rate limiting & caching
   - **Highlights:** Real-time domain registrar lookup, nameserver queries, search history, and bulk batch scanning.

3. 💻 **Interactive CLI Portfolio**
   - **Command:** \`npx mritunjay-portfolio\`
   - **Highlights:** Terminal-based interactive developer resume with 1,500+ global NPM executions.

4. 💬 **Real-Time Multi-Room Chat**
   - **Stack:** React, Node.js, Socket.io, Tailwind CSS
   - **Highlights:** Low-latency (<20ms) instant messaging system with active room channels.

5. 🎬 **Ad-Free YouTube Experience**
   - **Stack:** React, Invidious API, Plain CSS
   - **Highlights:** Distraction-free video streaming platform eliminating ads and pop-ups.

*Explore all builds interactively on the [Projects Page](/projects)!*`;
  }

  // About Mritunjay / Background
  if (
    q.includes('about') ||
    q.includes('background') ||
    q.includes('journey') ||
    q.includes('who is mritunjay') ||
    q.includes('tell me about him') ||
    q.includes('profile')
  ) {
    return `### 👤 About Mritunjay Kumar

**Mritunjay Kumar** is a **Full Stack & AI Application Developer** currently working at **Epigroww Global**.

#### 🎯 Key Highlights:
- **Product-Driven Mindset:** Focused on building snappy, accessible, and high-conversion software.
- **AI-Native Engineering:** Seamlessly integrating LLMs, real-time streaming, and intelligent automation into production web platforms.
- **Modern UI & Micro-interactions:** Crafting pixel-perfect, liquid-smooth animations using GSAP and Framer Motion.
- **Open Source Contributor:** Active creator with tools like the \`npx mritunjay-portfolio\` CLI and public developer utilities.

*Based in India • Available for high-impact software engineering roles & consulting.*`;
  }

  // Experience / Career
  if (
    q.includes('experience') ||
    q.includes('career') ||
    q.includes('company') ||
    q.includes('epigroww') ||
    q.includes('job') ||
    q.includes('role')
  ) {
    return `### 💼 Professional Experience

#### 🌟 Full Stack & AI Application Developer — **Epigroww Global**
- Architected and shipped scalable full-stack web applications and SaaS platforms.
- Integrated AI workflows, generative agents, and real-time streaming APIs to boost product engagement.
- Enhanced application performance, reducing time-to-interactive (TTI) by over 35% through bundle optimization and code-splitting.
- Engineered resilient Node.js & Python backend services with PostgreSQL and Redis caching.

*Check out the full timeline on the [Experience Page](/experience).*`;
  }

  // Why Hire / Value Proposition
  if (
    q.includes('hire') ||
    q.includes('why') ||
    q.includes('reason') ||
    q.includes('value') ||
    q.includes('stand out')
  ) {
    return `### 💡 Why Hire Mritunjay Kumar?

1. **End-to-End Ownership:** From database schema and API performance to fluid UI animations, he delivers complete, production-ready features independently.
2. **AI Integration Specialist:** Understands practical LLM deployment (streaming, token management, vector search, robust fallbacks) rather than just surface-level wrappers.
3. **Speed + Clean Architecture:** Balances rapid prototyping speed with clean TypeScript typing, modular folder structures, and high testability.
4. **Performance & UX Obsession:** Builds sub-second loading applications with fluid feedback loops that users love.

Ready to discuss an opportunity? [Send an email directly](mailto:me@mritify.online) or [Download his Resume](/updated_resume.pdf).`;
  }

  // Contact / Email / Resume
  if (
    q.includes('contact') ||
    q.includes('email') ||
    q.includes('reach') ||
    q.includes('resume') ||
    q.includes('cv') ||
    q.includes('github') ||
    q.includes('linkedin')
  ) {
    return `### 📬 Contact & Resume Information

- 📄 **Resume PDF:** [Download Updated Resume](/updated_resume.pdf)
- ✉️ **Direct Email:** [me@mritify.online](mailto:me@mritify.online)
- 🛠️ **Client & Support:** [support@mritify.online](mailto:support@mritify.online)
- 🐙 **GitHub:** [github.com/mritunjaykumarr](https://github.com/mritunjaykumarr)
- 💼 **LinkedIn:** [linkedin.com/in/mritunjay-kumar-22a7a828b](https://www.linkedin.com/in/mritunjay-kumar-22a7a828b)
- 💻 **Interactive CLI:** \`npx mritunjay-portfolio\``;
  }

  // Certifications
  if (q.includes('cert') || q.includes('certification') || q.includes('degree') || q.includes('education')) {
    return `### 🏆 Verified Certifications & Learning

- **Meta Front-End Developer Professional Certificate**
- **Google Cloud Platform Fundamentals**
- **HackerRank Certified Problem Solver (JavaScript & Python)**
- **FreeCodeCamp Full Stack Developer Curriculum**

*View full credential badges on the [Certifications Page](/certifications).*`;
  }

  // Domain Checker specific
  if (q.includes('domain') || q.includes('whois') || q.includes('rdap') || q.includes('registrar')) {
    return `### 🌐 Domain Registrar & WHOIS Tool

Mritunjay built a dedicated **[Domain Registrar Checker](/domain-checker)** directly inside this portfolio!
- Queries authoritative IANA RDAP registry servers in real-time.
- Displays registrar identity, domain creation date, expiry countdown, and DNS nameservers.
- Features in-memory 1-hour caching, IP rate protection, search history, and batch lookup for up to 10 domains at once.
- Try it now on the [/domain-checker](/domain-checker) page!`;
  }

  // Default intelligent assistant response
  return `Thanks for asking! Mritunjay Kumar is a **Full Stack & AI Application Developer** specializing in React 19, TypeScript, Node.js, Python, and generative AI systems. 

You can ask me about:
- 🚀 His top projects (**Bulk Mail Sender**, **Domain Checker**, **CLI Portfolio**)
- ⚡ Specific frameworks and tools (**React**, **Next.js**, **Express**, **Supabase**)
- 💼 His professional experience at **Epigroww Global**
- 📄 How to **hire him** or download his **resume**!`;
}

/**
 * Smooth simulated streaming generator for zero-latency, lifetime-free fallback.
 */
async function streamLocalFallback(
  text: string,
  onChunk: (chunk: string) => void,
  onDone: () => void
) {
  // Break into natural word and punctuation tokens
  const tokens = text.match(/\S+|\s+/g) || [text];
  for (let i = 0; i < tokens.length; i++) {
    onChunk(tokens[i]);
    // 12ms delay simulates fluid AI generation
    await new Promise((resolve) => setTimeout(resolve, 12));
  }
  onDone();
}

/**
 * Streams Prince AI chat responses.
 * 1. Tries OpenRouter with 100% free models (:free tier) if API key is present.
 * 2. If OpenRouter returns any credit error (402), rate limit (429), or is offline,
 *    it gracefully and silently falls back to the high-precision Local Intelligence Engine.
 * 3. Guarantees 100% lifetime free, uninterrupted AI assistance.
 */
export async function streamPrinceAIChat(
  messages: ChatMessage[],
  onChunk: (chunk: string) => void,
  onDone: () => void,
  _onError: (errMessage: string) => void
) {
  const lastUserMsg = messages[messages.length - 1]?.content || '';
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  // Fallback immediately if no API key is provided
  if (!apiKey || !apiKey.trim()) {
    const fallbackResponse = generatePrinceAIResponse(lastUserMsg);
    await streamLocalFallback(fallbackResponse, onChunk, onDone);
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

    // Priority list of 100% FREE OpenRouter models (0 credits required)
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://mritify.online',
        'X-Title': 'Mritunjay Kumar Portfolio - Prince AI',
      },
      body: JSON.stringify({
        models: [
          'google/gemini-2.0-flash-exp:free',
          'meta-llama/llama-3.3-70b-instruct:free',
          'qwen/qwen-2.5-coder-32b-instruct:free',
          'meta-llama/llama-3.1-8b-instruct:free',
          'mistralai/mistral-7b-instruct:free',
          'deepseek/deepseek-r1:free'
        ],
        messages: formattedMessages,
        stream: true,
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    // If API returns ANY error (e.g. 402 Insufficient credits, 429 Rate limited, 401 Bad key)
    if (!res.ok) {
      console.warn(`OpenRouter returned status ${res.status}. Falling back to Lifetime Free Engine.`);
      const fallbackResponse = generatePrinceAIResponse(lastUserMsg);
      await streamLocalFallback(fallbackResponse, onChunk, onDone);
      return;
    }

    const reader = res.body?.getReader();
    if (!reader) {
      const fallbackResponse = generatePrinceAIResponse(lastUserMsg);
      await streamLocalFallback(fallbackResponse, onChunk, onDone);
      return;
    }

    const decoder = new TextDecoder();
    let buffer = '';
    let hasReceivedAnyDelta = false;

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
              hasReceivedAnyDelta = true;
              onChunk(delta);
            }
          } catch {
            /* ignore partial JSON */
          }
        }
      }
    }

    // If stream ended with no content, trigger fallback
    if (!hasReceivedAnyDelta) {
      const fallbackResponse = generatePrinceAIResponse(lastUserMsg);
      await streamLocalFallback(fallbackResponse, onChunk, onDone);
      return;
    }

    onDone();
  } catch (err: unknown) {
    console.warn('Prince AI Network/Stream Exception. Activating Lifetime Free Engine.', err);
    const fallbackResponse = generatePrinceAIResponse(lastUserMsg);
    await streamLocalFallback(fallbackResponse, onChunk, onDone);
  }
}
