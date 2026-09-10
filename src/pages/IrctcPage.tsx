import { Link } from 'react-router-dom';
import ToolOutRedirectCard from '../components/ToolOutRedirectCard';
import { usePortfolioMotion } from '../lib/usePortfolioMotion';
import { useSEO, SEO_CONFIGS } from '../lib/useSEO';

export default function IrctcPage() {
  usePortfolioMotion();
  useSEO(SEO_CONFIGS.irctc || {
    title: 'IRCTC Rail Intelligence Suite | ToolOut by Mritunjay',
    description: 'IRCTC rail tracking has moved to ToolOut (toolout.online): Real-time Indian Railways PNR status, live running radar, and seat radar.',
    keywords: 'ToolOut, IRCTC API, PNR Status, Live Train Running Status, Train Timetable, Seat Availability, Mritunjay Kumar',
  });

  return (
    <div
      className="page-wrapper irctc-page"
      style={{
        paddingTop: '6rem',
        paddingBottom: '5rem',
        background: 'var(--bg)',
        color: 'var(--text)',
        minHeight: '100vh',
      }}
    >
      {/* Page Header */}
      <section className="page-header" style={{ padding: '2rem 0 1rem' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div
            className="breadcrumb"
            style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}
          >
            <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
              Home
            </Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: 'var(--text)' }}>IRCTC Rail Intelligence</span>
          </div>
        </div>
      </section>

      {/* Redirect Card */}
      <div className="container" style={{ margin: '0 auto' }}>
        <ToolOutRedirectCard
          toolName="IRCTC Rail Intelligence Suite"
          targetUrl="https://toolout.online/tools/irctc"
        />
      </div>
    </div>
  );
}
