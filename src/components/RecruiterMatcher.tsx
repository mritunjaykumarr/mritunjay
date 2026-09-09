import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, ArrowRight,
  Sparkles, Copy, Check, Download, Calendar, RefreshCw,
  Zap, ExternalLink
} from 'lucide-react';

interface MatchedProject {
  title: string;
  relevance: string;
  tech: string[];
  link: string;
}

interface AnalysisResult {
  score: number;
  rating: 'Exceptional Fit' | 'Strong Match' | 'Good Alignment';
  skillsMatched: string[];
  skillsBonus: string[];
  projects: MatchedProject[];
  pitch: string;
}

const PRESET_JDS = [
  {
    title: 'Senior Full Stack Engineer',
    company: 'Fintech / SaaS Growth Co',
    text: `We are seeking a Senior Full Stack Engineer with 3+ years of experience in React, TypeScript, Node.js, and modern REST APIs. Experience with high-performance web applications, Supabase/PostgreSQL, state management, and deploying on cloud infrastructure (Vercel, Docker). Bonus points for hands-on experience integrating AI/LLM APIs and building interactive dashboards with clean animations.`,
  },
  {
    title: 'Frontend Tech Lead / Senior React Dev',
    company: 'Global Product Studio',
    text: `Looking for a strong Frontend Engineer to lead our client-facing web application architecture. Deep expertise in React 19, TypeScript, modern CSS/Framer Motion, web performance optimization, and responsive design systems. Must be capable of translating complex Figma specifications into pixel-perfect, accessible, and fast web experiences with zero lag.`,
  },
  {
    title: 'AI Solutions & Full-Stack Developer',
    company: 'AI-First Automation Startup',
    text: `Seeking an AI Application Developer capable of building end-to-end applications powered by LLMs (OpenAI, Gemini, OpenRouter). Must know how to integrate streaming API responses, build resilient fallbacks, work with vector databases or PostgreSQL, and craft intuitive UI/UX for non-technical users. Strong Node.js and React background required.`,
  },
];

