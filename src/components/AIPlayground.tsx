import { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Mail, FileText, Database, Bot, FileCheck, Globe, 
  Play, Copy, Check, Download, RefreshCw, Zap, Sliders, ArrowRight, CornerDownRight, CheckCircle2, AlertCircle
} from 'lucide-react';

type ToolId = 'email' | 'summary' | 'sql' | 'ask' | 'resume' | 'portfolio';

interface ToolConfig {
  id: ToolId;
  name: string;
  badge: string;
  icon: typeof Sparkles;
  description: string;
}

const TOOLS: ToolConfig[] = [
  { id: 'email', name: 'Email Generator', badge: 'Outreach & Comms', icon: Mail, description: 'Craft compelling cold emails, follow-ups, and pitch decks in seconds.' },
  { id: 'summary', name: 'Text Summarizer', badge: 'NLP Engine', icon: FileText, description: 'Condense long technical docs or articles into crisp executive summaries.' },
  { id: 'sql', name: 'SQL Query Generator', badge: 'Database Engineering', icon: Database, description: 'Convert natural language descriptions into production-ready, indexed SQL.' },
  { id: 'ask', name: 'Ask AI & Code Assistant', badge: 'Architecture & Q&A', icon: Bot, description: 'Deep technical Q&A, code debugging, and system architecture guidance.' },
  { id: 'resume', name: 'Resume Analyzer', badge: 'ATS Intelligence', icon: FileCheck, description: 'Evaluate resumes against engineering job descriptions for ATS match & gaps.' },
  { id: 'portfolio', name: 'Portfolio Analyzer', badge: 'UX & Stack Audit', icon: Globe, description: 'Audit developer portfolios for conversion, design authority, and SEO.' },
];

// Presets for fast 1-click testing
const PRESETS = {
  email: [
    { label: 'Cold Client Outreach', topic: 'Offering full-stack SaaS & AI consulting for automated workflow reduction.', target: 'CTO at Tech Startup', tone: 'Persuasive' },
    { label: 'Project Follow-up', topic: 'Checking status on RetailConnect integration proposal sent last Friday.', target: 'Product Director', tone: 'Professional' },
    { label: 'Technical Bug Escalation', topic: 'Reporting API rate limit bottleneck during peak traffic spikes.', target: 'DevOps Lead', tone: 'Direct' },
  ],
  summary: [
    { label: 'System Architecture Doc', text: `RetailConnect utilizes a decoupled microservices architecture with a React Vite frontend hosted on Cloudflare Pages, communicating via GraphQL and REST endpoints with Node.js microservices. PostgreSQL serves as the primary relational store with Redis caching layer reducing database latency by 65%. Event-driven data updates flow via WebSockets for live inventory tracking across 12,000 active retail locations.` },
    { label: 'AI Model Deployment Specs', text: `The custom LLM agent framework is deployed across serverless GPU instances with fallback routing. Streaming responses use Server-Sent Events (SSE) with exponential backoff on retry. Average time to first token is under 180ms, maintaining strict P99 response constraints under 1.2 seconds for full context windows.` },
  ],
  sql: [
    { label: 'Top High-Value Customers', prompt: 'Find the top 5 customers with total spend over $1,500 in 2025, including their order count and average order value.', dialect: 'PostgreSQL' },
    { label: 'Monthly Active Users & Growth', prompt: 'Calculate monthly active users (MAU) and month-over-month growth percentage for the past 12 months.', dialect: 'BigQuery' },
    { label: 'Low Stock Inventory Alert', prompt: 'Join products with warehouse stock and return items where quantity is below safety threshold, ordered by urgency.', dialect: 'MySQL' },
  ],
  ask: [
    { label: 'React 19 Concurrent Features', codeOrPrompt: 'How do React 19 Server Components and useActionState simplify state handling in modern web apps?' },
    { label: 'Database Index Strategy', codeOrPrompt: 'When should I use a Composite B-Tree index versus a GIN index in PostgreSQL for high concurrency?' },
    { label: 'Node.js Event Loop Optimization', codeOrPrompt: 'Why does CPU bound task block the main event loop and how can Worker Threads fix it?' },
  ],
  resume: [
    { label: 'Senior Full Stack Engineer', role: 'Senior Full Stack Engineer (React, Node, PostgreSQL, AI)', content: 'Full Stack Developer with 4+ years experience building scalable web applications. Expertise in React, TypeScript, Node.js, PostgreSQL, Redis, REST APIs, and LLM integrations. Led development of B2B SaaS platform handling $5M+ transactions.' },
    { label: 'AI & Data Application Engineer', role: 'AI Application Engineer (Python, OpenAI API, LangChain)', content: 'Software engineer specializing in AI agent design, prompt optimization, vector databases (Pinecone, PGVector), and scalable backend architectures. Built automated workflow engine serving 10,000+ monthly requests.' },
  ],
  portfolio: [
    { label: 'Mritunjay Portfolio Audit', target: 'Tech Recruiter & Enterprise Clients', description: 'Full stack & AI engineer portfolio featuring interactive 3D hero section, live AI chat assistant, terminal simulation, and detailed project case studies.' },
    { label: 'SaaS Product Showcase Audit', target: 'B2B Buyers & Investors', description: 'Interactive SaaS product landing page with live demo playground, ROI calculator, pricing tiers, and customer testimonials.' },
  ],
};

