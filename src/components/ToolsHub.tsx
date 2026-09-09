import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sliders, Globe, Copy, Check, Sparkles,
  ArrowRight, Layers
} from 'lucide-react';

type TabType = 'og-preview' | 'json-ts' | 'dev-utils';

export default function ToolsHub() {
  const [activeTab, setActiveTab] = useState<TabType>('og-preview');
  const navigate = useNavigate();

  // Tool 1: OG Previewer state
  const [ogTitle, setOgTitle] = useState('Next-Gen AI Platform | High Velocity Development');
  const [ogDesc, setOgDesc] = useState('Building resilient AI-first SaaS tools, real-time event systems, and modern web applications with React 19 & TypeScript.');
  const [ogImage, setOgImage] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80');
  const [ogUrl, setOgUrl] = useState('https://mritify.online');
  const [copiedMeta, setCopiedMeta] = useState(false);

  // Tool 2: JSON to TypeScript state
  const [jsonInput, setJsonInput] = useState(`{
  "user": {
    "id": "usr_99182",
    "name": "Mritunjay Kumar",
    "email": "me@mritify.online",
    "role": "Full Stack Architect",
    "isVerified": true,
    "skills": ["React 19", "TypeScript", "Node.js", "AI APIs"],
    "metrics": {
      "projectsDelivered": 15,
      "uptimePercentage": 99.98
    }
  }
}`);
  const [tsOutput, setTsOutput] = useState('');
  const [copiedTs, setCopiedTs] = useState(false);

  // Tool 3: Dev utils state
  const [rawText, setRawText] = useState('Hello from Mritunjay SaaS Suite!');
  const [base64Result, setBase64Result] = useState('');
  const [uuidList, setUuidList] = useState<string[]>([]);

  // Convert JSON to TS Interface
  const convertJsonToTs = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const generated = generateTypescriptInterfaces(parsed, 'RootResponse');
      setTsOutput(generated);
    } catch {
      setTsOutput('// ❌ Invalid JSON syntax. Please check for trailing commas or unquoted keys.');
    }
  };

  function generateTypescriptInterfaces(obj: unknown, rootName = 'Root'): string {
    const interfaces: string[] = [];

    function parseType(val: unknown, name: string): string {
      if (val === null) return 'null';
      if (Array.isArray(val)) {
        if (val.length === 0) return 'any[]';
        const itemType = parseType(val[0], `${name}Item`);
        return `${itemType}[]`;
      }
      if (typeof val === 'object') {
        const subInterfaceName = name.charAt(0).toUpperCase() + name.slice(1);
        const fields: string[] = [];
        for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
          const fieldType = parseType(v, `${subInterfaceName}_${k}`);
          fields.push(`  ${k}: ${fieldType};`);
        }
        interfaces.push(`export interface ${subInterfaceName} {\n${fields.join('\n')}\n}`);
        return subInterfaceName;
      }
      return typeof val;
    }

    const mainType = parseType(obj, rootName);
    if (typeof obj !== 'object' || Array.isArray(obj)) {
      return `export type ${rootName} = ${mainType};`;
    }
    return interfaces.reverse().join('\n\n');
  }

  // Initial TS conversion
  useState(() => {
    try {
      setTsOutput(generateTypescriptInterfaces(JSON.parse(jsonInput), 'RootResponse'));
    } catch {
      // ignore
    }
  });

  const handleCopyMeta = () => {
    const code = `<!-- OpenGraph & Social Meta Tags -->
<title>${ogTitle}</title>
<meta name="description" content="${ogDesc}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${ogUrl}" />
<meta property="og:title" content="${ogTitle}" />
<meta property="og:description" content="${ogDesc}" />
<meta property="og:image" content="${ogImage}" />

<!-- Twitter / X -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content="${ogUrl}" />
<meta name="twitter:title" content="${ogTitle}" />
<meta name="twitter:description" content="${ogDesc}" />
<meta name="twitter:image" content="${ogImage}" />`;

    navigator.clipboard.writeText(code);
    setCopiedMeta(true);
    setTimeout(() => setCopiedMeta(false), 2000);
  };

  const handleCopyTs = () => {
    if (!tsOutput) return;
    navigator.clipboard.writeText(tsOutput);
    setCopiedTs(true);
    setTimeout(() => setCopiedTs(false), 2000);
  };

  const handleGenerateUuids = () => {
    const list = Array.from({ length: 4 }, () => crypto.randomUUID());
    setUuidList(list);
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Header */}
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
          <Sliders size={14} style={{ color: 'var(--accent, #fff)' }} />
          <span>Productivity & Engineering Suite</span>
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
          Developer Micro-Tools Hub
        </h1>
        <p style={{ maxWidth: '620px', margin: '0 auto', fontSize: '1.05rem', color: 'var(--text-muted, #999)' }}>
          Free, fast, client-side utility engines for modern web developers, founders, and content engineers.
        </p>
      </div>

      {/* Quick Launch Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
          marginBottom: '2.5rem',
        }}
      >
        <div
          onClick={() => navigate('/domain-checker')}
          style={{
            background: 'var(--surface-2, #0e0e0e)',
            border: '1px solid var(--border-soft, rgba(255,255,255,0.08))',
            borderRadius: '14px',
            padding: '1.25rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'border-color 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent, #fff)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-soft, rgba(255,255,255,0.08))')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--surface-3, #1a1a1a)', display: 'grid', placeItems: 'center', color: 'var(--accent, #fff)' }}>
              <Globe size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text, #fff)' }}>Domain WHOIS Engine</h3>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted, #888)' }}>Authoritative IANA RDAP lookup</p>
            </div>
          </div>
          <ArrowRight size={16} style={{ color: 'var(--text-muted, #888)' }} />
        </div>

        <div
          onClick={() => navigate('/recruiter-analyzer')}
          style={{
            background: 'var(--surface-2, #0e0e0e)',
            border: '1px solid var(--border-soft, rgba(255,255,255,0.08))',
            borderRadius: '14px',
            padding: '1.25rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'border-color 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent, #fff)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-soft, rgba(255,255,255,0.08))')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--surface-3, #1a1a1a)', display: 'grid', placeItems: 'center', color: 'var(--accent, #fff)' }}>
              <Sparkles size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text, #fff)' }}>Recruiter JD Matcher</h3>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted, #888)' }}>ATS match % & candidate score</p>
            </div>
          </div>
          <ArrowRight size={16} style={{ color: 'var(--text-muted, #888)' }} />
        </div>

        <div
          onClick={() => navigate('/tech-architect')}
          style={{
            background: 'var(--surface-2, #0e0e0e)',
            border: '1px solid var(--border-soft, rgba(255,255,255,0.08))',
            borderRadius: '14px',
            padding: '1.25rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'border-color 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent, #fff)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-soft, rgba(255,255,255,0.08))')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--surface-3, #1a1a1a)', display: 'grid', placeItems: 'center', color: 'var(--accent, #fff)' }}>
              <Layers size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text, #fff)' }}>Tech Stack Architect</h3>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted, #888)' }}>System flow & cloud cost specs</p>
            </div>
          </div>
          <ArrowRight size={16} style={{ color: 'var(--text-muted, #888)' }} />
        </div>
      </div>

      {/* Interactive Tool Tab Bar */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          padding: '4px',
          background: 'var(--surface-2, #0e0e0e)',
          border: '1px solid var(--border, rgba(255,255,255,0.1))',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          width: 'fit-content',
        }}
      >
        <button
          onClick={() => setActiveTab('og-preview')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            background: activeTab === 'og-preview' ? 'var(--accent, #fff)' : 'transparent',
            color: activeTab === 'og-preview' ? 'var(--accent-foreground, #000)' : 'var(--text-muted, #aaa)',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Social OpenGraph Previewer
        </button>
        <button
          onClick={() => setActiveTab('json-ts')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            background: activeTab === 'json-ts' ? 'var(--accent, #fff)' : 'transparent',
            color: activeTab === 'json-ts' ? 'var(--accent-foreground, #000)' : 'var(--text-muted, #aaa)',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          JSON to TypeScript Studio
        </button>
        <button
          onClick={() => setActiveTab('dev-utils')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            background: activeTab === 'dev-utils' ? 'var(--accent, #fff)' : 'transparent',
            color: activeTab === 'dev-utils' ? 'var(--accent-foreground, #000)' : 'var(--text-muted, #aaa)',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Developer Fast Utils
        </button>
      </div>

      {/* Tab 1: OpenGraph Visualizer */}
      {activeTab === 'og-preview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Controls */}
          <div
            style={{
              background: 'var(--surface-2, #0e0e0e)',
              border: '1px solid var(--border, rgba(255,255,255,0.12))',
              borderRadius: '16px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text, #fff)' }}>
              Metadata Parameters
            </h3>

            <div>
              <label htmlFor="og-title" style={{ fontSize: '0.78rem', color: 'var(--text-muted, #888)', display: 'block', marginBottom: '4px' }}>
                Page Title (og:title)
              </label>
              <input
                id="og-title"
                value={ogTitle}
                onChange={(e) => setOgTitle(e.target.value)}
                style={{ width: '100%', background: 'var(--surface, #060606)', border: '1px solid var(--border, rgba(255,255,255,0.12))', borderRadius: '8px', padding: '8px 10px', color: 'var(--text, #fff)', fontSize: '0.85rem', outline: 'none' }}
              />
            </div>

            <div>
              <label htmlFor="og-desc" style={{ fontSize: '0.78rem', color: 'var(--text-muted, #888)', display: 'block', marginBottom: '4px' }}>
                Description (og:description)
              </label>
              <textarea
                id="og-desc"
                value={ogDesc}
                onChange={(e) => setOgDesc(e.target.value)}
                rows={3}
                style={{ width: '100%', background: 'var(--surface, #060606)', border: '1px solid var(--border, rgba(255,255,255,0.12))', borderRadius: '8px', padding: '8px 10px', color: 'var(--text, #fff)', fontSize: '0.85rem', outline: 'none', resize: 'vertical' }}
              />
            </div>

            <div>
              <label htmlFor="og-img" style={{ fontSize: '0.78rem', color: 'var(--text-muted, #888)', display: 'block', marginBottom: '4px' }}>
                Social Card Image URL (og:image)
              </label>
              <input
                id="og-img"
                value={ogImage}
                onChange={(e) => setOgImage(e.target.value)}
                style={{ width: '100%', background: 'var(--surface, #060606)', border: '1px solid var(--border, rgba(255,255,255,0.12))', borderRadius: '8px', padding: '8px 10px', color: 'var(--text, #fff)', fontSize: '0.85rem', outline: 'none' }}
              />
            </div>

            <div>
              <label htmlFor="og-url" style={{ fontSize: '0.78rem', color: 'var(--text-muted, #888)', display: 'block', marginBottom: '4px' }}>
                Canonical URL (og:url)
              </label>
              <input
                id="og-url"
                value={ogUrl}
                onChange={(e) => setOgUrl(e.target.value)}
                style={{ width: '100%', background: 'var(--surface, #060606)', border: '1px solid var(--border, rgba(255,255,255,0.12))', borderRadius: '8px', padding: '8px 10px', color: 'var(--text, #fff)', fontSize: '0.85rem', outline: 'none' }}
              />
            </div>

            <button
              onClick={handleCopyMeta}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px',
                borderRadius: '8px',
                background: 'var(--accent, #fff)',
                color: 'var(--accent-foreground, #000)',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: '4px',
              }}
            >
              {copiedMeta ? <Check size={16} style={{ color: '#22c55e' }} /> : <Copy size={16} />}
              <span>{copiedMeta ? 'Copied HTML Tags' : 'Copy HTML <head> Tags'}</span>
            </button>
          </div>

          {/* Previews */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Twitter Card Preview */}
            <div
              style={{
                background: '#000',
                border: '1px solid #2f3336',
                borderRadius: '16px',
                overflow: 'hidden',
                maxWidth: '480px',
              }}
            >
              <div style={{ padding: '8px 12px', background: '#16181c', borderBottom: '1px solid #2f3336', fontSize: '0.74rem', color: '#71767b' }}>
                Twitter / X Summary Card Preview
              </div>
              <img
                src={ogImage}
                alt="OG Preview"
                style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';
                }}
              />
              <div style={{ padding: '12px' }}>
                <span style={{ fontSize: '0.74rem', color: '#71767b' }}>{ogUrl.replace(/^https?:\/\//, '')}</span>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#e7e9ea', marginTop: '2px', lineHeight: 1.3 }}>
                  {ogTitle}
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#71767b', marginTop: '4px', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {ogDesc}
                </p>
              </div>
            </div>

            {/* Google SERP Preview */}
            <div
              style={{
                background: 'var(--surface-2, #0e0e0e)',
                border: '1px solid var(--border, rgba(255,255,255,0.12))',
                borderRadius: '16px',
                padding: '1.25rem',
                maxWidth: '480px',
              }}
            >
              <span style={{ fontSize: '0.74rem', color: 'var(--text-subtle, #777)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                Google Search Snippet Preview
              </span>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted, #888)' }}>{ogUrl}</div>
              <h4 style={{ fontSize: '1.1rem', color: '#8ab4f8', marginTop: '2px', fontWeight: 400, cursor: 'pointer' }}>
                {ogTitle}
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted, #aaa)', marginTop: '4px', lineHeight: 1.4 }}>
                {ogDesc}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: JSON to TypeScript */}
      {activeTab === 'json-ts' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* JSON Input */}
          <div
            style={{
              background: 'var(--surface-2, #0e0e0e)',
              border: '1px solid var(--border, rgba(255,255,255,0.12))',
              borderRadius: '16px',
              padding: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text, #fff)' }}>JSON Payload Input</span>
              <button
                onClick={convertJsonToTs}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: 'var(--surface-3, #222)',
                  color: 'var(--text, #fff)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  border: '1px solid var(--border, rgba(255,255,255,0.1))',
                }}
              >
                Format & Convert
              </button>
            </div>
            <textarea
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value);
                try {
                  setTsOutput(generateTypescriptInterfaces(JSON.parse(e.target.value), 'RootResponse'));
                } catch {
                  // ignore
                }
              }}
              rows={14}
              style={{
                width: '100%',
                background: 'var(--surface, #060606)',
                border: '1px solid var(--border, rgba(255,255,255,0.12))',
                borderRadius: '8px',
                padding: '0.85rem',
                color: '#4ade80',
                fontFamily: 'monospace',
                fontSize: '0.82rem',
                outline: 'none',
                lineHeight: 1.5,
              }}
            />
          </div>

          {/* TypeScript Output */}
          <div
            style={{
              background: 'var(--surface-2, #0e0e0e)',
              border: '1px solid var(--border, rgba(255,255,255,0.12))',
              borderRadius: '16px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text, #fff)' }}>Generated TypeScript</span>
                <button
                  onClick={handleCopyTs}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    background: 'var(--accent, #fff)',
                    color: 'var(--accent-foreground, #000)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {copiedTs ? <Check size={12} style={{ color: '#22c55e' }} /> : <Copy size={12} />}
                  <span>{copiedTs ? 'Copied' : 'Copy Types'}</span>
                </button>
              </div>
              <pre
                style={{
                  background: 'var(--surface, #060606)',
                  border: '1px solid var(--border, rgba(255,255,255,0.12))',
                  borderRadius: '8px',
                  padding: '0.85rem',
                  color: '#93c5fd',
                  fontFamily: 'monospace',
                  fontSize: '0.82rem',
                  overflowX: 'auto',
                  margin: 0,
                  minHeight: '260px',
                  lineHeight: 1.5,
                }}
              >
                {tsOutput}
              </pre>
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-subtle, #666)', marginTop: '8px' }}>
              Includes nested object recursion and typing.
            </span>
          </div>
        </div>
      )}

      {/* Tab 3: Dev Fast Utils */}
      {activeTab === 'dev-utils' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* Base64 Tool */}
          <div
            style={{
              background: 'var(--surface-2, #0e0e0e)',
              border: '1px solid var(--border, rgba(255,255,255,0.12))',
              borderRadius: '16px',
              padding: '1.25rem',
            }}
          >
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text, #fff)', marginBottom: '8px' }}>
              Base64 Encoder / Decoder
            </h3>
            <input
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Enter text..."
              style={{ width: '100%', background: 'var(--surface, #060606)', border: '1px solid var(--border, rgba(255,255,255,0.12))', borderRadius: '8px', padding: '8px 10px', color: 'var(--text, #fff)', fontSize: '0.85rem', outline: 'none', marginBottom: '8px' }}
            />
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <button
                onClick={() => setBase64Result(btoa(rawText))}
                style={{ padding: '6px 12px', borderRadius: '6px', background: 'var(--accent, #fff)', color: 'var(--accent-foreground, #000)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Encode Base64
              </button>
              <button
                onClick={() => {
                  try {
                    setBase64Result(atob(rawText));
                  } catch {
                    setBase64Result('Invalid Base64 string');
                  }
                }}
                style={{ padding: '6px 12px', borderRadius: '6px', background: 'var(--surface-3, #222)', color: 'var(--text, #fff)', border: '1px solid var(--border, rgba(255,255,255,0.1))', fontSize: '0.78rem', cursor: 'pointer' }}
              >
                Decode Base64
              </button>
            </div>
            {base64Result && (
              <div style={{ background: 'var(--surface, #060606)', padding: '8px', borderRadius: '6px', fontSize: '0.8rem', fontFamily: 'monospace', color: '#4ade80', wordBreak: 'break-all' }}>
                {base64Result}
              </div>
            )}
          </div>

          {/* UUID v4 Generator */}
          <div
            style={{
              background: 'var(--surface-2, #0e0e0e)',
              border: '1px solid var(--border, rgba(255,255,255,0.12))',
              borderRadius: '16px',
              padding: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text, #fff)' }}>UUID v4 Generator</h3>
              <button
                onClick={handleGenerateUuids}
                style={{ padding: '6px 12px', borderRadius: '6px', background: 'var(--accent, #fff)', color: 'var(--accent-foreground, #000)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Generate 4 UUIDs
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '12px' }}>
              {uuidList.length === 0 ? (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted, #777)' }}>Click button to generate cryptographic UUIDs</span>
              ) : (
                uuidList.map((u) => (
                  <div
                    key={u}
                    onClick={() => {
                      navigator.clipboard.writeText(u);
                      alert(`Copied ${u}`);
                    }}
                    style={{
                      background: 'var(--surface, #060606)',
                      padding: '7px 10px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontFamily: 'monospace',
                      color: 'var(--text, #fff)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                    title="Click to copy"
                  >
                    <span>{u}</span>
                    <Copy size={12} style={{ color: 'var(--text-muted, #888)' }} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