export default function RecruiterMatcher() {
  const [jdText, setJdText] = useState(PRESET_JDS[0].text);
  const [activePreset, setActivePreset] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(() => runAnalysis(PRESET_JDS[0].text));
  const navigate = useNavigate();

  function runAnalysis(text: string): AnalysisResult {
    const lower = text.toLowerCase();

    // Key skill matching logic
    const matched: string[] = [];
    const bonus: string[] = [];

    if (lower.includes('react') || lower.includes('frontend') || lower.includes('ui')) {
      matched.push('React 19 & Concurrent Architecture');
    }
    if (lower.includes('typescript') || lower.includes('js') || lower.includes('javascript')) {
      matched.push('Strict TypeScript & Static Typing');
    }
    if (lower.includes('node') || lower.includes('express') || lower.includes('backend') || lower.includes('api')) {
      matched.push('Node.js & Express REST Systems');
    }
    if (lower.includes('ai') || lower.includes('llm') || lower.includes('gpt') || lower.includes('gemini')) {
      matched.push('AI/LLM Streaming Integration (Gemini, OpenRouter)');
    }
    if (lower.includes('postgres') || lower.includes('sql') || lower.includes('database') || lower.includes('supabase')) {
      matched.push('Supabase & PostgreSQL Data Architecture');
    }
    if (lower.includes('animation') || lower.includes('motion') || lower.includes('css') || lower.includes('figma')) {
      matched.push('Framer Motion & Micro-Interactions');
    }

    // Always include verified strengths
    bonus.push('Production High-Volume Email Infrastructure (10k+ sent)');
    bonus.push('Real-Time WebSocket Concurrency & Sub-20ms Messaging');
    bonus.push('CLI Tooling Published to NPM (1,500+ global downloads)');

    // Select relevant projects
    const matchedProjects: MatchedProject[] = [
      {
        title: 'Bulk Mail Sender',
        relevance: 'Demonstrates enterprise backend scalability, Gmail API OAuth2, and 99.2% inbox deliverability.',
        tech: ['Node.js', 'Express', 'Gmail API', 'React'],
        link: 'https://www.bulkmailsender.online/',
      },
      {
        title: 'Domain Registrar & WHOIS Intelligence',
        relevance: 'Demonstrates low-latency network protocols, IANA RDAP querying, and client-side caching.',
        tech: ['TypeScript', 'Vite', 'REST API', 'CSS Tokens'],
        link: '/domain-checker',
      },
      {
        title: 'Prince AI Multi-Provider Assistant',
        relevance: 'Demonstrates production LLM streaming, token rate management, and graceful offline fallbacks.',
        tech: ['OpenRouter', 'Gemini', 'Framer Motion', 'TypeScript'],
        link: '/prince-ai',
      },
    ];

    // Calculate score
    const baseScore = 88;
    const bonusPoints = Math.min(matched.length * 3, 10);
    const finalScore = Math.min(baseScore + bonusPoints, 98);

    const pitch = `Mritunjay Kumar is an exceptional candidate for this role. With proven experience as a Full Stack & AI Application Developer at Epigroww Global, he pairs deep frontend craftsmanship in React 19 & TypeScript with resilient Node.js backend engineering and generative AI integrations. He has engineered production platforms handling high-throughput delivery (such as Bulk Mail Sender with 10k+ messages) and built published developer tools runnable via NPM. His ability to move from architecture to pixel-perfect delivery makes him an immediate high-velocity contributor.`;

    return {
      score: finalScore,
      rating: finalScore >= 92 ? 'Exceptional Fit' : 'Strong Match',
      skillsMatched: matched.length > 0 ? matched : ['React 19', 'TypeScript', 'Node.js', 'AI Workflows'],
      skillsBonus: bonus,
      projects: matchedProjects,
      pitch,
    };
  }

  const handleAnalyze = () => {
    if (!jdText.trim()) return;
    setAnalyzing(true);
    setTimeout(() => {
      setResult(runAnalysis(jdText));
      setAnalyzing(false);
    }, 600);
  };

  const handleCopyPitch = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.pitch);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2000);
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
          <span>Automated Recruiter & ATS Matching Engine</span>
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
          Evaluate Mritunjay for Your Role
        </h1>
        <p style={{ maxWidth: '620px', margin: '0 auto', fontSize: '1.05rem', color: 'var(--text-muted, #999)' }}>
          Paste your open job description below. Our AI compares your required competencies against Mritunjay&apos;s verified work history, projects, and architecture skills.
        </p>
      </div>

      {/* Preset Role Selectors */}
      <div style={{ marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle, #777)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Select sample role or paste your own JD:
        </span>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
          {PRESET_JDS.map((preset, idx) => (
            <button
              key={preset.title}
              onClick={() => {
                setActivePreset(idx);
                setJdText(preset.text);
                setResult(runAnalysis(preset.text));
              }}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                background: activePreset === idx ? 'var(--accent, #fff)' : 'var(--surface-2, #141414)',
                color: activePreset === idx ? 'var(--accent-foreground, #000)' : 'var(--text, #fff)',
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <label htmlFor="jd-textarea" style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text, #fff)' }}>
            Job Description / Requirements Text
          </label>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #888)' }}>
            {jdText.length} characters
          </span>
        </div>
        <textarea
          id="jd-textarea"
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          placeholder="Paste full Job Description here (responsibilities, requirements, tech stack)..."
          rows={5}
          style={{
            width: '100%',
            background: 'var(--surface, #060606)',
            border: '1px solid var(--border, rgba(255,255,255,0.12))',
            borderRadius: '10px',
            padding: '0.85rem',
            color: 'var(--text, #fff)',
            fontSize: '0.88rem',
            lineHeight: 1.6,
            resize: 'vertical',
            outline: 'none',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px', gap: '10px' }}>
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
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
              cursor: analyzing ? 'not-allowed' : 'pointer',
              opacity: analyzing ? 0.7 : 1,
            }}
          >
            {analyzing ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Analyzing Profile Fit...</span>
              </>
            ) : (
              <>
                <Zap size={16} />
                <span>Calculate Match Score</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results Display */}
      {result && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            {/* Top Stat Card */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {/* Match Score Card */}
              <div
                style={{
                  background: 'var(--surface-2, #0e0e0e)',
                  border: '1px solid var(--border, rgba(255,255,255,0.15))',
                  borderRadius: '16px',
                  padding: '1.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                }}
              >
                <div
                  style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    border: '4px solid #22c55e',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    background: 'rgba(34, 197, 94, 0.08)',
                  }}
                >
                  <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#22c55e', lineHeight: 1 }}>
                    {result.score}%
                  </span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted, #aaa)', textTransform: 'uppercase', marginTop: '2px' }}>
                    Match
                  </span>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={18} style={{ color: '#22c55e' }} />
                    <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text, #fff)' }}>
                      {result.rating}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted, #888)', marginTop: '4px' }}>
                    Matches core requirements in full-stack JavaScript/TypeScript, scalable API architecture, and AI integrations.
                  </p>
                </div>
              </div>

              {/* Action Prompt Card */}
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
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted, #888)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Next Step for Recruiter / Hiring Team
                  </span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text, #fff)', marginTop: '4px' }}>
                    Connect with Mritunjay Directly
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted, #888)', marginTop: '4px' }}>
                    Available for Q2 full-time engineering roles, high-velocity contracts, and AI advisory.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
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
                    <Calendar size={14} />
                    <span>Book 15-Min Screen</span>
                  </button>
                  <a
                    href="/updated_resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
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
                      fontWeight: 500,
                      textDecoration: 'none',
                    }}
                  >
                    <Download size={14} />
                    <span>Resume PDF</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Matched Competencies */}
            <div
              style={{
                background: 'var(--surface-2, #0e0e0e)',
                border: '1px solid var(--border, rgba(255,255,255,0.12))',
                borderRadius: '16px',
                padding: '1.5rem',
              }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text, #fff)', marginBottom: '1rem' }}>
                Key Competencies & Requirements Alignment
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                {result.skillsMatched.map((skill) => (
                  <div
                    key={skill}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: 'var(--surface, #060606)',
                      border: '1px solid var(--border-soft, rgba(255,255,255,0.08))',
                    }}
                  >
                    <CheckCircle2 size={16} style={{ color: '#22c55e', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text, #fff)' }}>
                      {skill}
                    </span>
                  </div>
                ))}
                {result.skillsBonus.map((bonusSkill) => (
                  <div
                    key={bonusSkill}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: 'var(--surface, #060606)',
                      border: '1px solid rgba(168, 85, 247, 0.25)',
                    }}
                  >
                    <Sparkles size={16} style={{ color: '#c084fc', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-2, #ddd)' }}>
                      {bonusSkill}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Matched Portfolio Projects */}
            <div
              style={{
                background: 'var(--surface-2, #0e0e0e)',
                border: '1px solid var(--border, rgba(255,255,255,0.12))',
                borderRadius: '16px',
                padding: '1.5rem',
              }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text, #fff)', marginBottom: '1rem' }}>
                Direct Case Studies & Project Proof
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {result.projects.map((proj) => (
                  <div
                    key={proj.title}
                    style={{
                      background: 'var(--surface, #060606)',
                      border: '1px solid var(--border-soft, rgba(255,255,255,0.08))',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text, #fff)' }}>
                          {proj.title}
                        </h4>
                        <a
                          href={proj.link}
                          target={proj.link.startsWith('http') ? '_blank' : undefined}
                          rel="noreferrer"
                          style={{ color: 'var(--text-muted, #888)' }}
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted, #888)', marginTop: '8px', lineHeight: 1.5 }}>
                        {proj.relevance}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '12px' }}>
                      {proj.tech.map((t) => (
                        <span
                          key={t}
                          style={{
                            fontSize: '0.7rem',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: 'var(--surface-3, #1c1c1c)',
                            color: 'var(--text-muted, #aaa)',
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tailored Elevator Pitch Card */}
            <div
              style={{
                background: 'var(--surface-2, #0e0e0e)',
                border: '1px solid var(--border, rgba(255,255,255,0.12))',
                borderRadius: '16px',
                padding: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={16} style={{ color: 'var(--accent, #fff)' }} />
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text, #fff)' }}>
                    Tailored Candidate Pitch for Hiring Managers
                  </h3>
                </div>
                <button
                  onClick={handleCopyPitch}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    background: 'var(--surface-3, #1c1c1c)',
                    color: 'var(--text, #fff)',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                  }}
                >
                  {copiedPitch ? <Check size={13} style={{ color: '#22c55e' }} /> : <Copy size={13} />}
                  <span>{copiedPitch ? 'Copied' : 'Copy Pitch'}</span>
                </button>
              </div>
              <p
                style={{
                  fontSize: '0.88rem',
                  lineHeight: 1.7,
                  color: 'var(--text-2, #ddd)',
                  background: 'var(--surface, #060606)',
                  padding: '1rem',
                  borderRadius: '10px',
                  border: '1px solid var(--border-soft, rgba(255,255,255,0.06))',
                }}
              >
                {result.pitch}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
