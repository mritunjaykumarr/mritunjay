import { useEffect, useState } from 'react';
import { ExternalLink, Globe, Sparkles, Sliders, TrainFront, Code2, ArrowRight } from 'lucide-react';

interface ToolOutRedirectCardProps {
  toolName?: string;
  targetUrl?: string;
}

export default function ToolOutRedirectCard({
  toolName = 'Developer Tools Suite',
  targetUrl = 'https://toolout.online'
}: ToolOutRedirectCardProps) {
  const [countdown, setCountdown] = useState(3);
  const [redirectCancelled, setRedirectCancelled] = useState(false);

  useEffect(() => {
    if (redirectCancelled) return;

    if (countdown <= 0) {
      window.location.href = targetUrl;
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, redirectCancelled, targetUrl]);

  return (
    <div style={{
      maxWidth: '680px',
      margin: '2rem auto',
      padding: '2.5rem 2rem',
      borderRadius: '20px',
      background: 'rgba(255, 255, 255, 0.03)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Glow orb */}
      <div style={{
        position: 'absolute',
        top: '-80px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '260px',
        height: '260px',
        background: 'radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, rgba(168, 85, 247, 0.05) 50%, transparent 70%)',
        filter: 'blur(30px)',
        pointerEvents: 'none'
      }} />

      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 14px',
        borderRadius: '999px',
        background: 'rgba(56, 189, 248, 0.1)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        color: '#38bdf8',
        fontSize: '0.82rem',
        fontWeight: 600,
        marginBottom: '1.25rem'
      }}>
        <Sparkles size={14} />
        <span>GRADUATED TO STANDALONE PLATFORM</span>
      </div>

      <h2 style={{
        fontSize: 'clamp(1.75rem, 3.5vw, 2.3rem)',
        fontWeight: 700,
        letterSpacing: '-0.03em',
        color: 'var(--text)',
        marginBottom: '0.75rem',
        lineHeight: 1.2
      }}>
        {toolName} has moved to <span style={{
          background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>ToolOut</span>
      </h2>

      <p style={{
        color: 'var(--text-muted)',
        fontSize: '0.98rem',
        lineHeight: 1.6,
        maxWidth: '520px',
        margin: '0 auto 1.75rem'
      }}>
        All developer utilities, RDAP domain intelligence, rail tracking, and code sandboxes have graduated to our high-performance standalone suite at <strong>toolout.online</strong>.
      </p>

      {/* Countdown & Immediate Redirect CTA */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '2rem'
      }}>
        <a
          href={targetUrl}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
            color: '#ffffff',
            padding: '12px 28px',
            borderRadius: '12px',
            fontWeight: 600,
            fontSize: '0.95rem',
            textDecoration: 'none',
            boxShadow: '0 4px 20px rgba(2, 132, 199, 0.35)',
            transition: 'all 0.2s ease'
          }}
        >
          <span>Continue to ToolOut</span>
          <ExternalLink size={16} />
        </a>

        {!redirectCancelled ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <span>Auto-redirecting in <strong>{countdown}s</strong>...</span>
            <button
              onClick={() => setRedirectCancelled(true)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#38bdf8',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: 0,
                fontSize: 'inherit'
              }}
            >
              Stay on portfolio
            </button>
          </div>
        ) : (
          <div style={{ fontSize: '0.82rem', color: '#4ade80' }}>
            ✓ Auto-redirect paused.
          </div>
        )}
      </div>

      {/* Direct tool shortcuts */}
      <div style={{
        borderTop: '1px solid var(--border)',
        paddingTop: '1.5rem',
        textAlign: 'left'
      }}>
        <p style={{
          fontSize: '0.78rem',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: 'var(--text-muted)',
          marginBottom: '1rem',
          fontWeight: 600
        }}>
          Direct ToolOut Quick-Links:
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '10px'
        }}>
          <a
            href="https://toolout.online/tools/domain-checker"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              textDecoration: 'none',
              fontSize: '0.84rem'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={14} style={{ color: '#38bdf8' }} /> Domain WHOIS
            </span>
            <ArrowRight size={12} style={{ opacity: 0.6 }} />
          </a>

          <a
            href="https://toolout.online/tools/og-preview"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              textDecoration: 'none',
              fontSize: '0.84rem'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sliders size={14} style={{ color: '#c084fc' }} /> OG Previewer
            </span>
            <ArrowRight size={12} style={{ opacity: 0.6 }} />
          </a>

          <a
            href="https://toolout.online/tools/json-to-ts"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              textDecoration: 'none',
              fontSize: '0.84rem'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Code2 size={14} style={{ color: '#34d399' }} /> JSON to TS
            </span>
            <ArrowRight size={12} style={{ opacity: 0.6 }} />
          </a>

          <a
            href="https://toolout.online/tools/irctc"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              textDecoration: 'none',
              fontSize: '0.84rem'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrainFront size={14} style={{ color: '#f59e0b' }} /> IRCTC Radar
            </span>
            <ArrowRight size={12} style={{ opacity: 0.6 }} />
          </a>
        </div>
      </div>
    </div>
  );
}
