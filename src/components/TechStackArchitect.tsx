import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Layers, Cpu, Database, Server, Cloud,
  ArrowRight, Check, Copy, RefreshCw,
  Zap, ShieldCheck, Box
} from 'lucide-react';

interface TechLayer {
  name: string;
  technology: string;
  reason: string;
  icon: typeof Server;
}

interface ArchitecturePlan {
  projectName: string;
  summary: string;
  layers: TechLayer[];
  estimatedCostMonthly: number;
  costBreakdown: { item: string; cost: string }[];
  timelineWeeks: string;
  milestones: { title: string; duration: string; deliverable: string }[];
  recommendedPatterns: string[];
}

const PRESET_IDEAS = [
  {
    title: 'AI Document Knowledge Base & Chat',
    description: 'A multi-tenant SaaS where companies upload PDFs and docs, index them into vector embeddings, and chat with an intelligent agent via streaming answers.',
  },
  {
    title: 'Real-Time Collaborative Whiteboard',
    description: 'A low-latency collaborative diagramming canvas with live multiplayer cursor sync, sub-20ms WebSocket messaging, and exportable vector boards.',
  },
  {
    title: 'Automated High-Volume Email Engine',
    description: 'An enterprise marketing and transactional dispatch platform handling 50k+ emails with bounce tracking, queue management, and warm-up analytics.',
  },
];

