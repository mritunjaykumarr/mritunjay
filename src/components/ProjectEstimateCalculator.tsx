import { useState } from 'react';
import { Calculator, Check, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

interface ProjectType {
  id: string;
  name: string;
  baseUsd: number;
  baseInr: number;
  days: number;
  desc: string;
}

interface FeatureAddon {
  id: string;
  label: string;
  usd: number;
  inr: number;
  days: number;
}

const PROJECT_TYPES: ProjectType[] = [
  {
    id: 'landing',
    name: 'Landing Page / Launch',
    baseUsd: 299,
    baseInr: 12000,
    days: 4,
    desc: 'High-converting single-page site with custom animations & SEO'
  },
  {
    id: 'webapp',
    name: 'Modern Web App (MVP)',
    baseUsd: 699,
    baseInr: 28000,
    days: 12,
    desc: 'Full React 19 / TypeScript SPA with routing & backend APIs'
  },
  {
    id: 'saas_ai',
    name: 'Fullstack AI / SaaS Platform',
    baseUsd: 1299,
    baseInr: 52000,
    days: 20,
    desc: 'Complete software architecture with custom LLM workflows & databases'
  },
  {
    id: 'modernize',
    name: 'Performance & UI Overhaul',
    baseUsd: 450,
    baseInr: 18000,
    days: 6,
    desc: 'Upgrade legacy stack, boost Core Web Vitals to 95+, and add motion'
  }
];

const ADDONS: FeatureAddon[] = [
  { id: 'auth', label: 'User Auth & Role Management', usd: 120, inr: 5000, days: 2 },
  { id: 'db', label: 'Supabase / PostgreSQL Database', usd: 100, inr: 4000, days: 2 },
  { id: 'ai', label: 'Custom LLM Streaming & AI Chat', usd: 250, inr: 10000, days: 3 },
  { id: 'sockets', label: 'Realtime WebSockets & Live Sync', usd: 180, inr: 7000, days: 3 },
  { id: 'payments', label: 'Payment Gateway (Stripe / Razorpay)', usd: 150, inr: 6000, days: 2 },
  { id: 'admin', label: 'Custom Admin Analytics Dashboard', usd: 200, inr: 8000, days: 3 },
  { id: 'seo_pwa', label: 'Advanced SEO, PWA & Speed Audit', usd: 90, inr: 3500, days: 1 }
];

export default function ProjectEstimateCalculator() {
  const [currency, setCurrency] = useState<'USD' | 'INR'>('USD');
  const [selectedType, setSelectedType] = useState<string>('webapp');
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['auth', 'db', 'ai']);
  const [isExpress, setIsExpress] = useState(false);

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const currentType = PROJECT_TYPES.find((t) => t.id === selectedType) || PROJECT_TYPES[1];

  const addonsTotalUsd = selectedAddons.reduce((acc, id) => {
    const addon = ADDONS.find((a) => a.id === id);
    return acc + (addon ? addon.usd : 0);
  }, 0);

  const addonsTotalInr = selectedAddons.reduce((acc, id) => {
    const addon = ADDONS.find((a) => a.id === id);
    return acc + (addon ? addon.inr : 0);
  }, 0);

  const baseTotal = currency === 'USD' ? currentType.baseUsd + addonsTotalUsd : currentType.baseInr + addonsTotalInr;
  const finalPrice = isExpress ? Math.round(baseTotal * 1.25) : baseTotal;

  const totalDaysRaw = currentType.days + selectedAddons.reduce((acc, id) => {
    const addon = ADDONS.find((a) => a.id === id);
    return acc + (addon ? addon.days : 0);
  }, 0);

  const finalDays = isExpress ? Math.max(Math.round(totalDaysRaw * 0.7), 3) : totalDaysRaw;

  const handleBookScope = () => {
    const addonLabels = selectedAddons
      .map((id) => ADDONS.find((a) => a.id === id)?.label)
      .filter(Boolean)
      .join(', ');

    const estimateNote = `Estimate for ${currentType.name} (${currency === 'USD' ? `$${finalPrice}` : `₹${finalPrice.toLocaleString()}`}, ~${finalDays} days delivery)${addonLabels ? ` with: ${addonLabels}` : ''}`;

    window.dispatchEvent(new CustomEvent('open-contact', { detail: { prefill: estimateNote } }));
  };

  return (
    <div className="estimate-calculator-card" style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '18px', padding: 'clamp(1.5rem, 3vw, 2.25rem)', boxShadow: 'var(--shadow-md)', margin: '2rem 0' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'var(--surface-3)', border: '1px solid var(--border)', display: 'grid', placeItems: 'center', color: 'var(--text)' }}>
              <Calculator size={16} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
              Interactive Project Quote Calculator
            </h3>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            Configure your technical requirements to generate an instant cost and timeline estimate.
          </p>
        </div>

        {/* Currency Switcher */}
        <div style={{ display: 'flex', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '3px' }}>
          <button
            type="button"
            onClick={() => setCurrency('USD')}
            style={{
              padding: '4px 12px',
              borderRadius: '6px',
              border: 'none',
              background: currency === 'USD' ? 'var(--card)' : 'transparent',
              color: currency === 'USD' ? 'var(--text)' : 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            USD ($)
          </button>
          <button
            type="button"
            onClick={() => setCurrency('INR')}
            style={{
              padding: '4px 12px',
              borderRadius: '6px',
              border: 'none',
              background: currency === 'INR' ? 'var(--card)' : 'transparent',
              color: currency === 'INR' ? 'var(--text)' : 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            INR (₹)
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        {/* Left Options Column */}
        <div>
          {/* Step 1: Project Type */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
              1. Select Project Type
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {PROJECT_TYPES.map((type) => {
                const isSelected = selectedType === type.id;
                const price = currency === 'USD' ? `$${type.baseUsd}` : `₹${type.baseInr.toLocaleString()}`;
                return (
                  <div
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      background: isSelected ? 'var(--surface-3)' : 'var(--surface-2)',
                      border: `1px solid ${isSelected ? 'var(--primary, #6366f1)' : 'var(--border)'}`,
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.18s ease'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text)' }}>
                        {type.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {type.desc}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '12px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)' }}>{price}</span>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>~{type.days} days</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Feature Add-ons */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
              2. Add Technical Capabilities &amp; Integrations
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
              {ADDONS.map((addon) => {
                const isChecked = selectedAddons.includes(addon.id);
                const addonPrice = currency === 'USD' ? `+$${addon.usd}` : `+₹${addon.inr.toLocaleString()}`;
                return (
                  <div
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: isChecked ? 'var(--surface-3)' : 'var(--surface-2)',
                      border: `1px solid ${isChecked ? 'var(--primary, #6366f1)' : 'var(--border)'}`,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.78rem',
                      userSelect: 'none',
                      transition: 'all 0.18s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: '4px',
                          border: `1px solid ${isChecked ? '#22c55e' : 'var(--border)'}`,
                          background: isChecked ? '#22c55e' : 'transparent',
                          color: '#ffffff',
                          display: 'grid',
                          placeItems: 'center',
                          flexShrink: 0
                        }}
                      >
                        {isChecked && <Check size={12} />}
                      </div>
                      <span style={{ color: 'var(--text)', fontWeight: isChecked ? 600 : 400 }}>
                        {addon.label}
                      </span>
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 500, flexShrink: 0, marginLeft: '6px' }}>
                      {addonPrice}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 3: Speed Option */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
              3. Delivery Velocity
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setIsExpress(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  background: !isExpress ? 'var(--surface-3)' : 'var(--surface-2)',
                  border: `1px solid ${!isExpress ? 'var(--primary, #6366f1)' : 'var(--border)'}`,
                  color: 'var(--text)',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Standard Pace (Standard)
              </button>
              <button
                type="button"
                onClick={() => setIsExpress(true)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  background: isExpress ? 'var(--surface-3)' : 'var(--surface-2)',
                  border: `1px solid ${isExpress ? 'var(--primary, #6366f1)' : 'var(--border)'}`,
                  color: 'var(--text)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <span>⚡ Express Sprint (+25%)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Summary Card */}
        <div
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}
        >
          <div>
            <div style={{ fontSize: '0.76rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              Estimated Project Investment
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text)', margin: '0.25rem 0' }}>
              {currency === 'USD' ? `$${finalPrice}` : `₹${finalPrice.toLocaleString()}`}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#22c55e' }}>
              <Clock size={14} />
              <span>Estimated Delivery: <strong>~{finalDays} Business Days</strong></span>
            </div>
          </div>

          {/* Scope Checklist */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
              Included Scope Highlights:
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: 'var(--text)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Check size={14} style={{ color: '#22c55e' }} /> {currentType.name}
              </li>
              {selectedAddons.map((id) => (
                <li key={id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} style={{ color: '#22c55e' }} /> {ADDONS.find((a) => a.id === id)?.label}
                </li>
              ))}
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Check size={14} style={{ color: '#22c55e' }} /> 1-Month Free Post-Launch Support &amp; Fixes
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Check size={14} style={{ color: '#22c55e' }} /> Clean TypeScript / React 19 Architecture
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={handleBookScope}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.85rem 1rem', fontSize: '0.92rem', fontWeight: 600 }}
          >
            <span>Lock In Quote &amp; Discuss</span>
            <ArrowRight size={16} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            <ShieldCheck size={14} />
            <span>100% Milestone-based payments · Zero lock-in</span>
          </div>
        </div>
      </div>
    </div>
  );
}
