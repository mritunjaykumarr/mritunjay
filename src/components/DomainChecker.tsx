import { useState, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, Search, Clock, Calendar, Server, ShieldCheck,
  AlertCircle, Check, Copy, RefreshCw, Sparkles,
  Zap, Building2, CheckCircle2, History, ListFilter, Trash2,
  Layers, Info, X
} from 'lucide-react';
import type { DomainLookupResult } from '../lib/domainLookupCore.ts';

const SAMPLE_DOMAINS = ['google.com', 'github.com', 'cloudflare.com', 'react.dev', 'openai.com'];
const HISTORY_STORAGE_KEY = 'domain_checker_history_v1';
const MAX_HISTORY_ITEMS = 10;

interface BulkDomainItem {
  domain: string;
  status: 'pending' | 'loading' | 'success' | 'error';
  data?: DomainLookupResult;
  error?: string;
}

export default function DomainChecker() {
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');
  const [domainInput, setDomainInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DomainLookupResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  // Bulk Lookup State
  const [bulkInput, setBulkInput] = useState('');
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkResults, setBulkResults] = useState<BulkDomainItem[]>([]);
  const [bulkProgress, setBulkProgress] = useState(0);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setHistory(parsed.slice(0, MAX_HISTORY_ITEMS));
      }
    } catch {
      // localStorage unavailable or private browsing
    }
  }, []);

  const saveToHistory = (domain: string) => {
    const clean = domain.trim().toLowerCase();
    if (!clean) return;
    setHistory((prev) => {
      const filtered = prev.filter((d) => d !== clean);
      const updated = [clean, ...filtered].slice(0, MAX_HISTORY_ITEMS);
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore storage errors
      }
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  // Single Domain Lookup
  const handleLookup = async (targetDomain?: string) => {
    const query = (targetDomain || domainInput).trim();
    if (!query) {
      setError('Please enter a valid domain name (e.g. example.com).');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/domain-lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ domain: query }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to lookup domain registrar details.');
      }

      setResult(data as DomainLookupResult);
      if (targetDomain) {
        setDomainInput(targetDomain);
      }
      saveToHistory((data as DomainLookupResult).domain);
    } catch (err: any) {
      setResult(null);
      setError(err.message || 'An unexpected error occurred while querying WHOIS registry.');
    } finally {
      setLoading(false);
    }
  };

  // Bulk Domain Lookup Execution
  const handleBulkLookup = async () => {
    const lines = bulkInput
      .split('\n')
      .map((d) => d.trim().toLowerCase())
      .filter((d) => d.length > 0);

    const uniqueDomains = Array.from(new Set(lines)).slice(0, 10);

    if (uniqueDomains.length === 0) {
      setError('Please enter at least one domain name to lookup.');
      return;
    }

    setBulkLoading(true);
    setError(null);
    setBulkProgress(0);

    const initialItems: BulkDomainItem[] = uniqueDomains.map((d) => ({
      domain: d,
      status: 'pending',
    }));
    setBulkResults(initialItems);

    for (let i = 0; i < uniqueDomains.length; i++) {
      const dom = uniqueDomains[i];

      // Update active loading item
      setBulkResults((prev) =>
        prev.map((item, idx) => (idx === i ? { ...item, status: 'loading' } : item))
      );

      try {
        const res = await fetch('/api/domain-lookup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ domain: dom }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || data.error || 'Lookup failed');
        }

        setBulkResults((prev) =>
          prev.map((item, idx) =>
            idx === i ? { ...item, status: 'success', data: data as DomainLookupResult } : item
          )
        );
        saveToHistory((data as DomainLookupResult).domain);
      } catch (err: any) {
        setBulkResults((prev) =>
          prev.map((item, idx) =>
            idx === i ? { ...item, status: 'error', error: err.message || 'Lookup failed' } : item
          )
        );
      }

      setBulkProgress(Math.round(((i + 1) / uniqueDomains.length) * 100));

      // Sequential delay (200ms) to respect server rate limits
      if (i < uniqueDomains.length - 1) {
        await new Promise((r) => setTimeout(r, 200));
      }
    }

    setBulkLoading(false);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (activeTab === 'single') {
      handleLookup();
    } else {
      handleBulkLookup();
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (isoString: string | null) => {
    if (!isoString) return 'Not available';
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      }).format(date);
    } catch {
      return isoString;
    }
  };

  return (
    <section
      className="v3-section domain-checker-section"
      id="domain-checker"
      aria-label="Domain Registrar & WHOIS Lookup Tool"
      style={{ background: 'var(--bg)', position: 'relative' }}
    >
      <div className="v3-container">
        {/* ——— Section Heading ——— */}
        <div className="v3-section-heading">
          <div className="v3-kicker" style={{ marginBottom: '0.75rem' }}>
            <Globe size={13} style={{ color: 'var(--text)' }} />
            <span>WHOIS & RDAP Intelligence Tool</span>
          </div>
          <h2>
            Check a Domain’s <em>Registrar & Details</em>
          </h2>
          <p
            style={{
              maxWidth: '640px',
              color: 'var(--text-muted)',
              marginTop: '0.5rem',
              fontSize: '1rem',
              lineHeight: 1.65,
            }}
          >
            Instantly query official registry databases (RDAP/WHOIS) to inspect authoritative domain registrars,
            creation timelines, expiration dates, and active nameservers.
          </p>
        </div>

        {/* ——— Main Tool Card ——— */}
        <div
          className="domain-checker-card"
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: 'clamp(1.25rem, 3vw, 2.25rem)',
            boxShadow: 'var(--shadow-sm)',
            maxWidth: '900px',
            margin: '0 auto',
            backdropFilter: 'blur(16px)',
          }}
        >
          {/* Mode Switcher Tabs */}
          <div
            role="tablist"
            aria-label="Domain lookup modes"
            style={{
              display: 'flex',
              gap: '0.5rem',
              marginBottom: '1.5rem',
              borderBottom: '1px solid var(--border)',
              paddingBottom: '0.75rem',
            }}
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'single'}
              onClick={() => {
                setActiveTab('single');
                setError(null);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0.45rem 0.95rem',
                borderRadius: '6px',
                background: activeTab === 'single' ? 'var(--surface-3)' : 'transparent',
                border: activeTab === 'single' ? '1px solid var(--border-accent)' : '1px solid transparent',
                color: activeTab === 'single' ? 'var(--text)' : 'var(--text-muted)',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <Search size={14} />
              <span>Single Domain</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'bulk'}
              onClick={() => {
                setActiveTab('bulk');
                setError(null);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0.45rem 0.95rem',
                borderRadius: '6px',
                background: activeTab === 'bulk' ? 'var(--surface-3)' : 'transparent',
                border: activeTab === 'bulk' ? '1px solid var(--border-accent)' : '1px solid transparent',
                color: activeTab === 'bulk' ? 'var(--text)' : 'var(--text-muted)',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <Layers size={14} />
              <span>Bulk Lookup (up to 10)</span>
            </button>
          </div>

          {/* ——— Single Domain Form ——— */}
          {activeTab === 'single' && (
            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="domain-search-bar-row">
                <div className="domain-search-box-wrap">
                  <div className="domain-search-icon" aria-hidden="true">
                    <Search size={18} />
                  </div>
                  <label htmlFor="domain-input" className="sr-only" style={{ display: 'none' }}>
                    Domain name to look up
                  </label>
                  <input
                    id="domain-input"
                    type="text"
                    className="domain-search-input"
                    value={domainInput}
                    onChange={(e) => {
                      setDomainInput(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Enter domain name (e.g. google.com, vercel.app)..."
                    disabled={loading}
                    aria-required="true"
                    aria-invalid={!!error}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                  />
                  {domainInput && (
                    <button
                      type="button"
                      className="domain-search-clear-btn"
                      onClick={() => {
                        setDomainInput('');
                        setError(null);
                      }}
                      aria-label="Clear input text"
                      title="Clear input"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !domainInput.trim()}
                  className="btn-primary v3-button-primary domain-submit-btn"
                  aria-busy={loading}
                  aria-label={loading ? 'Querying domain registry...' : 'Check registrar details'}
                  style={{
                    opacity: loading || !domainInput.trim() ? 0.7 : 1,
                    cursor: loading || !domainInput.trim() ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                      <span>Querying...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>Check Registrar</span>
                    </>
                  )}
                </button>
              </div>

              {/* Quick Presets */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Quick test:</span>
                {SAMPLE_DOMAINS.map((domain) => (
                  <button
                    key={domain}
                    type="button"
                    onClick={() => handleLookup(domain)}
                    disabled={loading}
                    aria-label={`Look up ${domain}`}
                    style={{
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      borderRadius: '6px',
                      padding: '0.25rem 0.65rem',
                      fontSize: '0.78rem',
                      color: 'var(--text-2)',
                      cursor: 'pointer',
                      fontFamily: 'var(--mono)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-accent)';
                      e.currentTarget.style.color = 'var(--text)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.color = 'var(--text-2)';
                    }}
                  >
                    {domain}
                  </button>
                ))}
              </div>

              {/* Search History (Last 10 queries) */}
              {history.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    flexWrap: 'wrap',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-soft)',
                  }}
                >
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <History size={12} /> Recent:
                  </span>
                  {history.map((histDomain) => (
                    <button
                      key={histDomain}
                      type="button"
                      onClick={() => handleLookup(histDomain)}
                      disabled={loading}
                      title={`Repeat lookup for ${histDomain}`}
                      style={{
                        background: 'var(--surface-3)',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        padding: '0.2rem 0.55rem',
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        fontFamily: 'var(--mono)',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--text)';
                        e.currentTarget.style.borderColor = 'var(--border-accent)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--text-muted)';
                        e.currentTarget.style.borderColor = 'var(--border)';
                      }}
                    >
                      {histDomain}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={clearHistory}
                    title="Clear search history"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-subtle)',
                      cursor: 'pointer',
                      padding: '0.2rem',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              )}
            </form>
          )}

          {/* ——— Bulk Lookup Form ——— */}
          {activeTab === 'bulk' && (
            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label
                  htmlFor="bulk-domain-input"
                  style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}
                >
                  Enter domain names (one per line, up to 10):
                </label>
                <textarea
                  id="bulk-domain-input"
                  rows={4}
                  value={bulkInput}
                  onChange={(e) => {
                    setBulkInput(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder={"google.com\ngithub.com\nreact.dev\ncloudflare.com"}
                  disabled={bulkLoading}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    fontSize: '0.9rem',
                    fontFamily: 'var(--mono)',
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text)',
                    outline: 'none',
                    lineHeight: 1.5,
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Requests are run sequentially to prevent rate limits.
                </span>
                <button
                  type="submit"
                  disabled={bulkLoading || !bulkInput.trim()}
                  className="btn-primary v3-button-primary"
                  aria-busy={bulkLoading}
                  style={{
                    height: '44px',
                    padding: '0 1.5rem',
                    fontSize: '0.9rem',
                    opacity: bulkLoading || !bulkInput.trim() ? 0.7 : 1,
                  }}
                >
                  {bulkLoading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                      <span>Processing ({bulkProgress}%)...</span>
                    </>
                  ) : (
                    <>
                      <ListFilter size={16} />
                      <span>Start Bulk Lookup</span>
                    </>
                  )}
                </button>
              </div>

              {/* Bulk Progress Bar */}
              {bulkLoading && (
                <div
                  style={{
                    height: '6px',
                    background: 'var(--surface-3)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                    marginTop: '0.5rem',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${bulkProgress}%`,
                      background: 'var(--accent)',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              )}
            </form>
          )}

          {/* ——— Inline Error Message ——— */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                role="alert"
                aria-live="polite"
                style={{
                  marginTop: '1.25rem',
                  padding: '0.85rem 1.1rem',
                  borderRadius: '8px',
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: '#f87171',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem',
                  fontSize: '0.88rem',
                  lineHeight: 1.5,
                }}
              >
                <AlertCircle size={17} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ——— Single Result Display ——— */}
          <AnimatePresence>
            {activeTab === 'single' && result && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.3 }}
                role="region"
                aria-live="polite"
                aria-label={`WHOIS lookup details for ${result.domain}`}
                style={{
                  marginTop: '2rem',
                  paddingTop: '1.75rem',
                  borderTop: '1px solid var(--border)',
                }}
              >
                {/* Result Header Bar */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: 'var(--surface-3)',
                        display: 'grid',
                        placeItems: 'center',
                        color: 'var(--text)',
                      }}
                      aria-hidden="true"
                    >
                      <Globe size={19} />
                    </div>
                    <div>
                      <h3
                        style={{
                          fontSize: '1.35rem',
                          fontWeight: 600,
                          margin: 0,
                          letterSpacing: '-0.02em',
                          color: 'var(--text)',
                        }}
                      >
                        {result.domain}
                      </h3>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Authoritative WHOIS / RDAP Record
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {result.cached && (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '0.25rem 0.6rem',
                          borderRadius: '6px',
                          background: 'rgba(59, 130, 246, 0.12)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          color: '#60a5fa',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                        }}
                      >
                        <Zap size={12} />
                        <span>Cached 1h</span>
                      </span>
                    )}

                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '6px',
                        background: 'rgba(34, 197, 94, 0.12)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        color: '#4ade80',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                      }}
                    >
                      <CheckCircle2 size={12} />
                      <span>Registered</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => handleCopy(JSON.stringify(result, null, 2))}
                      className="btn-secondary v3-button-quiet"
                      style={{ height: '32px', padding: '0 0.75rem', fontSize: '0.78rem' }}
                      title="Copy raw JSON data to clipboard"
                    >
                      {copied ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copied ? 'Copied JSON' : 'Copy JSON'}</span>
                    </button>
                  </div>
                </div>

                {/* Info Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '1rem',
                  }}
                >
                  {/* Registrar Card */}
                  <div
                    style={{
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      borderRadius: '10px',
                      padding: '1.1rem 1.25rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.4rem' }}>
                      <Building2 size={15} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>Registrar</span>
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)', wordBreak: 'break-word' }}>
                      {result.registrar}
                    </div>
                  </div>

                  {/* Registration Date Card */}
                  <div
                    style={{
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      borderRadius: '10px',
                      padding: '1.1rem 1.25rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.4rem' }}>
                      <Calendar size={15} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>Created Date</span>
                    </div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 500, color: 'var(--text)' }}>
                      {formatDate(result.registrationDate)}
                    </div>
                  </div>

                  {/* Expiry Date Card */}
                  <div
                    style={{
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      borderRadius: '10px',
                      padding: '1.1rem 1.25rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.4rem' }}>
                      <Clock size={15} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>Expiration Date</span>
                    </div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 500, color: 'var(--text)' }}>
                      {formatDate(result.expiryDate)}
                    </div>
                  </div>

                  {/* Last Updated Card */}
                  {result.updatedDate && (
                    <div
                      style={{
                        background: 'var(--surface-2)',
                        border: '1px solid var(--border)',
                        borderRadius: '10px',
                        padding: '1.1rem 1.25rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.4rem' }}>
                        <RefreshCw size={15} style={{ color: 'var(--text-muted)' }} />
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>Last Updated</span>
                      </div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 500, color: 'var(--text)' }}>
                        {formatDate(result.updatedDate)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Nameservers Section */}
                <div
                  style={{
                    marginTop: '1.25rem',
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    padding: '1.1rem 1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.65rem' }}>
                    <Server size={15} style={{ color: 'var(--text-muted)' }} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                      Nameservers ({result.nameservers.length})
                    </span>
                  </div>
                  {result.nameservers.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {result.nameservers.map((ns) => (
                        <span
                          key={ns}
                          style={{
                            background: 'var(--surface-3)',
                            border: '1px solid var(--border)',
                            borderRadius: '6px',
                            padding: '0.3rem 0.65rem',
                            fontFamily: 'var(--mono)',
                            fontSize: '0.82rem',
                            color: 'var(--text-2)',
                          }}
                        >
                          {ns}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      No nameserver records reported.
                    </span>
                  )}
                </div>

                {/* Domain Status Flags */}
                {result.status && result.status.length > 0 && (
                  <div
                    style={{
                      marginTop: '1.25rem',
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      borderRadius: '10px',
                      padding: '1.1rem 1.25rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.65rem' }}>
                      <ShieldCheck size={15} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                        Domain Status Flags
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                      {result.status.map((st) => (
                        <span
                          key={st}
                          style={{
                            background: 'var(--surface-3)',
                            border: '1px solid var(--border)',
                            borderRadius: '6px',
                            padding: '0.25rem 0.55rem',
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            fontFamily: 'var(--mono)',
                          }}
                        >
                          {st}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Privacy & Accuracy Disclaimer Note */}
                <div
                  style={{
                    marginTop: '1.25rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border-soft)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.5,
                  }}
                >
                  <Info size={14} style={{ flexShrink: 0, color: 'var(--text-subtle)' }} />
                  <span>
                    <strong>Note on accuracy:</strong> Personal owner information may be redacted by default under GDPR/WHOIS privacy protection services. The registrar, timeline, and DNS hostnames remain authoritative.
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ——— Bulk Results Table / List ——— */}
          {activeTab === 'bulk' && bulkResults.length > 0 && (
            <div
              style={{
                marginTop: '2rem',
                paddingTop: '1.75rem',
                borderTop: '1px solid var(--border)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>
                  Bulk Results ({bulkResults.filter((r) => r.status === 'success').length}/{bulkResults.length})
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    const exportData = bulkResults.map((r) => ({
                      domain: r.domain,
                      status: r.status,
                      registrar: r.data?.registrar || 'N/A',
                      expiryDate: r.data?.expiryDate || 'N/A',
                      nameservers: r.data?.nameservers || [],
                    }));
                    handleCopy(JSON.stringify(exportData, null, 2));
                  }}
                  className="btn-secondary v3-button-quiet"
                  style={{ height: '32px', padding: '0 0.75rem', fontSize: '0.78rem' }}
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copied ? 'Copied JSON' : 'Export Results'}</span>
                </button>
              </div>

              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {bulkResults.map((item) => (
                  <div
                    key={item.domain}
                    style={{
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      borderRadius: '10px',
                      padding: '0.9rem 1.15rem',
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <Globe size={16} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text)' }}>
                        {item.domain}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
                      {item.status === 'loading' && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <RefreshCw size={13} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> Querying...
                        </span>
                      )}

                      {item.status === 'pending' && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>Queued</span>
                      )}

                      {item.status === 'error' && (
                        <span style={{ fontSize: '0.8rem', color: '#f87171' }}>
                          {item.error || 'Failed'}
                        </span>
                      )}

                      {item.status === 'success' && item.data && (
                        <>
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-2)' }}>
                            {item.data.registrar}
                          </span>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              padding: '0.2rem 0.5rem',
                              borderRadius: '4px',
                              background: 'rgba(34, 197, 94, 0.1)',
                              color: '#4ade80',
                              border: '1px solid rgba(34, 197, 94, 0.25)',
                            }}
                          >
                            Active
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
