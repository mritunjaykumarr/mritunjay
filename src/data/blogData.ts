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
    title: 'Building Next-Gen Web Apps with React 19 & TypeScript',
    type: 'Engineering',
    category: 'Engineering',
    created_at: '2026-07-15T10:00:00Z',
    excerpt: 'Exploring React 19\'s latest capabilities, compiler optimizations, optimistic updates, and strict TypeScript patterns for scalable production apps.',
    body: `<p>React 19 brings powerful new features to front-end engineering. From compiler optimizations to built-in state transitions, building high-performance web applications is now smoother than ever.</p><h3>Key Architectural Takeaways:</h3><ul><li><strong>Optimistic UI Updates:</strong> Eliminate artificial loading spinners by reflecting user input instantly.</li><li><strong>Strict Type Interfaces:</strong> Catch edge cases early in development with comprehensive type boundaries.</li><li><strong>Lean Asset Bundles:</strong> Tree-shake unnecessary modules to achieve lightning-fast initial load times.</li></ul><p>By coupling React 19 Actions with server endpoints, we can significantly reduce boilerplate state handling across modern user experiences.</p>`,
    cover: '/assets/bulkmailP.png',
    likes_count: 18,
    comments_count: 3,
    shares_count: 5
  },
  {
    id: 'default-2',
    title: 'Mastering Buttery-Smooth GSAP Scroll Animations',
    type: 'Performance',
    category: 'Performance',
    created_at: '2026-06-28T14:30:00Z',
    excerpt: 'How to craft 60fps micro-interactions and scroll triggers without blocking the main thread or causing layout shifts.',
    body: `<p>User experience is heavily defined by how responsive and tactile an interface feels. By utilizing hardware-accelerated CSS transforms and GSAP ScrollTrigger context management, we can deliver silky smooth motion across all viewport sizes.</p><h3>Best Practices for Motion Engineering:</h3><p>1. Always animate <code>transform</code> and <code>opacity</code> to offload work to the GPU.<br>2. Respect <code>prefers-reduced-motion</code> media queries for accessibility.<br>3. Clean up GSAP timelines on component unmount to prevent memory leaks.</p>`,
    cover: '/assets/adfree.png',
    likes_count: 26,
    comments_count: 5,
    shares_count: 9
  },
  {
    id: 'default-3',
    title: 'Integrating OpenRouter AI & Streaming In React',
    type: 'AI Strategy',
    category: 'AI Strategy',
    created_at: '2026-05-10T09:15:00Z',
    excerpt: 'A practical guide to building real-time streaming AI chatbot assistants like Prince AI using fetch streams and OpenRouter API.',
    body: `<p>Generative AI is revolutionizing digital experiences. By implementing server-sent events or fetch ReadableStreams, developers can present AI responses chunk-by-chunk for instant feedback.</p><h3>Streaming Pipeline Structure:</h3><p>1. Client initiates POST request with user chat message history.<br>2. Server streams back decoded chunks over UTF-8 ReadableStream.<br>3. React component batches state updates to prevent DOM thrashing.</p><p>We discuss prompt engineering, fallbacks, and maintaining a clear design system for AI components.</p>`,
    cover: '/assets/clip.png',
    likes_count: 42,
    comments_count: 8,
    shares_count: 14
  },
  {
    id: 'default-4',
    title: 'Automating Outreach Pipelines with Node.js & Gmail API',
    type: 'Engineering',
    category: 'Automation',
    created_at: '2026-04-18T11:20:00Z',
    excerpt: 'Designing reliable bulk mailing tools and CSV parsing pipelines with OAuth2 authentication and error recovery.',
    body: `<p>High-volume email delivery requires careful rate-limiting, OAuth2 token refreshing, and transactional logging. Building the BulkMail system taught us valuable lessons in Node.js asynchronous workers.</p><h3>Key System Pillars:</h3><ul><li><strong>OAuth2 Refresh Lifecycle:</strong> Automatically negotiate new access tokens without interrupting active campaigns.</li><li><strong>Chunked Processing:</strong> Batch CSV recipient lists into chunks of 50 with exponential backoff.</li><li><strong>Realtime Progress Feedback:</strong> Emit live WebSocket updates as each message delivers.</li></ul>`,
    cover: '/assets/bulkmailP.png',
    likes_count: 31,
    comments_count: 4,
    shares_count: 8
  },
  {
    id: 'default-5',
    title: 'Designing High-Conversion Developer Portfolios in 2026',
    type: 'Design Systems',
    category: 'Design Systems',
    created_at: '2026-03-02T16:45:00Z',
    excerpt: 'Why technical authority, micro-interactions, responsive typography, and integrated AI assistants win clients.',
    body: `<p>A developer portfolio is more than a resume — it is a live demonstration of engineering craft. By structuring work around problem-solved case studies, live metrics, and interactive assistants, engineering portfolios stand out immediately.</p>`,
    cover: '/assets/adfree.png',
    likes_count: 38,
    comments_count: 6,
    shares_count: 11
  }
];
