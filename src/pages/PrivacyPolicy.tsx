import { Link } from 'react-router-dom';
import { ShieldCheck, Cookie, BarChart3, Mail, FileText, Lock, Globe, ExternalLink } from 'lucide-react';
import { usePortfolioMotion } from '../lib/usePortfolioMotion';
import { useSEO } from '../lib/useSEO';

const BASE_URL = 'https://mritify.online';

export default function PrivacyPolicy() {
  usePortfolioMotion();
  useSEO({
    title: 'Privacy Policy | mritify.online — Data Protection & Google AdSense Policy',
    description: 'Privacy Policy for mritify.online — transparent details on data handling, Google AdSense cookies, DoubleClick DART cookies, analytics, and user privacy rights.',
    canonical: `${BASE_URL}/privacy-policy`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'PrivacyPolicy',
      name: 'Privacy Policy — mritify.online',
      url: `${BASE_URL}/privacy-policy`,
      author: { '@type': 'Person', name: 'Mritunjay Kumar' },
    },
  });

  return (
    <div className="page-wrapper" style={{ paddingTop: '6rem', paddingBottom: '5rem', background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      <section className="page-header" style={{ padding: '2rem 0 3rem' }}>
        <div className="container">
          <div className="breadcrumb" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: 'var(--text)' }}>Privacy Policy</span>
          </div>
          <div className="page-header-content">
            <div className="badge-playful" style={{ marginBottom: '1rem' }}>
              <ShieldCheck size={13} />
              <span>Data Protection &amp; Governance</span>
            </div>
            <h1 className="page-title" style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)', fontWeight: 600, letterSpacing: '-0.04em', margin: '0.5rem 0 1rem', color: 'var(--text)' }}>
              Privacy <em>Policy</em>
            </h1>
            <p className="page-subtitle" style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '650px', lineHeight: 1.65 }}>
              Last updated: September 2026 — Comprehensive privacy documentation detailing our data practices, cookie usage, and full compliance with Google AdSense program policies.
            </p>
          </div>
        </div>
      </section>

      <section className="section" style={{ padding: '2rem 0 4rem' }}>
        <div className="container" style={{ maxWidth: 860 }}>
          
          {/* Section 1: Who We Are */}
          <div style={{ padding: 'clamp(1.25rem, 3vw, 2rem)', marginBottom: '1.5rem', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}>
            <h2 style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: '0.75rem', display: 'flex', gap: 8, alignItems: 'center', color: 'var(--text)' }}>
              <ShieldCheck size={18} /> 1. Overview &amp; Site Ownership
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.92rem', marginBottom: '0.75rem' }}>
              <strong>mritify.online</strong> is the professional engineering portfolio and technical publication website owned and operated by <strong>Mritunjay Kumar</strong>, an AI Engineer and Full Stack Developer based in Bihar / New Delhi, India.
            </p>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.92rem', margin: 0 }}>
              We value your personal privacy. This document clearly articulates what information is collected when you browse mritify.online, how that information is utilized, and your absolute control over third-party advertising cookies. For any questions, you may contact us directly at <a href="mailto:me@mritify.online" style={{ color: 'var(--text)', textDecoration: 'underline' }}>me@mritify.online</a> or <a href="mailto:support@mritify.online" style={{ color: 'var(--text)', textDecoration: 'underline' }}>support@mritify.online</a>.
            </p>
          </div>

          {/* Section 2: Google AdSense & DoubleClick DART Cookies */}
          <div style={{ padding: 'clamp(1.25rem, 3vw, 2rem)', marginBottom: '1.5rem', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}>
            <h2 style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: '0.75rem', display: 'flex', gap: 8, alignItems: 'center', color: 'var(--text)' }}>
              <BarChart3 size={18} /> 2. Google AdSense &amp; Advertising Cookies Policy
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.92rem', marginBottom: '0.75rem' }}>
              We partner with <strong>Google AdSense</strong> to display advertisements across select pages of this website to support open-source tooling, tutorials, and development research. In accordance with Google&apos;s publisher policies, please be advised of the following:
            </p>
            <ul style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.92rem', paddingLeft: '1.25rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <strong>Third-Party Vendors:</strong> Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to our website or other websites on the Internet.
              </li>
              <li>
                <strong>Personalized Advertising:</strong> Google&apos;s use of advertising cookies (such as the DoubleClick DART cookie) enables Google and its partners to serve ads to our users based on their visit to mritify.online and/or other sites across the World Wide Web.
              </li>
              <li>
                <strong>Cookie Opt-Out Mechanism:</strong> Users may opt out of personalized advertising at any time by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text)', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: 3 }}>Google Ads Settings <ExternalLink size={12} /></a>.
              </li>
              <li>
                <strong>Industry Opt-Out:</strong> Alternatively, users can opt out of a third-party vendor&apos;s use of cookies for personalized advertising by visiting the <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text)', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: 3 }}>AboutAds.info Opt-Out Portal <ExternalLink size={12} /></a> or the <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text)', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: 3 }}>Network Advertising Initiative <ExternalLink size={12} /></a>.
              </li>
            </ul>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.92rem', margin: 0 }}>
              If you have not opted out of third-party ad serving, cookies of other third-party vendors or ad networks may also be utilized to display contextually relevant advertisements.
            </p>
          </div>

          {/* Section 3: Log Files & Web Analytics */}
          <div style={{ padding: 'clamp(1.25rem, 3vw, 2rem)', marginBottom: '1.5rem', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}>
            <h2 style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: '0.75rem', display: 'flex', gap: 8, alignItems: 'center', color: 'var(--text)' }}>
              <FileText size={18} /> 3. Log Files &amp; Web Analytics
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.92rem', marginBottom: '0.75rem' }}>
              Like most standard websites, mritify.online utilizes standard server log files. The information inside the log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date/time stamp, referring/exit pages, and number of clicks.
            </p>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.92rem', margin: 0 }}>
              This data is exclusively used to analyze trends, administer the site, diagnose routing performance, and track user engagement in aggregate. IP addresses and log data are not linked to personally identifiable information.
            </p>
          </div>

          {/* Section 4: Browser Local Storage & Cookies */}
          <div style={{ padding: 'clamp(1.25rem, 3vw, 2rem)', marginBottom: '1.5rem', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}>
            <h2 style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: '0.75rem', display: 'flex', gap: 8, alignItems: 'center', color: 'var(--text)' }}>
              <Cookie size={18} /> 4. Local Storage &amp; First-Party Preferences
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.92rem', marginBottom: '0.75rem' }}>
              We use client-side <code>localStorage</code> strictly for functional preferences:
            </p>
            <ul style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.92rem', paddingLeft: '1.25rem', margin: 0 }}>
              <li>Persisting your theme preference (Dark Mode vs Light Mode).</li>
              <li>Storing temporary article like states without requiring invasive login credentials.</li>
              <li>Remembering welcome banner dismissals to maintain an uncluttered reading experience.</li>
            </ul>
          </div>

          {/* Section 5: GDPR and CCPA Rights */}
          <div style={{ padding: 'clamp(1.25rem, 3vw, 2rem)', marginBottom: '1.5rem', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}>
            <h2 style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: '0.75rem', display: 'flex', gap: 8, alignItems: 'center', color: 'var(--text)' }}>
              <Globe size={18} /> 5. International Data Rights (GDPR &amp; CCPA)
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.92rem', marginBottom: '0.75rem' }}>
              Regardless of your location, you have rights regarding your personal data:
            </p>
            <ul style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.92rem', paddingLeft: '1.25rem', marginBottom: '0.75rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong>The Right to Access:</strong> You may request copies of any personal communications sent to us.</li>
              <li><strong>The Right to Rectification:</strong> You may request corrections to any inaccurate data.</li>
              <li><strong>The Right to Erasure:</strong> You may request that we delete contact inquiries and messages.</li>
              <li><strong>CCPA Non-Discrimination:</strong> We do not sell personal data to third parties.</li>
            </ul>
          </div>

          {/* Section 6: Security & Data Integrity */}
          <div style={{ padding: 'clamp(1.25rem, 3vw, 2rem)', marginBottom: '1.5rem', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}>
            <h2 style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: '0.75rem', display: 'flex', gap: 8, alignItems: 'center', color: 'var(--text)' }}>
              <Lock size={18} /> 6. Data Security &amp; Encryption
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.92rem', margin: 0 }}>
              All network traffic to and from mritify.online is strictly encrypted using industry-standard TLS 1.3 cryptographic protocols with automatic HTTPS redirection, ensuring complete confidentiality during transit.
            </p>
          </div>

          {/* Section 7: Contact Information */}
          <div style={{ padding: '2rem', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}>
            <h2 style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: '0.75rem', display: 'flex', gap: 8, alignItems: 'center', color: 'var(--text)' }}>
              <Mail size={18} /> 7. Contact &amp; Privacy Officer
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.92rem', marginBottom: '0.75rem' }}>
              If you have any questions, concerns, or requests regarding this Privacy Policy or our compliance with Google AdSense terms, please contact:
            </p>
            <div style={{ color: 'var(--text)', fontSize: '0.9rem', lineHeight: 1.8 }}>
              <div><strong>Mritunjay Kumar</strong> — Founder &amp; Developer</div>
              <div>Direct: <a href="mailto:me@mritify.online" style={{ color: 'var(--text)', textDecoration: 'underline' }}>me@mritify.online</a></div>
              <div>Technical Support: <a href="mailto:support@mritify.online" style={{ color: 'var(--text)', textDecoration: 'underline' }}>support@mritify.online</a></div>
              <div>Website: <a href="https://mritify.online" style={{ color: 'var(--text)', textDecoration: 'underline' }}>https://mritify.online</a></div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
