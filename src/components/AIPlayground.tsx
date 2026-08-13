import { useState, useRef, useEffect, useCallback } from 'react';
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
    { label: 'Project Follow-up', topic: 'Checking status on software integration proposal sent last Friday.', target: 'Product Director', tone: 'Professional' },
    { label: 'Technical Bug Escalation', topic: 'Reporting API rate limit bottleneck during peak traffic spikes.', target: 'DevOps Lead', tone: 'Direct' },
  ],
  summary: [
    { label: 'System Architecture Doc', text: `The SaaS platform utilizes a decoupled microservices architecture with a React Vite frontend hosted on Cloudflare Pages, communicating via GraphQL and REST endpoints with Node.js microservices. PostgreSQL serves as the primary relational store with Redis caching layer reducing database latency by 65%. Event-driven data updates flow via WebSockets for live tracking across active locations.` },
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
  const [structuredMetrics, setStructuredMetrics] = useState<Record<string, React.ReactNode> | null>(null);

  const outputRef = useRef<HTMLDivElement>(null);

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    setOutput('');
    setStructuredMetrics(null);
    const startTime = performance.now();

    let simulatedText = '';
    let metrics: Record<string, React.ReactNode> | null = null;

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
    } else {
      simulatedText = `📌 **TL;DR:** ${summaryInput.slice(0, 140)}... High throughput event-driven microservices architecture optimized for low-latency streaming.`;
      metrics = { inputWords: summaryInput.split(/\s+/).length, reductionPercent: 75 };
    }

    let currentLength = 0;
    const interval = setInterval(() => {
      currentLength += Math.floor(Math.random() * 8) + 4;
      if (currentLength >= simulatedText.length) {
        setOutput(simulatedText);
        setIsGenerating(false);
        setExecutionTime(Math.round(performance.now() - startTime));
        setTokenCount(Math.round(simulatedText.length / 4));
        setStructuredMetrics(metrics);
        clearInterval(interval);
      } else {
        setOutput(simulatedText.slice(0, currentLength));
      }
    }, 12);
  }, [activeTool, emailTopic, emailTarget, emailTone, summaryInput]);

  // Trigger initial generation preview when tab switches
  useEffect(() => {
    const timer = setTimeout(() => {
      handleGenerate();
    }, 0);
    return () => clearTimeout(timer);
  }, [handleGenerate]);

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
                {PRESETS[activeTool]?.map((presetItem: Record<string, string>, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (activeTool === 'email') {
                        setEmailTopic(presetItem.topic || '');
                        setEmailTarget(presetItem.target || '');
                        setEmailTone(presetItem.tone || '');
                      } else if (activeTool === 'summary') {
                        setSummaryInput(presetItem.text || '');
                      } else if (activeTool === 'sql') {
                        setSqlPrompt(presetItem.prompt || '');
                        setSqlDialect(presetItem.dialect || 'PostgreSQL');
                      } else if (activeTool === 'ask') {
                        setAskPrompt(presetItem.codeOrPrompt || '');
                      } else if (activeTool === 'resume') {
                        setResumeRole(presetItem.role || '');
                        setResumeContent(presetItem.content || '');
                      } else if (activeTool === 'portfolio') {
                        setPortfolioTarget(presetItem.target || '');
                        setPortfolioDesc(presetItem.description || '');
                      }
                      setTimeout(() => handleGenerate(), 50);
                    }}
                    className="preset-btn"
                  >
                    {presetItem.label}
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
