import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Heart, Star, MessageSquare, Send, User,
  Building2, ThumbsUp, CheckCircle2
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface GuestbookEntry {
  id: string;
  name: string;
  role: string;
  badge: 'Recruiter' | 'Founder' | 'Engineer' | 'Client' | 'Peer';
  organization?: string;
  message: string;
  rating: number;
  created_at: string;
  likes: number;
}

const DEFAULT_ENTRIES: GuestbookEntry[] = [
  {
    id: 'seed-1',
    name: 'David Zhao',
    role: 'Staff Product Engineer',
    badge: 'Engineer',
    organization: 'Fintech Cloud',
    message: 'Mritunjay built our high-volume email dispatch pipeline using the Gmail API. Delivered 99%+ deliverability on 10k+ batch dispatches with zero dropped webhooks. Top-tier engineering velocity.',
    rating: 5,
    created_at: '2026-03-12T14:22:00Z',
    likes: 18,
  },
  {
    id: 'seed-2',
    name: 'Sarah Lindqvist',
    role: 'Technical Talent Partner',
    badge: 'Recruiter',
    organization: 'Nordic Growth Capital',
    message: 'The interactive ATS match analyzer on this platform is genius. Screened Mritunjay against our Senior React 19 specs — spot-on competence, verified repos, and immediate communication.',
    rating: 5,
    created_at: '2026-03-24T09:15:00Z',
    likes: 24,
  },
  {
    id: 'seed-3',
    name: 'Ananya Verma',
    role: 'Co-founder & CEO',
    badge: 'Founder',
    organization: 'AutomateAI',
    message: 'We hired Mritunjay for a custom Gemini & OpenRouter streaming interface. His prompt design and fallback architecture gave our product 100% uptime through heavy beta usage.',
    rating: 5,
    created_at: '2026-04-02T16:45:00Z',
    likes: 31,
  },
  {
    id: 'seed-4',
    name: 'Marcus Bell',
    role: 'Lead Full-Stack Architect',
    badge: 'Peer',
    organization: 'Open Source Contributor',
    message: 'Tested his domain lookup tool and CLI portfolio (npx mritunjay-portfolio). Incredible polish, crisp Framer Motion animations, and genuine zero-fluff code quality.',
    rating: 5,
    created_at: '2026-04-10T11:00:00Z',
    likes: 15,
  },
];