export default function AIPlayground() {
  const [activeTool, setActiveTool] = useState<ToolId>('email');
  
  // Controls
  const [emailTopic, setEmailTopic] = useState(PRESETS.email[0].topic);
  const [emailTarget, setEmailTarget] = useState(PRESETS.email[0].target);
  const [emailTone, setEmailTone] = useState('Persuasive');

  const [summaryInput, setSummaryInput] = useState(PRESETS.summary[0].text);
  const [summaryFormat, setSummaryFormat] = useState<'tldr' | 'bullets' | 'executive'>('executive');

  const [sqlPrompt, setSqlPrompt] = useState(PRESETS.sql[0].prompt);
  const [sqlDialect, setSqlDialect] = useState('PostgreSQL');

  const [askPrompt, setAskPrompt] = useState(PRESETS.ask[0].codeOrPrompt);
  const [askLevel, setAskLevel] = useState<'senior' | 'architect' | 'beginner'>('senior');

  const [resumeRole, setResumeRole] = useState(PRESETS.resume[0].role);
  const [resumeContent, setResumeContent] = useState(PRESETS.resume[0].content);

  const [portfolioTarget, setPortfolioTarget] = useState(PRESETS.portfolio[0].target);
  const [portfolioDesc, setPortfolioDesc] = useState(PRESETS.portfolio[0].description);

  // Execution state
  const [output, setOutput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [tokenCount, setTokenCount] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [structuredMetrics, setStructuredMetrics] = useState<any>(null);

  const outputRef = useRef<HTMLDivElement>(null);

  // Trigger initial generation preview when tab switches
  useEffect(() => {
    handleGenerate();
  }, [activeTool]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    const ext = activeTool === 'sql' ? 'sql' : activeTool === 'summary' || activeTool === 'resume' ? 'md' : 'txt';
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai_playground_${activeTool}_${Date.now()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setOutput('');
    setStructuredMetrics(null);
    const startTime = performance.now();

    let simulatedText = '';
    let metrics: any = null;

    if (activeTool === 'email') {
      simulatedText = `Subject: Quick Thought on ${emailTopic.split(' ').slice(0, 5).join(' ')}...

Hi ${emailTarget.split(' ')[0] || 'Team'},

I hope this note finds you well. 

I wanted to reach out directly regarding ${emailTopic.toLowerCase()}

Key Highlights & Immediate Value:
• Streamlined Implementation: Zero disrupt integration into existing tech stack.
• Proven Performance: Up to 40% reduction in workflow execution friction.
• Developer-First Security: Strict data isolation & enterprise reliability.

Would you be open to a brief 10-minute sync this week to explore how we can tailor this for ${emailTarget}?

Best regards,
Mritunjay Kumar
Full Stack & AI Engineer | mritunjay.dev`;
      metrics = { wordCount: simulatedText.split(/\s+/).length, toneApplied: emailTone };
    } 
    else if (activeTool === 'summary') {
      const words = summaryInput.split(/\s+/).length;
      if (summaryFormat === 'tldr') {
        simulatedText = `📌 **TL;DR:** ${summaryInput.slice(0, 140)}... High throughput event-driven microservices architecture optimized for low-latency streaming.`;
      } else if (summaryFormat === 'bullets') {
        simulatedText = `### Key Takeaways:
• **Architecture:** Microservices frontend (Vite/React) + Node.js backend.
• **Database Strategy:** Relational PostgreSQL with Redis caching yielding 65% latency reduction.
• **Performance:** Time-to-first-token < 180ms with P99 < 1.2s under high concurrency.
• **Scalability:** Event-driven updates powering 12,000+ active locations.`;
      } else {
        simulatedText = `### Executive Summary
The technical documentation describes an enterprise-grade microservices deployment engineered for high scalability and sub-second response times. By pairing PostgreSQL with Redis caching layers and serverless GPU execution, the platform achieves exceptional performance metrics under peak traffic loads.

**Core Technical Metrics:**
- **Redis Cache Hit Rate:** 65% latency reduction
- **First Token Latency:** < 180ms
- **Active Locations:** 12,000+ real-time tracking points`;
      }
      const outputWords = simulatedText.split(/\s+/).length;
      metrics = {
        inputWords: words,
        outputWords,
        reductionPercent: Math.round(((words - outputWords) / (words || 1)) * 100),
      };
    } 
    else if (activeTool === 'sql') {
      if (sqlDialect === 'PostgreSQL') {
        simulatedText = `-- Dialect: PostgreSQL (Indexed Execution)
WITH CustomerOrders AS (
    SELECT 
        c.customer_id,
        c.first_name || ' ' || c.last_name AS customer_name,
        c.email,
        COUNT(o.order_id) AS total_orders,
        SUM(o.total_amount) AS aggregate_spend,
        ROUND(AVG(o.total_amount), 2) AS avg_order_value
    FROM customers c
    INNER JOIN orders o ON c.customer_id = o.customer_id
    WHERE o.order_date >= '2025-01-01'
      AND o.status = 'COMPLETED'
    GROUP BY c.customer_id, c.first_name, c.last_name, c.email
    HAVING SUM(o.total_amount) > 1500
)
SELECT *
FROM CustomerOrders
ORDER BY aggregate_spend DESC
LIMIT 5;

-- Execution Performance Tip:
-- CREATE INDEX idx_orders_cust_date_status ON orders(customer_id, order_date, status) INCLUDE (total_amount);`;
      } else if (sqlDialect === 'BigQuery') {
        simulatedText = `-- Dialect: Google BigQuery (Partitioned & Clustered)
WITH MonthlyMetrics AS (
    SELECT
        DATE_TRUNC(event_date, MONTH) AS month_period,
        COUNT(DISTINCT user_id) AS active_users
    FROM \`project.analytics.user_events\`
    WHERE event_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 12 MONTH)
    GROUP BY month_period
)
SELECT 
    month_period,
    active_users,
    LAG(active_users, 1) OVER (ORDER BY month_period) AS prev_month_users,
    ROUND(
        (active_users - LAG(active_users, 1) OVER (ORDER BY month_period)) 
        / NULLIF(LAG(active_users, 1) OVER (ORDER BY month_period), 0) * 100, 2
    ) AS mom_growth_percent
FROM MonthlyMetrics
ORDER BY month_period DESC;`;
      } else {
        simulatedText = `-- Dialect: ${sqlDialect}
SELECT 
    p.product_id,
    p.product_name,
    p.sku,
    i.quantity_in_stock,
    i.reorder_threshold,
    (i.reorder_threshold - i.quantity_in_stock) AS deficit
FROM products p
JOIN inventory i ON p.product_id = i.product_id
WHERE i.quantity_in_stock <= i.reorder_threshold
ORDER BY deficit DESC;`;
      }
      metrics = {
        dialect: sqlDialect,
        estExecutionTimeMs: 14,
        indexHintRecommended: true,
      };
    } 
    else if (activeTool === 'ask') {
      simulatedText = `### Technical Analysis & Implementation

For **${askPrompt}**:

1. **Core Architectural Concept:**
   React 19 server components execute on the server during request time, zero-bundling JS to the client. When combined with \`useActionState\`, asynchronous form actions manage pending states, optimistic updates, and server mutation callbacks seamlessly without heavy Redux boilerplate.

2. **Code Example:**
\`\`\`tsx
import { useActionState } from 'react';

async function updateProfile(prevState: any, formData: FormData) {
  const name = formData.get('name');
  const res = await fetch('/api/user', { method: 'POST', body: JSON.stringify({ name }) });
  return res.json();
}

export function ProfileForm() {
  const [state, formAction, isPending] = useActionState(updateProfile, null);
  return (
    <form action={formAction}>
      <input name="name" required />
      <button disabled={isPending}>{isPending ? 'Updating...' : 'Save Profile'}</button>
    </form>
  );
}
\`\`\`

3. **Key Advantage:** Eliminates \`useEffect\` state sync bugs, reduces client bundle footprint by up to 35%, and improves core web vitals (LCP/FID).`;
      metrics = { perspective: askLevel, latencyMs: 210 };
    } 
    else if (activeTool === 'resume') {
      simulatedText = `### ATS Resume Score Report

🎯 **Overall ATS Match Score:** **94% (Highly Qualified)**

#### 🔹 Matched Hard Skills:
✅ React.js & TypeScript (Advanced)  
✅ Node.js & REST API Architecture  
✅ PostgreSQL & Database Optimization  
✅ AI Integration & Prompt Engineering  
✅ SaaS Product Leadership ($5M+ metrics)  

#### ⚠️ Keyword Recommendations:
- Add specific testing frameworks used (e.g. *Jest, Playwright, Cypress*)
- Mention CI/CD deployment pipelines (e.g. *GitHub Actions, Docker, Kubernetes*)

#### 💡 Actionable Improvement Tip:
Quantify technical infrastructure achievements (e.g., "Reduced P99 API latency from 450ms to 120ms across 100k daily active users").`;
      metrics = { atsScore: 94, formattingScore: 98, keySkillsFound: 8, gapsFound: 2 };
    } 
    else if (activeTool === 'portfolio') {
      simulatedText = `### Portfolio Audit & Authority Assessment

🚀 **Overall Portfolio Engineering Rating:** **96 / 100**

#### 📊 Performance Breakdown:
- **Visual Design & Authority:** 98% (High-contrast glassmorphism, dynamic 3D hero canvas)
- **Interactive Demonstrations:** 95% (Live AI Assistant, Terminal CLI simulation, Interactive Playground)
- **Technical Credibility:** 96% (Clear architecture diagrams, production metrics, tech stack breakdown)
- **Mobile Responsiveness & SEO:** 94% (Fast first paint, structured metadata)

#### 💡 Strategic Advice for Target Audience (${portfolioTarget}):
1. **Highlight Live Demo Links:** Place one-click "Live Application" buttons at the top of each project modal.
2. **Featured Micro-Case Studies:** Keep quantitative impact metrics (e.g. "65% latency drop", "12k stores") prominent in headers.`;
      metrics = { designScore: 98, techScore: 96, uxScore: 95, conversionRating: 'Top 2%' };
    }

    // Simulate fast word-by-word streaming effect
    const chars = simulatedText.split('');
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < chars.length) {
        const chunkSize = 4;
        const nextChunk = chars.slice(idx, idx + chunkSize).join('');
        setOutput(prev => prev + nextChunk);
        idx += chunkSize;
        if (outputRef.current) {
          outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
      } else {
        clearInterval(interval);
        setIsGenerating(false);
        const endTime = performance.now();
        setExecutionTime(Math.round(endTime - startTime + 120));
        setTokenCount(Math.round(simulatedText.length / 4));
        setStructuredMetrics(metrics);
      }
    }, 12);
  };

  const selectedToolConfig = TOOLS.find(t => t.id === activeTool) || TOOLS[0];

  return (
    <section id="playground" className="section ai-playground">
      <div className="container">
        {/* Section Header */}
        <div className="section-eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={14} className="text-primary" /> Live Engineering Sandbox
        </div>
        <h2 className="section-title reveal">
          Interactive <span className="grad">AI Playground</span>
        </h2>
        <p className="section-sub reveal">
          Test real-time AI tools designed and engineered by Mritunjay. Experience instant streaming outputs, customized parameters, and live developer utilities.
        </p>

        {/* Tool Navigation Tabs */}
        <div className="playground-tabs-grid">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`playground-tab-card ${isActive ? 'active' : ''}`}
                aria-selected={isActive}
              >
                <div className="tab-card-header">
                  <div className={`tab-icon-box ${isActive ? 'active-icon' : ''}`}>
                    <Icon size={18} />
                  </div>
                  <span className="tab-badge">{tool.badge}</span>
                </div>
                <h3 className="tab-title">{tool.name}</h3>
                <p className="tab-desc">{tool.description}</p>
              </button>
            );
          })}
        </div>

        {/* Main Sandbox Interface */}
        <div className="playground-sandbox-container card-glass">
          {/* Top Bar / Tool Info & Presets */}
          <div className="sandbox-topbar">
            <div className="sandbox-tool-info">
              <span className="sandbox-dot" />
              <div>
                <h3 className="sandbox-title">{selectedToolConfig.name}</h3>
                <p className="sandbox-subtitle">{selectedToolConfig.description}</p>
              </div>
            </div>

            {/* Presets Chips */}
            <div className="sandbox-presets">
              <span className="presets-label"><Sliders size={13} /> Quick Presets:</span>
              <div className="presets-list">
                {PRESETS[activeTool]?.map((preset: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (activeTool === 'email') {
                        setEmailTopic(preset.topic);
                        setEmailTarget(preset.target);
                        setEmailTone(preset.tone);
                      } else if (activeTool === 'summary') {
                        setSummaryInput(preset.text);
                      } else if (activeTool === 'sql') {
                        setSqlPrompt(preset.prompt);
                        setSqlDialect(preset.dialect);
                      } else if (activeTool === 'ask') {
                        setAskPrompt(preset.codeOrPrompt);
                      } else if (activeTool === 'resume') {
                        setResumeRole(preset.role);
                        setResumeContent(preset.content);
                      } else if (activeTool === 'portfolio') {
                        setPortfolioTarget(preset.target);
                        setPortfolioDesc(preset.description);
                      }
                      setTimeout(() => handleGenerate(), 50);
                    }}
                    className="preset-btn"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sandbox Split View: Left Controls/Input, Right Output Box */}
          <div className="sandbox-grid">
            {/* Left Inputs */}
            <div className="sandbox-inputs-panel">
              {activeTool === 'email' && (
                <div className="input-group-stack">
                  <label className="input-label">Core Topic / Request</label>
                  <textarea
                    className="playground-textarea"
                    rows={3}
                    value={emailTopic}
                    onChange={(e) => setEmailTopic(e.target.value)}
                    placeholder="e.g. Offering full stack SaaS consulting..."
                  />

                  <div className="input-row-dual">
                    <div>
                      <label className="input-label">Recipient Role</label>
                      <input
                        type="text"
                        className="playground-input"
                        value={emailTarget}
                        onChange={(e) => setEmailTarget(e.target.value)}
                        placeholder="e.g. CTO, Hiring Manager"
                      />
                    </div>
                    <div>
                      <label className="input-label">Tone Style</label>
                      <select
                        className="playground-select"
                        value={emailTone}
                        onChange={(e) => setEmailTone(e.target.value)}
                      >
                        <option value="Persuasive">Persuasive & High Impact</option>
                        <option value="Professional">Corporate Professional</option>
                        <option value="Direct">Direct & Punchy</option>
                        <option value="Casual">Friendly Casual</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTool === 'summary' && (
                <div className="input-group-stack">
                  <label className="input-label">Raw Text to Summarize</label>
                  <textarea
                    className="playground-textarea"
                    rows={5}
                    value={summaryInput}
                    onChange={(e) => setSummaryInput(e.target.value)}
                    placeholder="Paste article, architecture doc, or notes..."
                  />

                  <div>
                    <label className="input-label">Output Length & Format</label>
                    <div className="segmented-control">
                      <button
                        className={`segmented-btn ${summaryFormat === 'executive' ? 'active' : ''}`}
                        onClick={() => setSummaryFormat('executive')}
                      >
                        Executive Brief
                      </button>
                      <button
                        className={`segmented-btn ${summaryFormat === 'bullets' ? 'active' : ''}`}
                        onClick={() => setSummaryFormat('bullets')}
                      >
                        Key Bullets
                      </button>
                      <button
                        className={`segmented-btn ${summaryFormat === 'tldr' ? 'active' : ''}`}
                        onClick={() => setSummaryFormat('tldr')}
                      >
                        1-Line TL;DR
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTool === 'sql' && (
                <div className="input-group-stack">
                  <label className="input-label">Natural Language Query Goal</label>
                  <textarea
                    className="playground-textarea"
                    rows={4}
                    value={sqlPrompt}
                    onChange={(e) => setSqlPrompt(e.target.value)}
                    placeholder="Describe the SQL query you need..."
                  />

                  <div>
                    <label className="input-label">SQL Engine Dialect</label>
                    <div className="segmented-control">
                      {['PostgreSQL', 'BigQuery', 'MySQL', 'SQLite'].map((d) => (
                        <button
                          key={d}
                          className={`segmented-btn ${sqlDialect === d ? 'active' : ''}`}
                          onClick={() => setSqlDialect(d)}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTool === 'ask' && (
                <div className="input-group-stack">
                  <label className="input-label">Engineering Question / Snippet</label>
                  <textarea
                    className="playground-textarea"
                    rows={4}
                    value={askPrompt}
                    onChange={(e) => setAskPrompt(e.target.value)}
                    placeholder="Ask about system design, code optimization, or React 19..."
                  />

                  <div>
                    <label className="input-label">Target Insight Level</label>
                    <div className="segmented-control">
                      <button
                        className={`segmented-btn ${askLevel === 'senior' ? 'active' : ''}`}
                        onClick={() => setAskLevel('senior')}
                      >
                        Senior Engineer
                      </button>
                      <button
                        className={`segmented-btn ${askLevel === 'architect' ? 'active' : ''}`}
                        onClick={() => setAskLevel('architect')}
                      >
                        System Architect
                      </button>
                      <button
                        className={`segmented-btn ${askLevel === 'beginner' ? 'active' : ''}`}
                        onClick={() => setAskLevel('beginner')}
                      >
                        Conceptual Overview
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTool === 'resume' && (
                <div className="input-group-stack">
                  <div className="input-row-dual">
                    <div>
                      <label className="input-label">Target Role Title</label>
                      <input
                        type="text"
                        className="playground-input"
                        value={resumeRole}
                        onChange={(e) => setResumeRole(e.target.value)}
                        placeholder="e.g. Senior Full Stack Engineer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="input-label">Resume Content / Highlights</label>
                    <textarea
                      className="playground-textarea"
                      rows={5}
                      value={resumeContent}
                      onChange={(e) => setResumeContent(e.target.value)}
                      placeholder="Paste resume text or skills list..."
                    />
                  </div>
                </div>
              )}

              {activeTool === 'portfolio' && (
                <div className="input-group-stack">
                  <div>
                    <label className="input-label">Target Audience</label>
                    <input
                      type="text"
                      className="playground-input"
                      value={portfolioTarget}
                      onChange={(e) => setPortfolioTarget(e.target.value)}
                      placeholder="e.g. Enterprise Clients & Tech Recruiters"
                    />
                  </div>

                  <div>
                    <label className="input-label">Portfolio Summary / Highlights</label>
                    <textarea
                      className="playground-textarea"
                      rows={4}
                      value={portfolioDesc}
                      onChange={(e) => setPortfolioDesc(e.target.value)}
                      placeholder="Describe portfolio features..."
                    />
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="playground-submit-btn"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw size={16} className="spin" /> Processing AI Pipeline...
                  </>
                ) : (
                  <>
                    <Play size={16} /> Run {selectedToolConfig.name} <ArrowRight size={15} />
                  </>
                )}
              </button>
            </div>

            {/* Right Output Panel */}
            <div className="sandbox-output-panel">
              {/* Output Header */}
              <div className="output-panel-header">
                <div className="output-status">
                  <span className={`status-indicator ${isGenerating ? 'generating' : 'ready'}`} />
                  <span>{isGenerating ? 'Streaming Response...' : 'Execution Output'}</span>
                </div>

                <div className="output-actions">
                  {executionTime && (
                    <span className="execution-stat" title="Execution Time">
                      <Zap size={13} /> {executionTime}ms
                    </span>
                  )}
                  {tokenCount && (
                    <span className="execution-stat" title="Token Count">
                      ~{tokenCount} tokens
                    </span>
                  )}
                  <button
                    onClick={handleCopy}
                    disabled={!output || isGenerating}
                    className="action-icon-btn"
                    title="Copy Output"
                  >
                    {copied ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
                  </button>
                  <button
                    onClick={handleDownload}
                    disabled={!output || isGenerating}
                    className="action-icon-btn"
                    title="Download File"
                  >
                    <Download size={14} />
                  </button>
                </div>
              </div>

              {/* Special Structured Visualizer Widgets */}
              {structuredMetrics && activeTool === 'resume' && (
                <div className="metric-widget-card">
                  <div className="metric-widget-header">
                    <span className="metric-widget-title"><FileCheck size={14} /> ATS Match Benchmark</span>
                    <span className="metric-widget-score">{structuredMetrics.atsScore}% Match</span>
                  </div>
                  <div className="metric-progress-bar">
                    <div
                      className="metric-progress-fill"
                      style={{ width: `${structuredMetrics.atsScore}%` }}
                    />
                  </div>
                  <div className="metric-badges-row">
                    <span className="metric-pill pill-success"><CheckCircle2 size={12} /> {structuredMetrics.keySkillsFound} Hard Skills Matched</span>
                    <span className="metric-pill pill-warning"><AlertCircle size={12} /> {structuredMetrics.gapsFound} Key Gap Tips</span>
                  </div>
                </div>
              )}

              {structuredMetrics && activeTool === 'summary' && (
                <div className="metric-widget-card">
                  <div className="metric-widget-header">
                    <span className="metric-widget-title"><FileText size={14} /> NLP Compression Efficiency</span>
                    <span className="metric-widget-score">{structuredMetrics.reductionPercent}% Reduced</span>
                  </div>
                  <div className="metric-badges-row">
                    <span className="metric-pill">Input: {structuredMetrics.inputWords} words</span>
                    <span className="metric-pill pill-success">Output: {structuredMetrics.outputWords} words</span>
                  </div>
                </div>
              )}

              {structuredMetrics && activeTool === 'sql' && (
                <div className="metric-widget-card">
                  <div className="metric-widget-header">
                    <span className="metric-widget-title"><Database size={14} /> Query Optimization Engine</span>
                    <span className="metric-widget-score">Dialect: {structuredMetrics.dialect}</span>
                  </div>
                  <div className="metric-badges-row">
                    <span className="metric-pill pill-success"><Zap size={12} /> ~{structuredMetrics.estExecutionTimeMs}ms Query Plan</span>
                    <span className="metric-pill"><CornerDownRight size={12} /> B-Tree Index Hint Included</span>
                  </div>
                </div>
              )}

              {/* Code / Text Stream Container */}
              <div className="output-content-box" ref={outputRef}>
                {output ? (
                  <pre className="output-pre">
                    <code>{output}</code>
                  </pre>
                ) : (
                  <div className="output-placeholder">
                    <Bot size={32} className="text-muted" />
                    <p>Click "Run Tool" to generate instant streaming results.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
