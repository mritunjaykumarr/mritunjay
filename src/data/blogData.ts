export interface BlogPost {
  id: string;
  title: string;
  type: string;
  category: string;
  created_at: string;
  excerpt: string;
  body: string;
  cover: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
}

export interface CommentItem {
  id: string;
  post_id: string;
  user_name?: string;
  author_name?: string;
  content: string;
  created_at: string;
}

export const DEFAULT_POSTS: BlogPost[] = [
  {
    id: 'default-1',
    title: 'Building Next-Gen Web Applications with React 19 and Strict TypeScript',
    type: 'Engineering',
    category: 'Engineering',
    created_at: '2026-07-15T10:00:00Z',
    excerpt: 'An in-depth engineering analysis of React 19 compiler optimizations, Actions, optimistic UI updates, and strict type safety patterns for production enterprise web applications.',
    body: `
      <p>The front-end ecosystem in 2026 has matured dramatically. With the widespread adoption of <strong>React 19</strong>, developers no longer need to rely heavily on manual memoization hooks like <code>useMemo</code>, <code>useCallback</code>, or <code>React.memo</code>. The React Compiler handles dependency tracking automatically, drastically reducing mental overhead while preserving render performance.</p>

      <h3>1. The Evolution of State Transitions &amp; Actions</h3>
      <p>Prior to React 19, managing pending states during asynchronous mutations required creating redundant boolean flags such as <code>isLoading</code>, <code>isSubmitting</code>, or <code>isPending</code> across components. React 19 unifies this under the native <strong>Actions</strong> paradigm and the improved <code>useTransition</code> hook.</p>
      
      <pre><code>// Example: React 19 Action with native async pending state
function SubmitComment({ postId }: { postId: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState&lt;string | null&gt;(null);

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await postCommentAction(postId, formData);
      if (!result.success) {
        setError(result.message);
      }
    });
  };

  return (
    &lt;form action={handleSubmit}&gt;
      &lt;textarea name="content" required placeholder="Write a comment..." /&gt;
      &lt;button type="submit" disabled={isPending}&gt;
        {isPending ? 'Publishing...' : 'Submit Comment'}
      &lt;/button&gt;
      {error && &lt;p className="error"&gt;{error}&lt;/p&gt;}
    &lt;/form&gt;
  );
}</code></pre>

      <p>This pattern ensures that user interfaces remain interactive even while long-running asynchronous network operations take place, preventing the main UI thread from locking up or discarding keystrokes.</p>

      <h3>2. Optimistic UI Updates with <code>useOptimistic</code></h3>
      <p>One of the strongest indicators of software polish is zero perceptual latency. Waiting for a round-trip network response before reflecting a "Like" count or adding an item to a list makes web apps feel sluggish compared to native mobile software. React 19 introduces <code>useOptimistic</code>, which allows developers to update local state immediately while the server action processes in the background.</p>

      <p>If the server returns a failure or network timeout occurs, React automatically rolls back the optimistic state without requiring complicated manual rollback caches in Redux or Zustand.</p>

      <h3>3. Strict TypeScript Boundaries &amp; Domain Modeling</h3>
      <p>TypeScript in modern architecture is not merely about annotating variables; it is about establishing compile-time architectural boundaries. In our production portfolio and client applications, we enforce the following conventions:</p>
      <ul>
        <li><strong>Strict Discriminated Unions:</strong> Every asynchronous state transition must be modeled as an explicit union (e.g. <code>{ status: 'idle' } | { status: 'loading' } | { status: 'success', data: T } | { status: 'error', error: Error }</code>) to prevent invalid intermediate states.</li>
        <li><strong>Zod Runtime Validation:</strong> TypeScript types vanish at runtime. Integrating Zod schemas at network and API boundaries guarantees that unexpected backend payload shifts do not cause unhandled runtime exceptions.</li>
        <li><strong>Immutability by Default:</strong> Leveraging <code>Readonly&lt;T&gt;</code> and strict array typing prevents accidental in-place mutations that could disrupt React's virtual DOM reconciliation tree.</li>
      </ul>

      <h3>4. Performance Benchmarks and Bundle Budgets</h3>
      <p>Modern web users expect page delivery within sub-second thresholds. By pairing Vite with tree-shaking, manual chunk splitting for heavy animation libraries, and dynamic route-based code splitting using <code>React.lazy</code>, initial JavaScript execution time on mritify.online was reduced to under 120 milliseconds on 4G networks.</p>

      <h3>Conclusion</h3>
      <p>React 19 paired with strict TypeScript provides the most dependable foundation for enterprise applications. By adopting native Actions, optimistic updates, and rigorous type contracts, teams can build scalable applications that deliver superior user experiences and bulletproof reliability.</p>
    `,
    cover: '/assets/bulkmailP.png',
    likes_count: 24,
    comments_count: 4,
    shares_count: 7
  },
  {
    id: 'default-2',
    title: 'Mastering 60fps Micro-Interactions & GPU Animation Engineering',
    type: 'Performance',
    category: 'Performance',
    created_at: '2026-06-28T14:30:00Z',
    excerpt: 'How to craft butter-smooth 60fps micro-interactions, scroll-driven timelines, and GSAP triggers without causing layout thrashing or draining mobile battery.',
    body: `
      <p>Visual aesthetics and motion design can elevate a basic website into an unforgettable digital product. However, poorly implemented web animations frequently cause dropped frames (jank), excessive battery consumption, and frustrating layout shifts. In this comprehensive guide, we explore the mechanical symphonies behind high-performance web motion engineering.</p>

      <h3>1. The Critical Rendering Path: Composite vs. Reflow</h3>
      <p>To understand why certain animations stutter while others feel fluid, we must understand how modern browser engines (Blink, Gecko, WebKit) render a frame. The browser pipeline consists of four major stages:</p>
      <ol>
        <li><strong>JavaScript Execution:</strong> Calculations, DOM mutations, and animation callbacks.</li>
        <li><strong>Style Calculation &amp; Layout (Reflow):</strong> Computing geometric dimensions and positions of all elements on screen.</li>
        <li><strong>Paint:</strong> Filling in pixels (colors, borders, shadows, text).</li>
        <li><strong>Composite:</strong> Stacking layers together on the Graphics Processing Unit (GPU).</li>
      </ol>
      <p>Animating geometric properties such as <code>width</code>, <code>height</code>, <code>top</code>, <code>left</code>, or <code>margin</code> forces the browser to recalculate the layout for the entire document tree on every frame. At 60 frames per second, the browser has only <strong>16.6 milliseconds</strong> to perform all four stages. Triggering reflow reliably causes dropped frames.</p>

      <p>In contrast, animating <code>transform</code> (translate, scale, rotate) and <code>opacity</code> completely bypasses the Layout and Paint stages. The browser sends the pre-painted texture directly to the GPU for compositing, achieving silk-smooth 60fps rendering even on low-powered mobile devices.</p>

      <h3>2. Architectural Rules for GSAP and ScrollTrigger</h3>
      <p>GreenSock Animation Platform (GSAP) remains the industry gold standard for complex cinematic timelines. When building interactive portfolios and modern SaaS dashboards, we adhere to strict architectural rules:</p>
      <ul>
        <li><strong>Scope Animations with <code>gsap.context()</code>:</strong> In React, components mount and unmount dynamically. Wrapping animations inside <code>gsap.context()</code> guarantees that all timelines and event listeners are cleanly terminated when the component unmounts, preventing invisible memory leaks.</li>
        <li><strong>Respect Accessibility (<code>prefers-reduced-motion</code>):</strong> Not all users desire heavy motion. Users with vestibular conditions can experience disorientation. We always query <code>window.matchMedia('(prefers-reduced-motion: reduce)')</code> and disable intense translations in favor of simple subtle opacity fades.</li>
        <li><strong>Decouple Scroll Listeners:</strong> Never attach computationally expensive DOM updates directly to raw <code>window.onscroll</code> events. Use <code>requestAnimationFrame</code> or GSAP ScrollTrigger's optimized intersection observers.</li>
      </ul>

      <h3>3. CSS Hardware Acceleration Strategies</h3>
      <p>To hint to the browser that an element will animate, developers historically abused <code>transform: translateZ(0)</code>. In modern CSS, the standardized <code>will-change: transform, opacity</code> property notifies the rendering engine ahead of time to isolate the element into its own dedicated GPU composite layer.</p>

      <p>Caution must be exercised: creating too many GPU composite layers consumes video RAM and can paradoxically degrade device performance. Only apply <code>will-change</code> to active interactive targets, and remove it once the animation cycle completes.</p>

      <h3>Conclusion</h3>
      <p>Exceptional motion engineering lives at the intersection of artistic discipline and mechanical sympathy. By confining animations to composited properties and handling cleanup diligently, web experiences become both visually stunning and computationally lightweight.</p>
    `,
    cover: '/assets/adfree.png',
    likes_count: 32,
    comments_count: 6,
    shares_count: 12
  },
  {
    id: 'default-3',
    title: 'Architecting Real-Time Streaming AI Chat Assistants with SSE and React',
    type: 'AI Strategy',
    category: 'AI Strategy',
    created_at: '2026-05-10T09:15:00Z',
    excerpt: 'A complete architectural walkthrough of streaming conversational AI assistants like Prince AI using Server-Sent Events, OpenRouter endpoints, and resilient client-side buffering.',
    body: `
      <p>Generative artificial intelligence has redefined the standard for user interfaces. Instead of static search bars and predictable navigation trees, users now expect contextual, intelligent conversational agents. On mritify.online, we engineered <strong>Prince AI</strong> — an embedded interactive copilot capable of answering recruiter inquiries, explaining code architectures, and guiding visitors through engineering projects.</p>

      <h3>1. Why Streaming Outperforms Traditional Request-Response</h3>
      <p>Standard Large Language Model (LLM) inference takes anywhere from 3 to 15 seconds to generate a full 500-word response. If a web application relies on a standard JSON REST response (waiting until the entire response finishes generating before displaying anything), the user experiences an unbearable blank state or loading spinner.</p>

      <p>Streaming via <strong>Server-Sent Events (SSE)</strong> or HTTP/2 chunked transfer encoding resolves this latency entirely. The server forwards tokens to the browser as soon as the model computes them. The time-to-first-token (TTFT) drops to under 400 milliseconds, giving the user immediate visual feedback that thought and communication are occurring.</p>

      <h3>2. The Streaming Pipeline Mechanics</h3>
      <p>Here is how a reliable streaming pipeline is structured between the client and inference endpoint:</p>
      <ol>
        <li><strong>Client Dispatch:</strong> The user submits a question. The React client builds a sanitized payload containing the conversation history (context window) and initiates a <code>POST</code> request with <code>stream: true</code>.</li>
        <li><strong>API Proxy &amp; Rate Limiting:</strong> To safeguard API keys and prevent denial-of-service abuse, requests flow through an edge serverless function that checks rate limits and verifies token quotas.</li>
        <li><strong>Stream Consumption:</strong> The client reads the incoming byte stream using the native browser <code>response.body.getReader()</code> interface, decoding chunks using <code>TextDecoder('utf-8')</code>.</li>
      </ol>

      <pre><code>// Example: Client-Side Chunk Consumer
async function streamAIResponse(prompt: string, onChunk: (text: string) => void) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });

  const reader = response.body?.getReader();
  const decoder = new TextDecoder('utf-8');
  if (!reader) return;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    onChunk(chunk);
  }
}</code></pre>

      <h3>3. Preventing React State Thrashing During Rapid Token Emission</h3>
      <p>Large language models can stream up to 60 tokens per second. Calling <code>setState(prev => prev + chunk)</code> on every incoming micro-token triggers 60 React re-renders per second, overwhelming the virtual DOM and causing severe browser CPU spikes.</p>

      <p>To eliminate this, we implement a <strong>batch buffer pattern</strong>. Tokens are accumulated in an in-memory mutable string buffer, and a <code>requestAnimationFrame</code> loop flushes updates to the React component at the monitor's native refresh rate. This decouples the network reception frequency from the UI rendering frequency.</p>

      <h3>4. Prompt Engineering for Portfolio Agents</h3>
      <p>A portfolio AI assistant must remain helpful, truthful, and strictly aligned with the engineer's real credentials. In Prince AI, we provide system instructions with structured JSON summaries of all verified projects, experience timelines, and communication links, with strict instructions to politely decline off-topic queries.</p>

      <h3>Conclusion</h3>
      <p>Streaming AI assistants represent the future of portfolio and customer engagement. Combining chunked streams, rate-limited proxies, and buffered state updates delivers an effortless, ultra-responsive experience that leaves a lasting professional impression.</p>
    `,
    cover: '/assets/clip.png',
    likes_count: 48,
    comments_count: 9,
    shares_count: 18
  },
  {
    id: 'default-4',
    title: 'Designing Resilient High-Volume Email Pipelines with Node.js & Gmail API',
    type: 'Engineering',
    category: 'Automation',
    created_at: '2026-04-18T11:20:00Z',
    excerpt: 'Architectural lessons learned while developing the Bulk Mail Sender tool: OAuth2 token refresh loops, backpressure management, and deliverability optimization.',
    body: `
      <p>Sending personalized business emails at scale is deceptively complex. While dispatching a single email through an SMTP server takes three lines of code, orchestrating campaigns of thousands of personalized messages requires handling authentication expirations, rate limits, CSV data sanitization, and transient socket failures.</p>

      <p>During the design and deployment of the <strong>Bulk Mail Sender</strong> application, our primary objective was providing individual creators and small businesses with a reliable outreach engine powered by their existing Google Workspace or Gmail accounts without requiring enterprise subscription overhead.</p>

      <h3>1. Overcoming the OAuth2 Token Lifecycle</h3>
      <p>Google OAuth2 access tokens have a strict lifespan of 3,600 seconds (1 hour). In long-running campaigns involving large recipient lists, access tokens routinely expire mid-transit. A naïve implementation causes the entire batch to fail once the token lapses.</p>

      <p>We solved this by wrapping our transmission workers with an automated token refresh interceptor:</p>
      <ul>
        <li>Before each batch dispatch, the OAuth2 client validates the token expiration timestamp.</li>
        <li>If the token has less than 5 minutes of validity remaining, the worker issues an asynchronous <code>refreshToken()</code> call using the encrypted refresh token stored in secure session storage.</li>
        <li>The batch continues without human intervention or failed transmissions.</li>
      </ul>

      <h3>2. Stream-Based CSV Parsing &amp; Memory Safety</h3>
      <p>A common vulnerability in web-based mailers is loading the entire user-uploaded CSV file directly into memory with <code>fs.readFileSync</code>. For spreadsheets containing 50,000+ contact records, this causes Node.js memory exhaustion and server crashes.</p>

      <p>Instead, we engineered a streaming pipeline utilizing Node.js <code>Transform</code> streams. The server parses recipient rows chunk-by-chunk, interpolates custom placeholders (such as <code>{{First_Name}}</code>, <code>{{Company}}</code>, or <code>{{Project_Scope}}</code>), and queues emails in fixed worker batches of 25 records with configurable delays.</p>

      <h3>3. Combating Spam Classifications &amp; Ensuring Deliverability</h3>
      <p>Email delivery algorithms (Gmail, Outlook, Proton) actively monitor transmission velocity. Blasting 500 emails in 2 seconds triggers automated fraud detection and lands outgoing emails in the spam or quarantine folder.</p>
      <p>We introduced an adaptive delay mechanism that injects a randomized jitter (between 1.5 to 4 seconds) between successive dispatches. Additionally, the application validates email syntax against RFC 5322 specifications before transmission, eliminating bouncebacks caused by malformed addresses.</p>

      <h3>Conclusion</h3>
      <p>Building high-volume automation tools demands a commitment to defensive engineering. Handling OAuth lifecycles gracefully, managing memory through streaming data flows, and respecting third-party platform rate limits produces software that users can trust for their most critical business operations.</p>
    `,
    cover: '/assets/bulkmailP.png',
    likes_count: 36,
    comments_count: 5,
    shares_count: 11
  },
  {
    id: 'default-5',
    title: 'The Blueprint for High-Conversion Developer Portfolios in 2026',
    type: 'Design Systems',
    category: 'Design Systems',
    created_at: '2026-03-02T16:45:00Z',
    excerpt: 'Why technical authority, proof-of-work case studies, responsive dark mode typography, and interactive live demonstrations outperform traditional static resumes.',
    body: `
      <p>The traditional developer resume is rapidly losing its effectiveness. In a competitive global engineering landscape where thousands of candidates possess identical lists of technical buzzwords on LinkedIn, a developer's portfolio serves as their verifiable proof of craftsmanship.</p>

      <h3>1. Case Studies Over Skill Lists</h3>
      <p>Listing "React, Node.js, Python, AWS" tells a hiring manager or client very little about how you solve actual business problems. High-converting portfolios structure projects around the <strong>Problem-Solution-Impact</strong> framework:</p>
      <ul>
        <li><strong>The Problem:</strong> What business or technical bottleneck existed? Why was it non-trivial?</li>
        <li><strong>The Solution:</strong> What architectural decisions were made? What trade-offs were evaluated?</li>
        <li><strong>The Impact:</strong> What concrete metrics were achieved (e.g. 99.2% deliverability, 40% lower bundle size, sub-20ms WebSocket response)?</li>
      </ul>

      <h3>2. Visual Hierarchy and Typography</h3>
      <p>A portfolio must balance visual charisma with readable editorial typography. On mritify.online, we paired <strong>Inter</strong> (a clean, highly legible grotesque sans-serif for UI labels and body copy) with <strong>Instrument Serif</strong> (an elegant editorial serif for expressive headlines). This contrasts modern technical precision with refined craftsmanship.</p>

      <h3>3. Interactive Proof of Competence</h3>
      <p>Instead of merely displaying static screenshots of software, incorporate live interactive elements:</p>
      <ul>
        <li>An embedded conversational AI copilot (Prince AI) capable of answering live questions about your work.</li>
        <li>An executable terminal portfolio (<code>npx mritunjay-portfolio</code>) that recruiters can test directly in their local development shell.</li>
        <li>Interactive playground tools, live train status analyzers, and client booking flows.</li>
      </ul>

      <h3>4. Accessibility &amp; Core Web Vitals</h3>
      <p>Engineering excellence is proven in the invisible details: semantic HTML5 landmarks, full keyboard navigation with discernible focus rings, color contrast ratios surpassing WCAG 2.1 AA standards, and perfect 100/100 Lighthouse performance metrics.</p>

      <h3>Conclusion</h3>
      <p>Your portfolio is not just an online business card; it is the flagship product of your professional career. Treating it with the same engineering rigor, design elegance, and technical depth as a high-stakes client production deployment is the surest path to stand out.</p>
    `,
    cover: '/assets/adfree.png',
    likes_count: 44,
    comments_count: 7,
    shares_count: 15
  }
];