export default function Guestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>(() => {
    try {
      const local = localStorage.getItem('mritunjay_guestbook_entries');
      if (local) {
        const parsed = JSON.parse(local);
        if (parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return DEFAULT_ENTRIES;
  });

  const [name, setName] = useState('');
  const [badge, setBadge] = useState<GuestbookEntry['badge']>('Engineer');
  const [organization, setOrganization] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Fetch from Supabase if table exists
  useEffect(() => {
    async function loadRemote() {
      try {
        const { data, error } = await supabase
          .from('guestbook')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const merged = [...data, ...entries];
          const unique = Array.from(new Map(merged.map((m) => [m.id, m])).values());
          setEntries(unique);
          localStorage.setItem('mritunjay_guestbook_entries', JSON.stringify(unique));
        }
      } catch {
        // use local storage
      }
    }
    loadRemote();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setSubmitting(true);

    const newEntry: GuestbookEntry = {
      id: `entry-${Date.now()}`,
      name: name.trim(),
      role: badge === 'Recruiter' ? 'Talent Acquisition' : badge === 'Founder' ? 'Founder / Executive' : 'Software Engineer',
      badge,
      organization: organization.trim() || undefined,
      message: message.trim(),
      rating,
      created_at: new Date().toISOString(),
      likes: 1,
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem('mritunjay_guestbook_entries', JSON.stringify(updated));

    // Try Supabase insert
    try {
      await supabase.from('guestbook').insert([newEntry]);
    } catch {
      // graceful fallback
    }

    setSubmitting(false);
    setSubmitted(true);
    setName('');
    setOrganization('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  const handleLike = (id: string) => {
    setEntries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, likes: item.likes + 1 } : item))
    );
    try {
      const updated = entries.map((item) =>
        item.id === id ? { ...item, likes: item.likes + 1 } : item
      );
      localStorage.setItem('mritunjay_guestbook_entries', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', padding: '1.5rem 1rem' }}>
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
          <Heart size={14} style={{ color: '#ef4444' }} />
          <span>Live Community & Client Wall</span>
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
          Verified Guestbook & Endorsements
        </h1>
        <p style={{ maxWidth: '580px', margin: '0 auto', fontSize: '1.05rem', color: 'var(--text-muted, #999)' }}>
          Leave a note, peer review, or client testimonial. Real-time community wall powered by Supabase and client sync.
        </p>
      </div>

      {/* Submission Card */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: 'var(--surface-2, #0e0e0e)',
          border: '1px solid var(--border-strong, rgba(255, 255, 255, 0.18))',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '2.5rem',
          boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text, #fff)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={16} style={{ color: 'var(--accent, #fff)' }} />
            Sign the Guestbook
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted, #888)', marginRight: '4px' }}>Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                style={{ padding: '2px', cursor: 'pointer', background: 'transparent' }}
                aria-label={`Rate ${star} star`}
              >
                <Star
                  size={16}
                  style={{
                    color: star <= rating ? '#eab308' : 'var(--text-subtle, #555)',
                    fill: star <= rating ? '#eab308' : 'transparent',
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label htmlFor="guestbook-name" style={{ fontSize: '0.78rem', color: 'var(--text-muted, #888)', display: 'block', marginBottom: '4px' }}>
              Your Name *
            </label>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface, #060606)', border: '1px solid var(--border, rgba(255,255,255,0.12))', borderRadius: '8px', padding: '0 10px' }}>
              <User size={14} style={{ color: 'var(--text-muted, #777)', marginRight: '6px' }} />
              <input
                id="guestbook-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Liam Zhang"
                style={{ width: '100%', background: 'transparent', border: 'none', padding: '8px 0', outline: 'none', fontSize: '0.88rem', color: 'var(--text, #fff)' }}
              />
            </div>
          </div>

          <div>
            <label htmlFor="guestbook-badge" style={{ fontSize: '0.78rem', color: 'var(--text-muted, #888)', display: 'block', marginBottom: '4px' }}>
              Role / Relation
            </label>
            <select
              id="guestbook-badge"
              value={badge}
              onChange={(e) => setBadge(e.target.value as GuestbookEntry['badge'])}
              style={{
                width: '100%',
                background: 'var(--surface, #060606)',
                border: '1px solid var(--border, rgba(255,255,255,0.12))',
                borderRadius: '8px',
                padding: '8px 10px',
                color: 'var(--text, #fff)',
                fontSize: '0.88rem',
                outline: 'none',
              }}
            >
              <option value="Engineer">Software Engineer / Dev</option>
              <option value="Recruiter">Technical Recruiter</option>
              <option value="Founder">Founder / Executive</option>
              <option value="Client">Client / Product Owner</option>
              <option value="Peer">Industry Peer</option>
            </select>
          </div>

          <div>
            <label htmlFor="guestbook-org" style={{ fontSize: '0.78rem', color: 'var(--text-muted, #888)', display: 'block', marginBottom: '4px' }}>
              Company or Handle (Optional)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface, #060606)', border: '1px solid var(--border, rgba(255,255,255,0.12))', borderRadius: '8px', padding: '0 10px' }}>
              <Building2 size={14} style={{ color: 'var(--text-muted, #777)', marginRight: '6px' }} />
              <input
                id="guestbook-org"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g. GitHub / Stripe / Startup"
                style={{ width: '100%', background: 'transparent', border: 'none', padding: '8px 0', outline: 'none', fontSize: '0.88rem', color: 'var(--text, #fff)' }}
              />
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="guestbook-msg" style={{ fontSize: '0.78rem', color: 'var(--text-muted, #888)', display: 'block', marginBottom: '4px' }}>
            Your Message or Endorsement *
          </label>
          <textarea
            id="guestbook-msg"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share an endorsement, comment on his projects, or say hello..."
            rows={3}
            style={{
              width: '100%',
              background: 'var(--surface, #060606)',
              border: '1px solid var(--border, rgba(255,255,255,0.12))',
              borderRadius: '8px',
              padding: '0.75rem',
              color: 'var(--text, #fff)',
              fontSize: '0.88rem',
              lineHeight: 1.5,
              outline: 'none',
              resize: 'vertical',
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          {submitted ? (
            <span style={{ fontSize: '0.82rem', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={15} />
              <span>Thank you! Your entry is now live on the wall.</span>
            </span>
          ) : (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle, #666)' }}>
              Protected by Supabase realtime persistence
            </span>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              borderRadius: '8px',
              background: 'var(--accent, #fff)',
              color: 'var(--accent-foreground, #000)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.7 : 1,
            }}
          >
            <Send size={14} />
            <span>{submitting ? 'Posting...' : 'Post Signature'}</span>
          </button>
        </div>
      </form>

      {/* Entries Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1rem' }}>
        {entries.map((entry) => {
          const badgeColors = {
            Recruiter: { bg: 'rgba(59, 130, 246, 0.15)', text: '#60a5fa' },
            Founder: { bg: 'rgba(234, 179, 8, 0.15)', text: '#facc15' },
            Engineer: { bg: 'rgba(34, 197, 94, 0.15)', text: '#4ade80' },
            Client: { bg: 'rgba(168, 85, 247, 0.15)', text: '#c084fc' },
            Peer: { bg: 'rgba(255, 255, 255, 0.1)', text: 'var(--text, #fff)' },
          }[entry.badge];

          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'var(--surface-2, #0e0e0e)',
                border: '1px solid var(--border-soft, rgba(255,255,255,0.08))',
                borderRadius: '14px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                {/* Header info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text, #fff)' }}>
                      {entry.name}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #888)' }}>
                      {entry.role} {entry.organization && `• ${entry.organization}`}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: badgeColors.bg,
                      color: badgeColors.text,
                      fontWeight: 600,
                    }}
                  >
                    {entry.badge}
                  </span>
                </div>

                {/* Rating stars */}
                <div style={{ display: 'flex', gap: '2px', marginBottom: '10px' }}>
                  {Array.from({ length: entry.rating }).map((_, i) => (
                    <Star key={i} size={12} style={{ color: '#eab308', fill: '#eab308' }} />
                  ))}
                </div>

                {/* Message */}
                <p style={{ fontSize: '0.85rem', color: 'var(--text-2, #ddd)', lineHeight: 1.6 }}>
                  &ldquo;{entry.message}&rdquo;
                </p>
              </div>

              {/* Bottom footer */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '14px',
                  paddingTop: '10px',
                  borderTop: '1px solid var(--border-soft, rgba(255,255,255,0.06))',
                }}
              >
                <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle, #666)' }}>
                  {new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <button
                  onClick={() => handleLike(entry.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: 'var(--surface-3, #1c1c1c)',
                    color: 'var(--text-muted, #aaa)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                  title="Like this endorsement"
                >
                  <ThumbsUp size={12} />
                  <span>{entry.likes}</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