export default function TechStackArchitect() {
  const [prompt, setPrompt] = useState(PRESET_IDEAS[0].description);
  const [scale, setScale] = useState<'mvp' | 'scale' | 'enterprise'>('mvp');
  const [generating, setGenerating] = useState(false);
  const [copiedSpec, setCopiedSpec] = useState(false);
  const [plan, setPlan] = useState<ArchitecturePlan | null>(() => generatePlan(PRESET_IDEAS[0].description, 'mvp'));
  const navigate = useNavigate();

  function generatePlan(idea: string, targetScale: 'mvp' | 'scale' | 'enterprise'): ArchitecturePlan {
    const isAi = idea.toLowerCase().includes('ai') || idea.toLowerCase().includes('chat') || idea.toLowerCase().includes('agent');
    const isRealTime = idea.toLowerCase().includes('real-time') || idea.toLowerCase().includes('collaborative') || idea.toLowerCase().includes('sync');

    const layers: TechLayer[] = [
      {
        name: 'Client Interface Layer',
        technology: 'React 19 + TypeScript + Vite + Tailwind CSS',
        reason: 'Fastest client bundle delivery, sub-second HMR, strict type safety, and smooth Framer Motion micro-interactions.',
        icon: Layers,
      },
      {
        name: 'Application API & Business Logic',
        technology: isRealTime ? 'Node.js + Express + Socket.io (WebSockets)' : 'Node.js + Express REST / Vercel Edge Serverless',
        reason: isRealTime
          ? 'Sub-20ms bi-directional event dispatching with room management and resilient reconnection.'
          : 'High throughput event handling, lightweight containerization, and near-instant cold starts.',
        icon: Server,
      },
      {
        name: 'Relational Store & Vector Engine',
        technology: isAi ? 'PostgreSQL (Supabase) + pgvector' : 'PostgreSQL on Supabase with Row Level Security (RLS)',
        reason: isAi
          ? 'Stores structured customer data and high-dimensional embeddings in a single resilient PostgreSQL instance.'
          : 'ACID guarantees, automated backups, and built-in Auth integration.',
        icon: Database,
      },
      {
        name: 'AI Intelligence & Orchestration',
        technology: isAi ? 'OpenRouter API + Google Gemini 2.5 Flash with Streaming SSE' : 'Node.js Task Queues & Cron Automation',
        reason: isAi
          ? 'Cost-optimized multi-provider routing with ultra-fast time-to-first-token (<200ms).'
          : 'Background asynchronous processing without blocking web requests.',
        icon: Cpu,
      },
      {
        name: 'Caching & Session State',
        technology: 'Redis / Upstash In-Memory Store',
        reason: 'Rate-limiting, session cache, and pub/sub message brokering to relieve primary database load by 70%.',
        icon: Box,
      },
      {
        name: 'Deployment & Edge Infrastructure',
        technology: 'Vercel (Frontend & Edge APIs) + Render / AWS ECS (Long-running workers)',
        reason: 'Global CDN distribution, automated CI/CD branch deployments, and zero-downtime rollouts.',
        icon: Cloud,
      },
    ];

    const monthlyCost = targetScale === 'mvp' ? 35 : targetScale === 'scale' ? 120 : 450;
    const costBreakdown = targetScale === 'mvp'
      ? [
          { item: 'Vercel Hobby / Pro', cost: '$20/mo' },
          { item: 'Supabase Free / Pro Tier', cost: '$0 - $25/mo' },
          { item: 'Upstash Redis (Pay-per-request)', cost: '$0 - $5/mo' },
          { item: 'AI Token Usage (Gemini / OpenRouter)', cost: '$10 - $20/mo' },
        ]
      : targetScale === 'scale'
      ? [
          { item: 'Vercel Pro Team', cost: '$40/mo' },
          { item: 'Supabase Pro + Compute Add-on', cost: '$50/mo' },
          { item: 'Upstash Redis Pro', cost: '$15/mo' },
          { item: 'AI Token Ingestion', cost: '$60/mo' },
        ]
      : [
          { item: 'Vercel Enterprise / AWS ECS', cost: '$200/mo' },
          { item: 'Managed High-Availability Postgres', cost: '$120/mo' },
          { item: 'Dedicated Redis Cluster', cost: '$50/mo' },
          { item: 'High-Volume LLM Usage', cost: '$180/mo' },
        ];

    const milestones = [
      {
        title: 'Phase 1: Architecture & Schema Foundation',
        duration: 'Week 1 - 2',
        deliverable: 'Database ERD, Supabase auth setup, core API contracts, and project scaffolding.',
      },
      {
        title: 'Phase 2: Core Workflows & Business Logic',
        duration: 'Week 3 - 4',
        deliverable: isAi
          ? 'Vector indexing pipeline, prompt engineering, streaming SSE endpoints, and responsive UI.'
          : 'WebSocket rooms, business CRUD workflows, state synchronization, and dashboard view.',
      },
      {
        title: 'Phase 3: Hardening, Polish & Production Release',
        duration: 'Week 5 - 6',
        deliverable: 'End-to-end load testing, rate limiting, responsive mobile audit, and Vercel production deployment.',
      },
    ];

    return {
      projectName: idea.slice(0, 45) + (idea.length > 45 ? '...' : ''),
      summary: `A high-performance ${isAi ? 'AI-native' : 'modern'} architecture designed for zero latency, rock-solid data isolation, and low operational overhead. Engineered to scale efficiently from early beta to thousands of active users without costly rewrites.`,
      layers,
      estimatedCostMonthly: monthlyCost,
      costBreakdown,
      timelineWeeks: targetScale === 'mvp' ? '4 - 6 weeks' : '8 - 12 weeks',
      milestones,
      recommendedPatterns: [
        'Decoupled Frontend / Edge API Architecture',
        'Optimistic UI Updates for sub-50ms perceived speed',
        'Server-Sent Events (SSE) for continuous AI streaming',
        'Database Row Level Security (RLS) for multi-tenant isolation',
      ],
    };
  }

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setTimeout(() => {
      setPlan(generatePlan(prompt, scale));
      setGenerating(false);
    }, 700);
  };

  const handleCopySpec = () => {
    if (!plan) return;
    const spec = `### Technical Architecture Specification
Idea: ${prompt}
Scale: ${scale.toUpperCase()}
Est. Monthly Cloud Cost: ~$${plan.estimatedCostMonthly}/mo
Timeline: ${plan.timelineWeeks}

Stack:
${plan.layers.map((l) => `- ${l.name}: ${l.technology} (${l.reason})`).join('\n')}

Milestones:
${plan.milestones.map((m) => `- ${m.title} [${m.duration}]: ${m.deliverable}`).join('\n')}`;

    navigator.clipboard.writeText(spec);
    setCopiedSpec(true);
    setTimeout(() => setCopiedSpec(false), 2000);
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 12px',
            borderRadius: '999px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid var(--border-strong, rgba(255,255,255,0.16))',
            fontSize: '0.8rem',
            fontWeight: 500,
            marginBottom: '1rem',
          }}
        >
          <Sparkles size={14} style={{ color: 'var(--accent, #fff)' }} />
          <span>Interactive System Design & Cloud Blueprint Engine</span>
        </div>
        <h1
          style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            marginBottom: '0.75rem',
          }}
        >
          Startup Tech Stack Architect
        </h1>
        <p style={{ maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem', color: 'var(--text-muted, #999)' }}>
          Describe any software or startup concept. Instantly generate a production tech stack, cloud cost forecast, and actionable delivery roadmap.
        </p>
      </div>

      {/* Preset Ideas */}
      <div style={{ marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle, #777)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Select an idea or write your own:
        </span>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
          {PRESET_IDEAS.map((preset) => (
            <button
              key={preset.title}
              onClick={() => {
                setPrompt(preset.description);
                setPlan(generatePlan(preset.description, scale));
              }}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                background: prompt === preset.description ? 'var(--accent, #fff)' : 'var(--surface-2, #141414)',
                color: prompt === preset.description ? 'var(--accent-foreground, #000)' : 'var(--text, #fff)',
                border: '1px solid var(--border, rgba(255,255,255,0.12))',
                fontSize: '0.82rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div
        style={{
          background: 'var(--surface-2, #0e0e0e)',
          border: '1px solid var(--border-strong, rgba(255, 255, 255, 0.2))',
          borderRadius: '16px',
          padding: '1.25rem',
          marginBottom: '2.5rem',
          boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
        }}
      >
        <textarea
          id="architect-idea"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your product idea (e.g. AI customer support agent with Zendesk integration and real-time dashboard)..."
          rows={3}
          style={{
            width: '100%',
            background: 'var(--surface, #060606)',
            border: '1px solid var(--border, rgba(255,255,255,0.12))',
            borderRadius: '10px',
            padding: '0.85rem',
            color: 'var(--text, #fff)',
            fontSize: '0.9rem',
            lineHeight: 1.6,
            resize: 'vertical',
            outline: 'none',
          }}
        />

        {/* Scale Selector & Submit */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '12px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted, #888)' }}>Target Scale:</span>
            {(['mvp', 'scale', 'enterprise'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setScale(s)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: scale === s ? 'var(--surface-3, #222)' : 'transparent',
                  border: scale === s ? '1px solid var(--accent, #fff)' : '1px solid var(--border-soft, rgba(255,255,255,0.1))',
                  color: scale === s ? 'var(--accent, #fff)' : 'var(--text-muted, #888)',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '10px',
              background: 'var(--accent, #fff)',
              color: 'var(--accent-foreground, #000)',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: generating ? 'not-allowed' : 'pointer',
              opacity: generating ? 0.7 : 1,
            }}
          >
            {generating ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Designing Architecture...</span>
              </>
            ) : (
              <>
                <Zap size={16} />
                <span>Generate Architecture Blueprint</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Plan Results */}
      {plan && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}
          >
            {/* Overview & Quick Stats */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {/* Summary */}
              <div
                style={{
                  background: 'var(--surface-2, #0e0e0e)',
                  border: '1px solid var(--border, rgba(255,255,255,0.15))',
                  borderRadius: '16px',
                  padding: '1.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <ShieldCheck size={18} style={{ color: '#22c55e' }} />
                  <span style={{ fontSize: '0.8rem', color: '#22c55e', textTransform: 'uppercase', fontWeight: 600 }}>
                    Architectural Strategy
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text, #fff)', marginBottom: '8px' }}>
                  Engineered for Velocity & Scale
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted, #999)', lineHeight: 1.6 }}>
                  {plan.summary}
                </p>
              </div>

              {/* Cost & Timeline Card */}
              <div
                style={{
                  background: 'var(--surface-2, #0e0e0e)',
                  border: '1px solid var(--border, rgba(255,255,255,0.15))',
                  borderRadius: '16px',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #888)', textTransform: 'uppercase' }}>
                        Est. Cloud Infrastructure
                      </span>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text, #fff)', marginTop: '2px' }}>
                        ~${plan.estimatedCostMonthly}
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted, #888)', fontWeight: 400 }}> / month</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #888)', textTransform: 'uppercase' }}>
                        Delivery Time
                      </span>
                      <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent, #fff)', marginTop: '4px' }}>
                        {plan.timelineWeeks}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {plan.costBreakdown.map((c) => (
                      <div
                        key={c.item}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '0.76rem',
                          color: 'var(--text-muted, #aaa)',
                          padding: '2px 0',
                          borderBottom: '1px dashed var(--border-soft, rgba(255,255,255,0.06))',
                        }}
                      >
                        <span>{c.item}</span>
                        <span style={{ color: 'var(--text, #fff)', fontWeight: 500 }}>{c.cost}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => navigate('/book-call')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      background: 'var(--accent, #fff)',
                      color: 'var(--accent-foreground, #000)',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <span>Hire Mritunjay to Build This</span>
                    <ArrowRight size={14} />
                  </button>
                  <button
                    onClick={handleCopySpec}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      background: 'var(--surface-3, #1c1c1c)',
                      color: 'var(--text, #fff)',
                      border: '1px solid var(--border, rgba(255,255,255,0.12))',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                    }}
                  >
                    {copiedSpec ? <Check size={14} style={{ color: '#22c55e' }} /> : <Copy size={14} />}
                    <span>{copiedSpec ? 'Copied Spec' : 'Copy Blueprint'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Architecture Stack Layers */}
            <div
              style={{
                background: 'var(--surface-2, #0e0e0e)',
                border: '1px solid var(--border, rgba(255,255,255,0.12))',
                borderRadius: '16px',
                padding: '1.75rem',
              }}
            >
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text, #fff)', marginBottom: '1.25rem' }}>
                System Architecture & Tech Stack Hierarchy
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                {plan.layers.map((layer) => {
                  const Icon = layer.icon;
                  return (
                    <div
                      key={layer.name}
                      style={{
                        background: 'var(--surface, #060606)',
                        border: '1px solid var(--border-soft, rgba(255,255,255,0.08))',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        display: 'flex',
                        gap: '14px',
                      }}
                    >
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          background: 'var(--surface-3, #1a1a1a)',
                          border: '1px solid var(--border, rgba(255,255,255,0.1))',
                          display: 'grid',
                          placeItems: 'center',
                          flexShrink: 0,
                          color: 'var(--accent, #fff)',
                        }}
                      >
                        <Icon size={18} />
                      </div>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle, #777)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {layer.name}
                        </span>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text, #fff)', marginTop: '2px' }}>
                          {layer.technology}
                        </h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted, #888)', marginTop: '6px', lineHeight: 1.5 }}>
                          {layer.reason}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery Milestones */}
            <div
              style={{
                background: 'var(--surface-2, #0e0e0e)',
                border: '1px solid var(--border, rgba(255,255,255,0.12))',
                borderRadius: '16px',
                padding: '1.75rem',
              }}
            >
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text, #fff)', marginBottom: '1.25rem' }}>
                Engineering Execution Roadmap
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {plan.milestones.map((m, idx) => (
                  <div
                    key={m.title}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '14px',
                      padding: '1rem 1.25rem',
                      borderRadius: '12px',
                      background: 'var(--surface, #060606)',
                      border: '1px solid var(--border-soft, rgba(255,255,255,0.06))',
                    }}
                  >
                    <div
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        background: 'var(--surface-3, #1c1c1c)',
                        color: 'var(--text, #fff)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: 0,
                        marginTop: '2px',
                      }}
                    >
                      {idx + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text, #fff)' }}>
                          {m.title}
                        </h4>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: 'rgba(255,255,255,0.08)',
                            color: 'var(--text-muted, #aaa)',
                          }}
                        >
                          {m.duration}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted, #888)', marginTop: '4px' }}>
                        {m.deliverable}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
